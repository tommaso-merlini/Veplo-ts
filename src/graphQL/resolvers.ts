import { Context } from "../../apollo/context";
import { GraphQLError, printSourceLocation } from "graphql";
import checkConstants from "../controllers/checkConstants";
import authenticateToken from "../controllers/authenticateToken";
import { reverseGeocoding } from "../controllers/reverseGeocoding";
import { checkPostCode } from "../controllers/checkPostCode";
import { createPostCode } from "../controllers/createPostCode";
import Product from "../schemas/Product.model";
import Cap from "../schemas/Cap.model";
import getRequestedFields from "../controllers/getRequestedFields";
import Shop from "../schemas/Shop.model";
import getDiffs from "../controllers/getDiffs";
import checkFirebaseErrors from "../controllers/checkFirebaseErrors";
import checkObjectID from "../controllers/checkObjectID";
import checkDiscount from "../controllers/checkDiscount";
import { GraphQLUpload } from "graphql-upload";
import { finished } from "stream/promises";
import streamToBlob from "../controllers/streamToBlob";
import { DeleteObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import uploadToSpaces from "../controllers/uploadToSpaces";
import deleteFromSpaces from "../controllers/deleteFromSpaces";
import handleUpdatedPhotos from "../controllers/handleUpdatedPhotos";
import graphqlFields from "graphql-fields";
import handlePriceEdit from "../controllers/handlePriceEdit";
import productById from "../controllers/queries/productById";
import capByCap from "../controllers/queries/capByCap";
import shopById from "../controllers/queries/shopById";
import shopByFirebaseId from "../controllers/queries/shopByFirebaseId";
import customError from "../controllers/errors/customError";

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    prova: () => {
      // throw Object.assign(new Error("Error"), {
      //   extensions: {
      //     customCode: "code",
      //     customPath: "path",
      //     customMessage: "message",
      //   },
      // });

      return "ciao";
    },
    product: async (_, { id }, __, info) => {
      const product = await productById(id, info);

      return product;
    },
    products: async (_, { range, limit, offset, filters }, __, info) => {
      const searchedCap = await capByCap(filters.cap);

      const coordinates = searchedCap.location.coordinates;
      const latitude = coordinates[0];
      const longitude = coordinates[1];
      const gender = filters.gender;
      const macroCategory = filters.macroCategory;
      const brands = filters.brands;
      const sizes = filters.sizes;
      const checkName = () => {
        if (filters.name != null) {
          return {
            text: {
              query: filters.name,
              path: "name",
              score: { boost: { value: 1 } },
              fuzzy: {
                maxEdits: 2,
                prefixLength: 4,
              },
            },
          };
        } else {
          return {
            exists: {
              path: "name",
            },
          };
        }
      };
      const checkGender = () => {
        if (filters.gender != null) {
          return { gender };
        } else {
          return {};
        }
      };
      const checkBrands = () => {
        if (filters.brands != null) {
          return {
            brand: { $in: brands },
          };
        } else {
          return {};
        }
      };
      const checkSizes = () => {
        if (filters.sizes != null) {
          return {
            sizes: { $in: sizes },
          };
        } else {
          return {};
        }
      };
      const checkMacroCategory = () => {
        if (filters.macroCategory != null && filters.macroCategory != "") {
          return { macroCategory };
        } else {
          return {};
        }
      };

      const checkMaxPrice = () => {
        if (filters.maxPrice != null) {
          return {
            $or: [
              { "price.v2": { $lte: filters.maxPrice } },
              { "price.v1": { $lte: filters.maxPrice } },
            ],
          };
        } else {
          return {};
        }
      };

      const checkMinPrice = () => {
        if (filters.minPrice != null) {
          return {
            $or: [
              { "price.v2": { $gte: filters.maxPrice } },
              { "price.v1": { $gte: filters.maxPrice } },
            ],
          };
        } else {
          return {};
        }
      };

      const checkColors = () => {
        if (filters.colors != null) {
          return { colors: { $in: filters.colors } };
        } else {
          return {};
        }
      };

      let products: any = await Product.aggregate([
        {
          $search: {
            index: "ProductSearchIndex",
            compound: {
              must: [
                {
                  geoWithin: {
                    path: "location",
                    circle: {
                      center: {
                        type: "Point",
                        coordinates: [latitude, longitude],
                      },
                      radius: range,
                    },
                  },
                },
              ],
              should: [
                //!get the best ranked name on the top of the list
                checkName(),
                {
                  near: {
                    path: "updatedAt",
                    origin: new Date(),
                    pivot: 7776000000,
                    score: {
                      boost: {
                        value: 1,
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        //TODO check mongodb $filters(aggregation) for better filters

        { $match: checkGender() },
        { $match: checkMacroCategory() },
        { $match: checkBrands() },
        { $match: checkSizes() },
        { $match: checkMinPrice() },
        { $match: checkMaxPrice() },
        { $match: checkColors() },
        {
          $match: {
            status: "active",
            "shopOptions.status": "active",
          },
        },

        {
          $project: {
            score: { $meta: "searchScore" },
            // name: 1,
            ...getRequestedFields(info),
            _id: 0,
            id: "$_id",
          },
        },
      ])
        .skip(offset)
        .limit(limit);

      // console.log("=====================================");
      // console.log(products);
      // console.log("=====================================");

      return products;
    },
    shop: async (_, { id }, __, info) => {
      const shop = await shopById(id, info);

      return shop;
    },
    shopByFirebaseId: async (_, { firebaseId }, __, info) => {
      const shop = await shopByFirebaseId(firebaseId, info);

      return shop;
    },
    isShop: async (_, __, { req, admin }: Context) => {
      //token operations
      const token = await admin.auth().verifyIdToken(req.headers.authorization);
      if (!token.isShop) {
        return false;
      } else {
        return true;
      }
    },
    shops: async (_, { range, limit, offset, filters }, __, info) => {
      const searchedCap = await capByCap(filters.cap);

      const coordinates = searchedCap.location.coordinates;

      const checkName = () => {
        if (filters.name != null) {
          return {
            text: {
              query: filters.name,
              path: "name",
              score: { boost: { value: 1 } },
              fuzzy: {
                maxEdits: 2,
                prefixLength: 4,
              },
            },
          };
        } else {
          return {
            exists: {
              path: "name",
            },
          };
        }
      };

      const shops = await Shop.aggregate([
        {
          $search: {
            index: "ShopSearchIndex",
            compound: {
              must: [
                checkName(),
                {
                  geoWithin: {
                    path: "address.location",
                    score: {
                      boost: {
                        value: 3,
                      },
                    },
                    circle: {
                      center: {
                        type: "Point",
                        coordinates: [coordinates[0], coordinates[1]],
                      },
                      radius: range,
                    },
                  },
                },
              ],
              should: [
                //!get the best ranked name on the top of the list
                {
                  near: {
                    path: "createdAt",
                    origin: new Date(),
                    pivot: 7776000000,
                    score: {
                      boost: {
                        value: 1,
                      },
                    },
                  },
                },
              ],
            },
          },
        },
        {
          $match: {
            status: "active",
          },
        },

        {
          $project: {
            score: { $meta: "searchScore" },
            // name: 1,
            ...getRequestedFields(info),
            _id: 0,
            id: "$_id",
          },
        },
      ])
        .skip(offset)
        .limit(limit);

      return shops;
    },
  },

  Mutation: {
    createProduct: async (
      _,
      { shopId, options },
      { admin, req, s3Client }: Context
    ) => {
      let token;
      const promises = [];
      console.log("foto arrivate");
      if (process.env.NODE_ENV !== "development") {
        try {
          token = await admin.auth().verifyIdToken(req.headers.authorization);
        } catch (e) {
          checkFirebaseErrors(e);
        }
      }

      checkConstants(options, "product");

      if (options.price.v2 != null && options.price.v2 > options.price.v1) {
        throw Object.assign(new Error("Error"), {
          extensions: {
            customCode: "400",
            customPath: "price",
            customMessage: "pricev2 cannot be greater than pricev1",
          },
        });
      }

      if (options.price.v2 === options.price.v1) {
        throw Object.assign(new Error("Error"), {
          extensions: {
            customCode: "400",
            customPath: "price",
            customMessage: "pricev2 cannot be the same of pricev1",
          },
        });
      }

      const shop = await shopById(shopId);

      //token operations
      if (process.env.NODE_ENV !== "development")
        authenticateToken(token.uid, shop.firebaseId, token.isShop);

      //TODO handling the macroCategories => insert macroCategory into shop

      let discountPercentage = +(
        100 -
        (100 * options.price.v2) / options.price.v1
      ).toFixed(2);

      if (Number.isNaN(discountPercentage)) {
        discountPercentage = null;
      }

      options.price.discountPercentage = discountPercentage;

      for (let i = 0; i < options.photos.length; i++) {
        promises.push(
          new Promise(async (resolve, reject) => {
            const { createReadStream } = await options.photos[i];
            const stream = await createReadStream();
            // stream.pipe(stream);
            // await finished(stream);
            let blob: any = await streamToBlob(stream);
            console.log(`foto numero ${i} convertita`);
            blob = sharp(blob).resize(1528, 2200);

            const newBlob = await streamToBlob(blob);

            const id = uuidv4();

            const params: any = {
              Bucket: "spaceprova1", // The path to the directory you want to upload the object to, starting with your Space name.
              Key: id, // Object key, referenced whenever you want to access this file later.
              Body: newBlob, // The object's contents. This variable is an object, not a string.
              ACL: "public-read", // Defines ACL permissions, such as private or public.
              ContentType: "image/webp",
            };

            s3Client.send(new PutObjectCommand(params));
            resolve(id);
          })
        );
      }

      const photosId = await Promise.all(promises);

      const newProduct = await Product.create({
        ...options,
        location: {
          type: "Point",
          coordinates: shop.address.location.coordinates,
        },
        shopId: shopId,
        firebaseShopId: shop.firebaseId,
        shopOptions: {
          city: shop.address.city,
          name: shop.name,
          status: shop.status,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        photos: photosId,
        status: "active",
      });

      return { id: newProduct.id, photos: photosId };
    },
    editProduct: async (_, { id, options }, { admin, req }: Context) => {
      let token;
      let updatedPhotosId = [];
      let newPhotosId = [];
      let discountPercentage: null | number;

      if (
        options.status &&
        options.status != "active" &&
        options.status != "not_active"
      ) {
        throw Object.assign(new Error("Error"), {
          extensions: {
            customCode: "400",
            customPath: "status",
            customMessage: "status can only be 'active' or 'not_active",
          },
        });
      }

      if (process.env.NODE_ENV !== "development") {
        try {
          token = await admin.auth().verifyIdToken(req.headers.authorization);
        } catch (e) {
          checkFirebaseErrors(e);
        }
      }

      const product = await productById(id);

      //token operations
      if (process.env.NODE_ENV !== "development")
        authenticateToken(token.uid, product.firebaseShopId, token.isShop);

      //if the price is modified
      if (options.price) {
        options.price = handlePriceEdit(options, product);
      }

      //merging product with options (overwrite equal values)
      const { merge, diffs, isDifferent } = getDiffs(product, options);

      //check if the product has been modified
      if (!isDifferent && !options.newPhotos && !options.deletedPhotos) {
        throw Object.assign(new Error("Error"), {
          extensions: {
            customCode: "304",
            customPath: "product",
            customMessage: "product not modified",
          },
        });
      }

      // throw new Error("ok");

      //check the validity of the fields based on the constants
      checkConstants(merge, "product");

      //delete the removed photos
      if (options.photos) {
        handleUpdatedPhotos(product.photos, options.photos);
      }

      await Product.updateOne({ _id: id }, { ...diffs });

      return product.id;
    },

    deleteProduct: async (_, { id }, { admin, req, s3Client }: Context) => {
      let token;
      if (process.env.NODE_ENV !== "development") {
        try {
          token = await admin.auth().verifyIdToken(req.headers.authorization);
        } catch (e) {
          checkFirebaseErrors(e);
        }
      }

      const product = await productById(id);

      //TODO check dei gender dei prodotti prodotti => se non ci sono piu' prodotti con quel gender eliminare il gender

      if (process.env.NODE_ENV !== "development")
        //token operations
        authenticateToken(token.uid, product.firebaseShopId, token.isShop);

      deleteFromSpaces(product.photos);

      await Product.findByIdAndRemove(id);

      return product.id;
    },
    changeProductStatus: async (_, { id, status }, { admin, req }: Context) => {
      let token;
      if (process.env.NODE_ENV !== "development") {
        try {
          token = await admin.auth().verifyIdToken(req.headers.authorization);
        } catch (e) {
          checkFirebaseErrors(e);
        }
      }

      const product = await productById(id);

      //token operations
      if (process.env.NODE_ENV !== "development")
        authenticateToken(token.uid, product.firebaseShopId, token.isShop);

      await Product.updateOne({ _id: id }, { status: status });

      return true;
    },
    createShop: async (_, { options }, { req, admin }: Context) => {
      //token operations
      let token: any = {
        uid: "prova",
        isShop: true,
      };
      let photosId = [];
      if (process.env.NODE_ENV !== "development") {
        try {
          token = await admin.auth().verifyIdToken(req.headers.authorization);
        } catch (e) {
          checkFirebaseErrors(e);
        }
      }

      if (!token.isShop && process.env.NODE_ENV !== "development") {
        throw Object.assign(new Error("Error"), {
          extensions: {
            customCode: "403",
            customPath: "token",
            customMessage: "token's owner is not a shop",
          },
        });
      }

      const alreadyExists = await Shop.findOne({
        firebaseId: token.uid,
      });

      if (alreadyExists) {
        throw Object.assign(new Error("Error"), {
          extensions: {
            customCode: "409",
            customPath: "shop",
            customMessage: "already exists",
          },
        });
      }

      checkConstants(options, "shop");
      let { center, city, postCode }: any = await reverseGeocoding(
        options.address.location.coordinates[0],
        options.address.location.coordinates[1]
      );

      const postCodeExists = await checkPostCode(Cap, postCode);
      if (!postCodeExists) {
        createPostCode(Cap, postCode, city, center);
      }

      if (options.photo) {
        photosId = await uploadToSpaces(options.photo, "shop");
      }

      options.address.postcode = postCode;
      const newShop = await Shop.create({
        ...options,
        firebaseId: token.uid,
        status: "active",
        createdAt: new Date(),
        photo: photosId[0],
      });

      return newShop.id;
    },
    setIsShop: async (_, { isShop }, { req, admin }: Context) => {
      const token = await admin.auth().verifyIdToken(req.headers.authorization);
      if (isShop === token.isShop) {
        throw Object.assign(new Error("Error"), {
          extensions: {
            customCode: "304",
            customPath: "shop",
            customMessage: "shop not modified",
          },
        });
      }
      await admin.auth().setCustomUserClaims(token.uid, { isShop });

      return true;
    },
    changeShopStatus: async (_, { id, status }, { admin, req }: Context) => {
      let token;
      if (process.env.NODE_ENV !== "development") {
        try {
          token = await admin.auth().verifyIdToken(req.headers.authorization);
        } catch (e) {
          checkFirebaseErrors(e);
        }
      }

      const shop = await shopById(id);

      //token operations
      if (process.env.NODE_ENV !== "development")
        authenticateToken(token.uid, shop.firebaseId, token.isShop);

      await Shop.updateOne({ _id: id }, { status: status });

      await Product.updateMany(
        { firebaseShopId: shop.firebaseId },
        {
          $set: {
            "shopOptions.status": status,
          },
        }
      );

      return true;
    },
    uploadImages: async (
      _,
      { images, proportion },
      { s3Client, admin, req }
    ) => {
      let token: any = {
        uid: "prova",
        isShop: true,
      };
      if (process.env.NODE_ENV !== "development") {
        try {
          token = await admin.auth().verifyIdToken(req.headers.authorization);
        } catch (e) {
          checkFirebaseErrors(e);
        }
      }

      if (!token.isShop) {
        throw Object.assign(new Error("Error"), {
          extensions: {
            customCode: "401",
            customPath: "authorization",
            customMessage: "the user is not authorized to uplaod images",
          },
        });
      }

      const promises = [];
      let width = 1528;
      let height = 2220;
      if (proportion != "product" && proportion != "shop") {
        customError({
          code: "400",
          path: "image",
          message: "proportion can either be 'product' or 'shop'",
        });
      }

      if (proportion === "shop") {
        width = 720;
        height = 450;
      }
      for (let i = 0; i < images.length; i++) {
        promises.push(
          new Promise(async (resolve, reject) => {
            const { createReadStream } = await images[i];
            const stream = await createReadStream();
            // stream.pipe(stream);
            // await finished(stream);
            let blob: any = await streamToBlob(stream);
            // console.log(`foto numero ${i} convertita`);
            blob = sharp(blob).resize(width, height);

            const newBlob = await streamToBlob(blob);

            const id = uuidv4();

            const params: any = {
              Bucket: "veplo-images", // The path to the directory you want to upload the object to, starting with your Space name.
              Key: id, // Object key, referenced whenever you want to access this file later.
              Body: newBlob, // The object's contents. This variable is an object, not a string.
              ACL: "public-read", // Defines ACL permissions, such as private or public.
              ContentType: "image/webp",
            };
            try {
              await s3Client.send(new PutObjectCommand(params));
            } catch (e) {
              customError({
                code: "500",
                path: "upload image",
                message: "an error occured while uploading the image",
              });
            }

            resolve(id);
          })
        );
      }

      const Ids = await Promise.all(promises);

      return Ids;
    },
  },

  Shop: {
    products: async (shop, { limit, offset, see }) => {
      let status: any = "active";
      if (see === "everything") {
        status = { $exists: true };
      }
      const products = await Product.find({
        shopId: shop.id,
        status,
      })
        .skip(offset)
        .limit(limit);

      return products;
    },
  },
};

export default resolvers;

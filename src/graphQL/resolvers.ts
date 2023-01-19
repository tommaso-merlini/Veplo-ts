import { Context } from "../../apollo/context";
import { GraphQLError } from "graphql";
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
import getUpdatedPhotosId from "../controllers/getUpdatedPhotosId";
import graphqlFields from "graphql-fields";

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
      checkObjectID(id);

      const requestedFields = getRequestedFields(info);

      const product = await Product.findById(id, requestedFields);

      if (!product) {
        throw Object.assign(new Error("Error"), {
          extensions: {
            customCode: "404",
            customPath: "id",
            customMessage: "product not found",
          },
        });
      }

      return product;
    },
    products: async (_, { range, limit, offset, filters }, __, info) => {
      const searchedCap = await Cap.findOne({
        cap: filters.cap,
      });

      if (!searchedCap) {
        throw Object.assign(new Error("Error"), {
          extensions: {
            customCode: "404",
            customPath: "cap",
            customMessage: "cap not found",
          },
        });
      }

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
          return { price: { $lte: filters.maxPrice } };
        } else {
          return {};
        }
      };

      const checkMinPrice = () => {
        if (filters.minPrice != null) {
          return { price: { $gte: filters.minPrice } };
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
      checkObjectID(id);

      const requestedFields = getRequestedFields(info);

      const shop = await Shop.findById(id, requestedFields);

      if (!shop) {
        throw Object.assign(new Error("Error"), {
          extensions: {
            customCode: "404",
            customPath: "id",
            customMessage: "shop not found",
          },
        });
      }

      console.log(shop);

      return shop;
    },
    shopByFirebaseId: async (_, { firebaseId }) => {
      const shop = await Shop.findOne({ firebaseId });

      if (!shop) {
        throw Object.assign(new Error("Error"), {
          extensions: {
            customCode: "404",
            customPath: "id",
            customMessage: "shop not found",
          },
        });
      }

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
      const searchedCap = await Cap.findOne({ cap: filters.cap });

      if (!searchedCap) {
        throw Object.assign(new Error("Error"), {
          extensions: {
            customCode: "404",
            customPath: "cap",
            customMessage: "cap not found",
          },
        });
      }

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

      const shop = await Shop.findById(shopId);

      if (!shop) {
        throw Object.assign(new Error("Error"), {
          extensions: {
            customCode: "404",
            customPath: "shop",
            customMessage: "shop not found",
          },
        });
      }

      //token operations
      if (process.env.NODE_ENV !== "development")
        authenticateToken(token.uid, shop.firebaseId, token.isShop);

      //TODO handling the macroCategories => insert macroCategory into shop

      let discountedPrice: null | number;

      if (options.discount) {
        checkDiscount(options.discount);
        discountedPrice =
          options.price - (options.price * options.discount) / 100;
        discountedPrice = +discountedPrice.toFixed(2);
      }

      //photosId = await uploadToSpaces(options.photos);

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
        },
        discountedPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
        photos: photosId,
      });

      return { id: newProduct.id, photos: photosId };
    },
    editProduct: async (_, { id, options }, { admin, req }: Context) => {
      let token;
      let updatedPhotosId = [];
      let newPhotosId = [];
      if (process.env.NODE_ENV !== "development") {
        try {
          token = await admin.auth().verifyIdToken(req.headers.authorization);
        } catch (e) {
          checkFirebaseErrors(e);
        }
      }

      const product = await Product.findById(id);

      if (!product) {
        throw Object.assign(new Error("Error"), {
          extensions: {
            customCode: "404",
            customPath: "id",
            customMessage: "product not found",
          },
        });
      }

      //token operations
      if (process.env.NODE_ENV !== "development")
        authenticateToken(token.uid, product.firebaseShopId, token.isShop);

      //merging product with options (overwrite equal values)
      const { merge, diffs, isDifferent } = getDiffs(product, options);

      //check if the editedProduct = product
      if (!isDifferent && !options.newPhotos && !options.deletedPhotos) {
        throw Object.assign(new Error("Error"), {
          extensions: {
            customCode: "304",
            customPath: "product",
            customMessage: "product not modified",
          },
        });
      }

      //check the fields with the constants
      checkConstants(merge, "product");

      let discountedPrice: null | number;

      if (options.discount) {
        checkDiscount(options.discount);
        discountedPrice =
          product.price - (product.price * options.discount) / 100;
        discountedPrice = +discountedPrice.toFixed(2);
      }

      if (options.newPhotos) {
        newPhotosId = await uploadToSpaces(options.newPhotos);
      }

      if (options.deletedPhotos) await deleteFromSpaces(options.deletedPhotos);

      updatedPhotosId = getUpdatedPhotosId(
        product.photos,
        options.deletedPhotos,
        newPhotosId
      );

      const arePhotosDifferent =
        JSON.stringify(product.photos) != JSON.stringify(updatedPhotosId);

      if (arePhotosDifferent) {
        await Product.updateOne(
          { _id: id },
          { ...diffs, discountedPrice, photos: updatedPhotosId }
        );
      } else {
        await Product.updateOne({ _id: id }, { ...diffs, discountedPrice });
      }

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

      const product = await Product.findById(id);

      if (!product) {
        throw Object.assign(new Error("Error"), {
          extensions: {
            customCode: "404",
            customPath: "id",
            customMessage: "product not found",
          },
        });
      }

      //TODO check dei gender dei prodotti prodotti => se non ci sono piu' prodotti con quel gender eliminare il gender

      if (process.env.NODE_ENV !== "development")
        //token operations
        authenticateToken(token.uid, product.firebaseShopId, token.isShop);

      deleteFromSpaces(product.photos);

      await Product.findByIdAndRemove(id);

      return product.id;
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
        status: "inactive",
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
            customCode: "304 ",
            customPath: "shop",
            customMessage: "shop not modified",
          },
        });
      }
      await admin.auth().setCustomUserClaims(token.uid, { isShop });

      return true;
    },
    createImage: async (_, { files }, { s3Client }) => {
      for (let i = 0; i < files.length; i++) {
        const { createReadStream, filename, mimetype, encoding } = await files[
          i
        ];
        const stream = await createReadStream();
        let blob: any = await streamToBlob(stream);

        blob = sharp(blob).resize(1801, 2600);

        const newBlob = await streamToBlob(blob);

        const params: any = {
          Bucket: "spaceprova1", // The path to the directory you want to upload the object to, starting with your Space name.
          Key: uuidv4(), // Object key, referenced whenever you want to access this file later.
          Body: newBlob, // The object's contents. This variable is an object, not a string.
          ACL: "public-read", // Defines ACL permissions, such as private or public.
          Metadata: {
            // Defines metadata tags.
            "x-amz-meta-my-key": "your-value",
          },
          ContentType: "image/webp",
        };

        await s3Client.send(new PutObjectCommand(params));
      }

      return true;
    },
  },

  Shop: {
    products: async (shop, { limit, offset }) => {
      const products = await Product.find({
        shopId: shop.id,
      })
        .skip(offset)
        .limit(limit);

      return products;
    },
  },
};

export default resolvers;

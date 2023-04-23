import { allFilters, colors } from "../../constants/filters.js";

const checkConstants = (obj: any, is: String) => {
  const colorValues = [];
  const sizeValues = [];
  for (let variation of obj.variations) {
    colorValues.push(variation.color);
    for (let lot of variation.lots) {
      sizeValues.push(lot.size);
    }
  }
  const checkableObject = {
    ...obj.info,
    colors: colorValues,
    sizes: sizeValues,
  };

  for (const property in checkableObject) {
    for (let filter of allFilters) {
      if (Object.keys(filter)[0] === property) {
        if (Array.isArray(checkableObject[property])) {
          for (let value of checkableObject[property]) {
            if (!filter[property as keyof typeof filter].includes(value)) {
              throw new Error(
                `error while checking ${property}, value ${value} does not exist in ${property} list`
              );
            }
          }
        } else {
          if (
            !filter[property as keyof typeof filter].includes(
              checkableObject[property]
            )
          ) {
            throw new Error(
              `error while checking ${property}, value ${checkableObject[property]} does not exist in ${property} list`
            );
          }
          break;
        }
      }
    }
  }
};

export default checkConstants;

/*
 * Recursively merge properties of two objects
 */
function getDiffs(obj1: any, obj2: any) {
  let diffs: any = {};
  let merge = obj1;
  let isDifferent = false;
  for (let p in obj2) {
    for (let k in obj1) {
      if (p === k) {
        //if the name of the values are equal
        if (obj2[p] !== obj1[k]) {
          //but the actual values are different
          // if (typeof obj2[p] === "object" && typeof obj1[k] === "object") {
          //   //if the values are arrays
          //   if (JSON.stringify(obj2[p]) == JSON.stringify(obj1[k])) {
          //     break;
          //   }
          // }
          diffs[p] = obj2[p];
          merge[p] = obj2[p];
          isDifferent = true;
        }
      }
    }
  }

  return {
    merge,
    diffs,
    isDifferent,
  };
}

export default getDiffs;

/*
 * Recursively merge properties of two objects
 */
function getDiffs(obj1, obj2) {
  let diffs = {};
  let merge = obj1;
  let isDifferent = false;
  for (let p in obj2) {
    for (let k in obj1) {
      if (p === k) {
        //if the name of the values are equal
        if (obj2[p] !== obj1[k]) {
          //but the actual values are different
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
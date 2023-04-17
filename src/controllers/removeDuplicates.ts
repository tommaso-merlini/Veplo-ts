export const removeDuplicates = (arr: any[]) => {
  var obj: any = {};
  var ret_arr: any[] = [];
  for (var i = 0; i < arr.length; i++) {
    obj[arr[i]] = true;
  }
  for (var key in obj) {
    ret_arr.push(key);
  }
  return ret_arr;
};

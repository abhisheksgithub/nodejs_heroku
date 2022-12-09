const replaceComparisionStrings = (objString) => {
  const obj = JSON.parse(objString);
  const processString = (obj) => {
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const newKey = keys[i].replace(/^(gte|gt|lte|lt)$/, (str) => `$${str}`);
      if (keys[i] != newKey) {
        obj[newKey] = obj[keys[i]];
        delete obj[keys[i]];
      }
      if (obj[newKey]?.constructor === Object) {
        processString(obj[newKey]);
      }
    }
  };
  processString(obj);
  return JSON.stringify(obj);
};

const filterResponse = (obj, ...responseToBeSent) => {
  const result = {};
  responseToBeSent.forEach((item) => {
    result[item] = obj[item];
  });
  // Object.keys(obj).forEach(item => responseToBeSent.includes(item) || (result[item] = obj[item]))
  return result;
};

export { replaceComparisionStrings, filterResponse };

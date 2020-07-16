export function convertArrayOfObjectsToCSV({ data, columnDelimiter = ',', lineDelimiter = '\n' }) {
  let result;
  let ctr;
  if (data == null || !data.length) {
    return null;
  }
  const keys = Object.keys(data[0]);
  result = keys.join(columnDelimiter) + lineDelimiter;
  data.forEach((item) => {
    ctr = 0;
    keys.forEach((key) => {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];
      ctr += 1;
    });
    result += lineDelimiter;
  });
  return result;
}

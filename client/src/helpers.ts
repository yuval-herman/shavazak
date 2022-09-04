export function formDataToObj(data: FormData) {
  const obj: { [key: string]: any } = {};
  data.forEach((value, key) => {
    if (Object.hasOwn(obj, key)) {
      if (!Array.isArray(obj[key])) {
        obj[key] = [obj[key]];
      }
      obj[key].push(value);
    } else obj[key] = value;
  });
  return obj;
}

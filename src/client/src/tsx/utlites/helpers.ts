export const capatialFirstLetter = (str: string) =>
  str[0].toUpperCase() + str.slice(1);

export const createEnteries = (obj: object) => Object.entries(obj);

// Get function and time to delay. and active the function after the time is passed.
export const delayFunction = (
  // eslint-disable-next-line no-unused-vars
  func: (...args: any[]) => any,
  timeDelay: number
) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve("finish");
    }, timeDelay);
  }).then(() => func());

export const fetchData = async (
  url: string,
  method?: string,
  body?: object
) => {
  const options = body
    ? {
        method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      }
    : {};

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

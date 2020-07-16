import request from 'request';
import log from './logger';

export const options = ({
  url, method, data, headers,
}) => {
  const res = {
    url,
    headers,
    method,
  };
  if (method !== 'GET') res.body = JSON.stringify(data);
  return res;
};
export const requestPromise = (option) => (
  new Promise((resolve, reject) => {
    try {
      request(option, (error, response, body) => {
        if (error) reject(error);
        resolve({
          body,
          response,
          header: response.headers,
        });
      });
    } catch (error) {
      log.error('error in requestJSONPromise', error);
      reject(error);
    }
  })
);

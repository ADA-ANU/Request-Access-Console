import axios from "axios";
import API_URL from "../config";
import { message } from "antd";

//@ts-ignore
export const apiagent = (options) => {
  // if (store.getters['users/isAuthenticated']) {
  //   options.headers = {
  //     Authorization: `Bearer ${store.getters['users/accessToken']}`,
  //   };
  // }
  let token =
    JSON.parse(<string>localStorage.getItem("user")) === null
      ? null
      : JSON.parse(<string>localStorage.getItem("user")).Token;
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;

  const request = axios.create({
    baseURL: API_URL.ROOT_URL,
  });

  // Add a request interceptor
  request.interceptors.request.use(
    (requestConfig) => requestConfig,
    (requestError) => {
      return Promise.reject(requestError);
    }
  );

  // Add a response interceptor
  // request.interceptors.response.use(
  //   (response) => response,
  //   (error) => {
  //     if (error.response.status >= 500) {
  //       message.error("Server Error, please try again.", 10);
  //     }
  //     return Promise.reject(error);
  //   }
  // );

  //@ts-ignore
  const onSuccess = function (response) {
    console.debug("Request Successful!", response);
    return response.data;
  };

  //@ts-ignore
  const onError = function (error) {
    console.error("Request Failed:", error.config);

    if (error.response) {
      // Request was made but server responded with something
      // other than 2xx
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);
    } else {
      // Something else happened while setting up the request
      // triggered the error
      console.error("Error Message:", error.message);
    }
    //message.error('Network Error ...', 10);

    return Promise.reject(error.response || error.message);
  };

  return request(options).then(onSuccess).catch(onError);
};

/**
 * Base HTTP Client
 */
export default {
  // Provide request methods with the default base_url
  // get(url, conf = {}) {
  //   return createClient(baseUrl).get(url, conf)
  //     .then(response => Promise.resolve(response))
  //     .catch(error => Promise.reject(error));
  // },

  get(url: string) {
    return apiagent({
      url: url,
      method: "get",
      //config: { headers: {"Authorization" : `Bearer ${token}`}}
    });
  },

  delete(url: string) {
    return apiagent({
      url: url,
      method: "delete",
    });
  },

  post(url: string, data = {}, config = {}) {
    return apiagent({
      url: url,
      method: "post",
      data: data,
      config: config,
    });
  },

  put(url: string, data = {}) {
    return apiagent({
      url: url,
      method: "put",
      data: data,
    });
  },

  patch(url: string, data = {}) {
    return apiagent({
      url: url,
      method: "patch",
      data: data,
    });
  },
};

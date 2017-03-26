import axios from 'axios';

axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  console.log("Loading!")
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  console.log("Loading done!")
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});


var instance = axios.create({
  baseURL: "http://localhost:5000"
});


instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  console.log("Loading!")
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Do something with response data
  console.log("Loading done!")
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});


export {axios, instance};

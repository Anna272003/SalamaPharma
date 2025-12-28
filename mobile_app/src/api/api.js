import axios from 'axios';

const baseURL = "http://192.168.129.238:5000/api";
 // IP locale correcte

const API = axios.create({
  baseURL,
  timeout: 10000,
});
console.log("API URL =", baseURL);

export default API;

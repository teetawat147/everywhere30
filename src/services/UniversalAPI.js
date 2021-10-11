import axios from 'axios'
import * as authHeader from "../services/auth-header";

// const API_URL = "https://cloud1.r8way.moph.go.th:3099/api/";
const API_URL = authHeader.API_URL;

const getAll = (params, thisCollection) => {
  return axios.get(API_URL + thisCollection, { headers: authHeader.getToken(), params: params });
};

const getLimit = (params, thisCollection) => {
  return axios.get(API_URL + thisCollection, { headers: authHeader.getToken(), params: params });
};

const getCount = (params, thisCollection) => {
  return axios.get(API_URL + thisCollection + "/count", { headers: authHeader.getToken(), params: params });
};

const countPerson = (hos_id, params, thisCollection) => {
  return axios.get(API_URL + thisCollection + "/" + hos_id + "/person/count", { headers: authHeader.getToken(), params: params });
};

const getGroupBy = (params, thisCollection) => {
  return axios.get(API_URL + thisCollection + "/groupBy", { headers: authHeader.getToken(), params: params });
};

const get = (id, thisCollection) => {
  return axios.get(API_URL + thisCollection + "/" + id, { headers: authHeader.getToken() });
};

const create = (data, thisCollection) => {
  return axios.post(API_URL + thisCollection, data, { headers: authHeader.getToken() });
};

const uploadFile = (params, collection) => {
  return axios.post(API_URL + collection, params, { headers: authHeader.setHeader() });
}

const update = (id, data, thisCollection) => {
  return axios.put(API_URL + thisCollection + "/" + id, data, { headers: authHeader.getToken() });
};

const update2 = (where, data, thisCollection) => {
  return axios.update(API_URL + thisCollection + "/" + where, data, { headers: authHeader.getToken() });
};

const patch = (id, data, thisCollection) => {
  return axios.patch(API_URL + thisCollection + "/" + id, data, { headers: authHeader.getToken() });
};

const remove = (id, thisCollection) => {
  return axios.delete(API_URL + thisCollection + "/" + id, { headers: authHeader.getToken() });
};

const removeFile = (fileName, thisCollection) => {
  return axios.delete(API_URL + thisCollection + "/" + fileName, { headers: authHeader.getToken() });
};

const removeAll = (thisCollection) => {
  return axios.delete(API_URL + thisCollection, { headers: authHeader.getToken() });
};

const findByTitle = (title, thisCollection) => {
  return axios.get(API_URL + thisCollection + "?filter[where][title][like]=" + title, { headers: authHeader.getToken() });
};

export {
  getAll,
  getLimit,
  getCount,
  get,
  create,
  update,
  remove,
  removeFile,
  removeAll,
  findByTitle,
  uploadFile,
  getGroupBy,
  update2,
  patch,
  countPerson
};

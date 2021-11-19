import api from "./api";

const getAll = (params) => {
  return api.get("/users", { params });
};

const get = (id) => {
  return api.get(`/users/${id}`);
};

const create = (data) => {
  return api.post("/users", data);
};

const update = (id, data) => {
  return api.put(`/users/${id}`, data);
};

const remove = (id) => {
  return api.delete(`/users/${id}`);
};

const removeAll = () => {
  return api.delete(`/users`);
};

const findByTitle = (title) => {
  return api.get(`/users?title=${title}`);
};

const UserService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByTitle,
};

export default UserService;

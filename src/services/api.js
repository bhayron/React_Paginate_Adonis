import axios from "axios";

const url = "http://localhost:3333";

export default axios.create({
  baseURL: url,
  headers: {
    "Content-type": "application/json"
  }
});
// frontend/lib/axios.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "https://recipe-app-backend-58c0e88c485c.herokuapp.com",
});

export default instance;

import axios from "axios";
import { Environment } from "../../../environment";
import { errorInterceptor, ResponseInterceptor } from "./interceptors";

const Api = axios.create({
  baseURL: Environment.URL_BASE,
});

Api.interceptors.response.use(
  (response) => ResponseInterceptor(response),
  (error) => errorInterceptor(error)
);

export { Api };

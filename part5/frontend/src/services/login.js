import axios from "axios";
const baseUrl = "/api/login";

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const verifyUser = (user) => {
  if (user) {
    const decodedJwt = parseJwt(user.token);
    if (decodedJwt && decodedJwt.exp * 1000 > Date.now()) {
      return true;
    }
  }
  return false;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { login, verifyUser };

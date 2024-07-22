import axios from "axios";
import { getAuthToken } from "./utils";

/**
 * Logs in the user with the provided username and password.
 * @param {number} mobile - The mobile number of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<void>}
 */
export const login = async (mobile = 9535888738, password = "kamal123") => {
  try {
    // Make the POST request with Axios
    const response = await axios.post(
      "https://account.mypin.ai/api/login/login",
      {
        mobile,
        password,
      }
    );

    // Save the result in localStorage
    localStorage.setItem("user", JSON.stringify(response.data));

    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    return null;;
  }
};

export const getContact = async (name: string) => {
  try {
    // Make the POST request with Axios
    const response = await axios.post(
      "https://account.mypin.ai/api/contact/get",
      {
        no_of_docs: 1,
        skip: 0,
        st: "all",
        name,
      },
      {
        headers: {
          "Logintoken": getAuthToken()
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("getContact failed", error);
    return null;
  }
};

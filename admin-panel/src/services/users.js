import axios from "axios";
import { config } from "./config";

export async function login(email, password) {
  try {
    // create url
    const url = `${config.serverBaseUrl}/admin/login`;

    // create body
    const body = { email, password };

    // send the request and get the response
    const response = await axios.post(url, body);

    // return the response body
    return response.data;
  } catch (ex) {
    console.log(`exception: `, ex);
    throw ex;
  }
}

export async function getAllUsers() {
  try {
    // create url
    const url = `${config.serverBaseUrl}/user`;

    // create header with token
    const headers = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    };

    // send the request and get the response
    const response = await axios.get(url, headers);

    // return the response body
    return response.data;
  } catch (ex) {
    console.log(`exception: `, ex);
    throw ex;
  }
}

export async function toggleUserStatus(userId, status) {
  try {
    // create url
    const url = `${config.serverBaseUrl}/user/status/${userId}/${status}`;

    // create header with token
    const headers = {
      headers: {
        authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    };

    // send the request and get the response
    const response = await axios.patch(url, {}, headers);

    // return the response body
    return response.data;
  } catch (ex) {
    console.log(`exception: `, ex);
    throw ex;
  }
}

export async function updateProfile(firstName, lastName) {
  try {
    // create url
    const url = `${config.serverBaseUrl}/admin/profile`;

    // create body
    const body = { firstName, lastName };

    // create header with token
    const headers = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    };

    // send the request and get the response
    const response = await axios.put(url, body, headers);

    // return the response body
    return response.data;
  } catch (ex) {
    console.log(`exception: `, ex);
    throw ex;
  }
}

export async function getProfile() {
  try {
    // create url
    const url = `${config.serverBaseUrl}/admin/profile`;

    // create header with token
    const headers = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    };

    // send the request and get the response
    const response = await axios.get(url, headers);

    // return the response body
    return response.data;
  } catch (ex) {
    console.log(`exception: `, ex);
    throw ex;
  }
}

export async function registerUser(firstName, lastName, email, password) {
  try {
    // create url
    const url = `${config.serverBaseUrl}/admin/register`;

    // create body
    const body = { firstName, lastName, email, password };

    // send the request and get the response
    const response = await axios.post(url, body);

    // return the response body
    return response.data;
  } catch (ex) {
    console.log(`exception: `, ex);
    throw ex;
  }
}

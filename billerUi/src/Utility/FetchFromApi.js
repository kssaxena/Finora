import axios from "axios";

// export const DomainUrl = "http://localhost:3000";
// export const DomainUrl = "https://multi-vendor-e-commerce.onrender.com";

export const FetchData = async (url, method, data, file = false) => {
  const Base_URL = `${process.env.DomainUrl}/api/v1`;
  const AccessToken = localStorage.getItem("AccessToken");

  const options = {
    headers: {
      "Content-Type": file ? "multipart/form-data" : "application/json",
      Authorization: `Bearer ${AccessToken}`,
    },
    // withCredentials: true,
  };

  if (method === "get") {
    const response = await axios.get(`${Base_URL}/${url}`, options);
    return response;
  } else if (method === "post") {
    const response = await axios.post(`${Base_URL}/${url}`, data, options);
    return response;
  } else if (method === "delete") {
    const response = await axios.delete(`${Base_URL}/${url}`, options);
    return response;
  } else if (method === "patch") {
    const response = await axios.patch(`${Base_URL}/${url}`, data, options);
    return response;
  } else {
    console.log(method);
    return "Please enter the valid method";
  }
};

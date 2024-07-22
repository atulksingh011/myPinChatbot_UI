export const getUserDetail = () => {
  // Get the user data from localStorage
  const user = localStorage.getItem("user");

  // Parse the JSON string to an object
  return user ? JSON.parse(user)?.data : null;
};

export const getAuthToken = () => {
  // Get the user data from localStorage
  const user = localStorage.getItem("user");

  // Parse the JSON string to an object
  return user ? JSON.parse(user)?.loginToken : null;
};

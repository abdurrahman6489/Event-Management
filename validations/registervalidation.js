const validateRegistration = (name, email, plainTextPassword) => {
  const error = {
    hasError: false,
    message: "",
  };
  if (!name) {
    error.hasError = true;
    error.message = "name is required";
  }
  if (!email) {
    error.hasError = true;
    error.message = "email is required";
  }
  if (!plainTextPassword) {
    error.hasError = true;
    error.message = "password is required";
  }
  return error;
};
module.exports = validateRegistration;

const md5 = require("md5");

const encodePassword = (password: string) => {
  const newPassword = md5(password);
  return newPassword;
}

const md5Util = {
  encodePassword
};
export default md5Util;
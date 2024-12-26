const generateOtp = (length: number) => {
  const characters = "0123456789";
  const characterLength = characters.length;
  let otp = "";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * characterLength);
    otp += characters[index];
  }

  return otp;
}

const generate = {
  generateOtp
};
export default generate;
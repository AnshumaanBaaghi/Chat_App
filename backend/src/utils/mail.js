const nodemailer = require("nodemailer");

const mailOptions = (users_mail, otp) => ({
  from: {
    name: "Chat-Application",
    address: process.env.MAILTRAP_SMTP_USER,
  }, // sender address
  to: users_mail, // list of receivers
  subject: "OTP", // Subject line
  text: "Hello world?", // plain text body
  html: `<b>OTP ${otp}</b>`, // html body
});

const sendMail = async (users_mail, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });
  try {
    await transporter.sendMail(mailOptions(users_mail, otp));
    console.log("OTP sent successful on your mail");
  } catch (error) {
    console.error(error);
  }
};

module.exports = { sendMail };

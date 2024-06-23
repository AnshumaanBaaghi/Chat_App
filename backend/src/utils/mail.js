const nodemailer = require("nodemailer");

const mailOptions = (users_mail, otp) => ({
  from: {
    name: "Chat-Application",
    address: process.env.MAILTRAP_SMTP_USER,
  },
  to: users_mail,
  subject: "Your OTP for Chat-Application Login",
  text: `Dear User,

Welcome to Chat-Application!

To complete your login process, please use the following OTP:

${otp}

This OTP is valid for the next 10 minutes. Please do not share this code with anyone.

If you did not attempt to login, please ignore this email or contact our support team immediately.

Best Regards,
Chat-Application Team
`,
  html: `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>Welcome to Chat-Application!</h2>
    <p>Dear User,</p>
    <p>To complete your login process, please use the following OTP:</p>
    <h1 style="color: #2e6c80;">${otp}</h1>
    <p>This OTP is valid for the next 10 minutes. Please do not share this code with anyone.</p>
    <p>If you did not attempt to login, please ignore this email or <a href="mailto:${process.env.MAILTRAP_SMTP_USER}">contact our support team</a> immediately.</p>
    <br>
    <p>Best Regards,</p>
    <p><strong>Chat-Application Team</strong></p>
  </div>
  `,
});
// TODO: User can copy OTP from mail
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

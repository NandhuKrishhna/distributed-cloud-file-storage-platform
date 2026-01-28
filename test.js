import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "nandhu.wavenetsolutions@gmail.com",
    pass: process.env.NODEMAILER_APP_PASSWORD,
  },
});


const info = await transporter.sendMail({
    from : "Nandhu Krishna <nandhu.wavenetsolutions@gmail.com>",
    to: "nandhukrishna393@gmail.com",
    subject: "This is a test email. Learning Purpose.",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OTP Display</title>
</head>
<body style="
  margin:0;
  height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  background:#f4f6fb;
  font-family:Arial, sans-serif;
">

  <div style="
    background:#ffffff;
    padding:32px 40px;
    border-radius:12px;
    box-shadow:0 12px 30px rgba(0,0,0,0.12);
    text-align:center;
    min-width:300px;
  ">
    <h2 style="
      margin:0 0 12px;
      color:#111827;
      font-size:20px;
    ">
      One-Time Password
    </h2>

    <!-- Replace 483927 with server-generated OTP -->
    <div style="
      font-size:34px;
      font-weight:700;
      letter-spacing:8px;
      color:#2563eb;
      margin:18px 0 10px;
    ">
      483927
    </div>

    <p style="
      margin:0;
      font-size:13px;
      color:#6b7280;
    ">
      This OTP is valid for 5 minutes
    </p>
  </div>

</body>
</html>
`, 
  });

console.log("Message send : %s,",info.messageId);



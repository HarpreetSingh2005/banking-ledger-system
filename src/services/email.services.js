const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegisterationEmail(userEmail, name) {
  await sendEmail(
    userEmail,
    "Welcome to Backend Ledger",
    `Hello ${name},\n\nWelcome to Backend Ledger! We're excited to have you join our community.\n\nBest regards,\nBackend Ledger Team`,
    `<p>Hello ${name},<br><br>Welcome to Backend Ledger! We're excited to have you join our community.<br><br>Best regards,<br>Backend Ledger Team</p>`,
  );
}

async function sendTransactionEmail(userEmail, name, toAccount, amount) {
  const subject = "Transaction Successful";
  const text = `Hello ${name},\n\nYour transaction to ${toAccount} of $${amount} was successful.\n\nBest regards,\nBackend Ledger Team`;
  const html = `<p>Hello ${name},<br><br>Your transaction to ${toAccount} of $${amount} was successful.<br><br>Best regards,<br>Backend Ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, toAccount, amount) {
  const subject = "Transaction Failed";
  const text = `Hello ${name},\n\nYour transaction to ${toAccount} of $${amount} failed.\n\nBest regards,\nBackend Ledger Team`;
  const html = `<p>Hello ${name},<br><br>Your transaction to ${toAccount} of $${amount} failed.<br><br>Best regards,<br>Backend Ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegisterationEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail,
};

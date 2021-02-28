import sgMail from "@sendgrid/mail";
import Mailgen from "mailgen";

const createTemplate = function (verificationToken, email) {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "HW06",
      link: `http://localhost:${process.env.PORT}/`,
    },
  });
  const template = {
    body: {
      name: email,
      intro: "Welcome to HW06! We're very excited to have you on board.",
      action: {
        instructions: "To get started with HW06, please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Confirm your account",
          link: `http://localhost:${process.env.PORT}/auth/verify/${verificationToken}`,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
  const emailBody = mailGenerator.generate(template);
  return emailBody;
};

export async function sendMail(verificationToken, email) {
  const emailBody = createTemplate(verificationToken, email);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: process.env.SENDER_EMAIL,
    subject: "Verificate account",
    html: emailBody,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
}

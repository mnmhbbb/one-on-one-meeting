import nodemailer from "nodemailer";

export async function VerificationEmail(email: string, code: string) {
  const isSecure = Number(process.env.EMAIL_PORT) === 465;
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 465,
    secure: isSecure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Knock Knock" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "이메일 인증 코드 안내",
    text: `Knock Knock 이메일 인증 코드입니다: ${code}\n유효 시간: 10분`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Knock Knock 이메일 인증</h2>
        <p>아래 인증 코드를 입력하여 이메일 인증을 완료하세요.</p>
        <div style="font-size: 24px; font-weight: bold; margin-top: 20px;">
          인증 코드: <span style="color: #6b5545;">${code}</span>
        </div>
        <p style="margin-top: 20px;">유효 시간: 10분</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

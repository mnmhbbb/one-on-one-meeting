import nodemailer from "nodemailer";

export async function sendUpdateInterviewEmail(
  studentName: string,
  professorName: string,
  ProfessorEmail: string
) {
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
    to: ProfessorEmail,
    subject: `${professorName} 교수님, ${professorName} 학생의 면담 예약 내역이 수정되었습니다.`,
    text: `${professorName} 교수님, ${professorName} 학생의 면담 예약 내역이 수정되었습니다. 아래 링크를 통해 확인해주세요.\n http://localhost:3000`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">Knock Knock - 새로운 면담 신청</h2>
        <p><strong>${professorName}</strong> 교수님, 새로운 면담 신청이 도착했습니다.</p>
        <p>${studentName} 학생의 면담 요청을 아래 링크에서 확인하실 수 있습니다.</p>
        <div style="margin-top: 20px;">
          <a href="http://localhost:3000" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #6b5545; color: #fff; text-decoration: none; border-radius: 5px;">
            면담 신청 확인하기
          </a>
        </div>
        <p style="margin-top: 20px; color: #666;">본 메일은 Knock Knock 시스템을 통해 자동 발송되었습니다.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

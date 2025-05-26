import nodemailer from "nodemailer";

interface CreateInterviewToProfessorEmailParams {
  studentName: string;
  professorName: string;
  interviewDate: string;
  interviewTime: string;
  professorNotificationEmail: string;
}

export async function CreateInterviewToProfessorEmail({
  studentName,
  professorName,
  interviewDate,
  interviewTime,
  professorNotificationEmail,
}: CreateInterviewToProfessorEmailParams) {
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
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/professor/interview-requests?tab=day&date=${interviewDate}`;

  const mailOptions = {
    from: `"Knock Knock" <${process.env.EMAIL_USER}>`,
    to: professorNotificationEmail,
    subject: `${professorName} 교수님, 새로운 면담 신청이 도착했습니다.`,
    text: `
      ${professorName} 교수님, 안녕하세요.
      ${studentName} 학생의 면담 신청이 접수되었습니다.
      면담 일정: ${interviewDate}, ${interviewTime}
      아래 링크를 통해 신청 내용을 확인해 주세요: ${url}
      ※ 본 메일은 Knock Knock 시스템에서 자동 발송되었습니다.
    `,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">[Knock Knock] 새로운 면담 신청 알림</h2>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            <strong>${professorName}</strong> 교수님, <br />
            <strong>${studentName}</strong> 학생이 면담을 신청하였습니다.<br /><br />
          </p>
          <p style="font-size: 15px; color: #333;">
            <strong>면담 일정:</strong> ${interviewDate}, ${interviewTime}<br /><br />
          </p>
          <p style="font-size: 15px; color: #333;">
            아래 링크를 통해 신청 내용을 확인하시고, 수락/거절을 눌러주세요.
          </p>
          <div style="margin: 30px 0;">
            <a href="${url}" target="_blank"
              style="display: inline-block; background-color: #6b5545; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
              면담 신청 확인하기
            </a>
          </div>
          <p style="font-size: 13px; color: #888; margin-top: 30px;">
            ※ 본 메일은 Knock Knock 시스템에서 자동으로 발송되었습니다.
          </p>
        </div>
      </div>
      `,
  };

  await transporter.sendMail(mailOptions);
}

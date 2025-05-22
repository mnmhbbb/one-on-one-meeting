import nodemailer from "nodemailer";

interface CancelInterviewToProfessorEmailParams {
  studentName: string;
  professorName: string;
  interviewDate: string;
  interviewTime: string;
  interviewCancelReason: string;
  professorNotificationEmail: string;
}

export async function CancelInterviewToProfessorEmail({
  studentName,
  professorName,
  interviewDate,
  interviewTime,
  interviewCancelReason,
  professorNotificationEmail,
}: CancelInterviewToProfessorEmailParams) {
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
  const url = `https://${process.env.NEXT_PUBLIC_BASE_URL}/professor/interview-requests?tab=day&date=${interviewDate}`;

  const mailOptions = {
    from: `"Knock Knock" <${process.env.EMAIL_USER}>`,
    to: professorNotificationEmail,
    subject: `${professorName} 교수님, ${studentName} 학생의 면담 신청이 취소되었습니다.`,
    text: `
      ${professorName} 교수님, 안녕하세요.
      ${studentName} 학생이 신청한 면담이 취소되었습니다.
      면담 일정: ${interviewDate}, ${interviewTime}
      취소 사유: ${interviewCancelReason}
      아래 링크를 통해 자세한 내용을 확인해 주세요.: ${url}
      ※ 본 메일은 Knock Knock 시스템에서 자동 발송되었습니다.
    `,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">[Knock Knock] 면담 신청 취소 알림</h2>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            <strong>${professorName}</strong> 교수님, <br />
            <strong>${studentName}</strong> 학생이 신청한 면담이 <strong>취소</strong>되었습니다.<br /><br />
          </p>
          <p style="font-size: 15px; color: #333;">
            <strong>면담 일정:</strong> ${interviewDate}, ${interviewTime}<br />
            <strong>취소 사유:</strong> ${interviewCancelReason}<br /><br />
          </p>
          <p style="font-size: 15px; color: #333;">
            아래 링크를 통해 자세한 내용을 확인해 주세요.
          </p>
          <div style="margin: 20px 0;">
            <a href="${url}" target="_blank"
              style="display: inline-block; background-color: #6b5545; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
              면담 내역 확인하기
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

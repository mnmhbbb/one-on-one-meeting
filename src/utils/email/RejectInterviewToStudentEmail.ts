import nodemailer from "nodemailer";

interface RejectInterviewToStudentEmailParams {
  studentName: string;
  professorName: string;
  interviewDate: string;
  interviewTime: string;
  interviewRejectReason: string;
  studentNotificationEmail: string;
}

export async function RejectInterviewToStudentEmail({
  studentName,
  professorName,
  interviewDate,
  interviewTime,
  interviewRejectReason,
  studentNotificationEmail,
}: RejectInterviewToStudentEmailParams) {
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
  const url = `https://${process.env.NEXT_PUBLIC_BASE_URL}/student/interview-requests?tab=day&date=${interviewDate}`;

  const mailOptions = {
    from: `"Knock Knock" <${process.env.EMAIL_USER}>`,
    to: studentNotificationEmail,
    subject: `${professorName} 교수님이 면담 신청을 거절하셨습니다.`,
    text: `
      ${studentName}님, 안녕하세요.
      ${professorName} 교수님이 귀하의 면담 신청을 거절하셨습니다.
      면담 일정: ${interviewDate}, ${interviewTime}
      거절 사유: ${interviewRejectReason}
      아래 링크를 통해 자세한 내용을 확인해 주세요.: ${url}
      ※ 본 메일은 Knock Knock 시스템에서 자동 발송되었습니다.
    `,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">[Knock Knock] 면담 신청 거절 안내</h2>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            <strong>${studentName}</strong>님, <br />
            <strong>${professorName}</strong> 교수님이 귀하의 면담 신청을 <strong>거절</strong>하셨습니다.<br /><br />
          </p>
          <p style="font-size: 15px; color: #333;">
            <strong>면담 일정:</strong> ${interviewDate}, ${interviewTime}<br />
            <strong>거절 사유:</strong> ${interviewRejectReason}<br /><br />
          </p>
          <p style="font-size: 15px; color: #333;">
            아래 링크를 통해 자세한 내용을 확인해 주세요.
          </p>
          <div style="margin: 20px 0;">
            <a href="${url}" target="_blank"
              style="display: inline-block; background-color: #6b5545; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
              신청 내역 확인하기
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

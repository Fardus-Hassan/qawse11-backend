import config from '../config';
import * as nodemailer from 'nodemailer';
import { FormType, FormPayload } from '../types/forms';

// HTML escape function to prevent XSS attacks
const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

// Common email template wrapper - professional and consistent design
const getEmailTemplate = (content: string, showDate = true): string => {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date());

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>Email Notification</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px; text-align: center; background: linear-gradient(135deg, #6C03FF 0%, #9A3DFF 100%);">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px;">
                DIMA360AI
              </h1>
              ${showDate ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.85);">${formattedDate}</p>` : ''}
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #fafafa; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; color: #666; font-size: 13px; line-height: 1.6;">
                This is an automated message from DIMA360AI.<br>
                Please do not reply to this email.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

export const sendEmail = async (to: string, _resetPassLink?: string, _confirmLink?: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: config.sendEmail.brevo_email,
      pass: config.sendEmail.brevo_pass,
    },
  });

  const content = `
    <div style="color: #333;">
      <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #555;">
        This is a system-generated email notification.
      </p>
      ${
        _resetPassLink || _confirmLink
          ? `
      <div style="margin: 24px 0; padding: 16px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
        <p style="margin: 0; font-size: 14px; color: #856404; line-height: 1.5;">
          ⏱ ${_resetPassLink ? 'Please use the reset password link within 5 minutes.' : 'Please verify your email within 5 minutes.'}
        </p>
      </div>
      `
          : ''
      }
    </div>
  `;

  const html = getEmailTemplate(content);

  await transporter.sendMail({
    from: `"DIMA360AI" <${config.sendEmail.email_from}>`,
    to,
    subject: `${_resetPassLink ? 'Reset Your Password' : 'Verify Your Email'}`,
    text: 'This is a system-generated email.',
    html: html,
    headers: {
      'X-Mailer': 'DIMA360AI Email System',
      'X-Priority': '3',
      Importance: 'normal',
    },
  });
};

export const sendOtpEmail = async (
  to: string,
  otp: string,
  expiresInMinutes = 5,
  purpose = 'VERIFY'
) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: config.sendEmail.brevo_email,
      pass: config.sendEmail.brevo_pass,
    },
  });

  const subject = purpose === 'RESET' ? 'Password Reset Code' : 'Email Verification Code';
  const title = purpose === 'RESET' ? 'Reset Your Password' : 'Verify Your Email';

  const content = `
    <div style="text-align: center;">
      <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #333;">
        ${title}
      </h2>
      <p style="margin: 0 0 32px 0; font-size: 15px; color: #666; line-height: 1.6;">
        Use this verification code to ${purpose === 'RESET' ? 'reset your password' : 'verify your account'}:
      </p>
      
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td align="center">
            <div style="display: inline-block; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 2px solid #dee2e6; border-radius: 12px; padding: 24px 48px;">
              <p style="margin: 0; font-size: 40px; font-weight: 700; color: #333; letter-spacing: 12px; font-family: 'Courier New', monospace;">
                ${otp}
              </p>
            </div>
          </td>
        </tr>
      </table>
      
      <p style="margin: 32px 0 0 0; font-size: 14px; color: #999; line-height: 1.6;">
        This code will expire in <strong style="color: #666;">${expiresInMinutes} minutes</strong>.<br>
        For your security, do not share this code with anyone.
      </p>
    </div>
  `;

  const html = getEmailTemplate(content);

  await transporter.sendMail({
    from: `"DIMA360AI" <${config.sendEmail.email_from}>`,
    to,
    subject,
    text: `Your verification code is ${otp}. It expires in ${expiresInMinutes} minutes.`,
    html: html,
    headers: {
      'X-Mailer': 'DIMA360AI Email System',
      'X-Priority': '3',
      Importance: 'normal',
    },
  });
};

const formatFormData = (data: FormPayload, type: FormType): string => {
  let html = '';

  if (type === 'GET_IN_TOUCH') {
    const formData = data as { name: string; email: string; message: string };
    html = `
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #555; font-size: 14px; width: 160px; vertical-align: top;">Name</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; color: #333; font-size: 14px;">${escapeHtml(formData.name)}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #555; font-size: 14px; width: 160px; vertical-align: top;">Email</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; color: #333; font-size: 14px;">${escapeHtml(formData.email)}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; font-weight: 600; color: #555; font-size: 14px; width: 160px; vertical-align: top;">Message</td>
        <td style="padding: 14px 16px; color: #333; font-size: 14px; line-height: 1.6;">${escapeHtml(formData.message)}</td>
      </tr>
    `;
  } else if (type === 'CONTACT') {
    const formData = data as {
      first_name: string;
      last_name: string;
      email: string;
      company_name?: string;
      country: string;
      project_type: string;
      budget_range: string;
      message: string;
    };
    html = `
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #555; font-size: 14px; width: 160px; vertical-align: top;">First Name</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; color: #333; font-size: 14px;">${escapeHtml(formData.first_name)}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #555; font-size: 14px; width: 160px; vertical-align: top;">Last Name</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; color: #333; font-size: 14px;">${escapeHtml(formData.last_name)}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #555; font-size: 14px; width: 160px; vertical-align: top;">Email</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; color: #333; font-size: 14px;">${escapeHtml(formData.email)}</td>
      </tr>
      ${
        formData.company_name
          ? `
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #555; font-size: 14px; width: 160px; vertical-align: top;">Company Name</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; color: #333; font-size: 14px;">${escapeHtml(formData.company_name)}</td>
      </tr>
      `
          : ''
      }
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #555; font-size: 14px; width: 160px; vertical-align: top;">Country</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; color: #333; font-size: 14px;">${escapeHtml(formData.country)}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #555; font-size: 14px; width: 160px; vertical-align: top;">Project Type</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; color: #333; font-size: 14px;">${escapeHtml(formData.project_type)}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #555; font-size: 14px; width: 160px; vertical-align: top;">Budget Range</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; color: #333; font-size: 14px;">${escapeHtml(formData.budget_range)}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; font-weight: 600; color: #555; font-size: 14px; width: 160px; vertical-align: top;">Message</td>
        <td style="padding: 14px 16px; color: #333; font-size: 14px; line-height: 1.6;">${escapeHtml(formData.message)}</td>
      </tr>
    `;
  } else if (type === 'CONSULTATION') {
    const formData = data as {
      first_name: string;
      last_name: string;
      email: string;
      company_name?: string;
      timeline: string;
      country: string;
      project_type: string;
      budget_range: string;
      helps?: string[];
      project_details: string;
    };
    html = `
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #555; font-size: 14px; width: 160px; vertical-align: top;">First Name</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; color: #333; font-size: 14px;">${escapeHtml(formData.first_name)}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #555; font-size: 14px; width: 160px; vertical-align: top;">Last Name</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; color: #333; font-size: 14px;">${escapeHtml(formData.last_name)}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #555; font-size: 14px; width: 160px; vertical-align: top;">Email</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; color: #333; font-size: 14px;">${escapeHtml(formData.email)}</td>
      </tr>
      ${
        formData.company_name
          ? `
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #555; font-size: 14px; width: 160px; vertical-align: top;">Company Name</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; color: #333; font-size: 14px;">${escapeHtml(formData.company_name)}</td>
      </tr>
      `
          : ''
      }
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #555; font-size: 14px; width: 160px; vertical-align: top;">Timeline</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; color: #333; font-size: 14px;">${escapeHtml(formData.timeline)}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #555; font-size: 14px; width: 160px; vertical-align: top;">Country</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; color: #333; font-size: 14px;">${escapeHtml(formData.country)}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #555; font-size: 14px; width: 160px; vertical-align: top;">Project Type</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; color: #333; font-size: 14px;">${escapeHtml(formData.project_type)}</td>
      </tr>
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #555; font-size: 14px; width: 160px; vertical-align: top;">Budget Range</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; color: #333; font-size: 14px;">${escapeHtml(formData.budget_range)}</td>
      </tr>
      ${
        formData.helps && formData.helps.length > 0
          ? `
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-weight: 600; color: #555; font-size: 14px; width: 160px; vertical-align: top;">Assistance Needed</td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; color: #333; font-size: 14px;">${escapeHtml(formData.helps.join(', '))}</td>
      </tr>
      `
          : ''
      }
      <tr>
        <td style="padding: 14px 16px; font-weight: 600; color: #555; font-size: 14px; width: 160px; vertical-align: top;">Project Details</td>
        <td style="padding: 14px 16px; color: #333; font-size: 14px; line-height: 1.6;">${escapeHtml(formData.project_details)}</td>
      </tr>
    `;
  }

  return html;
};

export const sendFormSubmissionEmail = async (
  formType: FormType,
  formData: FormPayload,
  userEmail?: string,
  userName?: string
) => {
  if (!config.sendEmail.form_submission_email) {
    console.warn('FORM_SUBMISSION_EMAIL is not configured. Skipping email notification.');
    return;
  }

  if (
    !config.sendEmail.brevo_email ||
    !config.sendEmail.brevo_pass ||
    !config.sendEmail.email_from
  ) {
    console.warn('Email configuration is incomplete. Skipping email notification.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: config.sendEmail.brevo_email,
      pass: config.sendEmail.brevo_pass,
    },
  });

  const formTypeLabels: Record<FormType, string> = {
    GET_IN_TOUCH: 'Get In Touch',
    CONTACT: 'Contact',
    CONSULTATION: 'Consultation',
  };

  const subject = `New ${formTypeLabels[formType]} Form Submission`;

  const content = `
    <div>
      <h2 style="margin: 0 0 24px 0; font-size: 22px; font-weight: 600; color: #333;">
        New ${formTypeLabels[formType]} Submission
      </h2>
      
      ${
        userName || userEmail
          ? `
      <div style="margin-bottom: 32px; padding: 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #6C03FF; border-radius: 8px;">
        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 1px;">Submitted By</p>
        ${userName ? `<p style="margin: 0 0 4px 0; font-size: 17px; font-weight: 600; color: #333;">${escapeHtml(userName)}</p>` : ''}
        ${userEmail ? `<p style="margin: 0; font-size: 14px; color: #666;">${escapeHtml(userEmail)}</p>` : ''}
      </div>
      `
          : ''
      }
      
      <div>
        <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #555;">Submission Details</h3>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
          ${formatFormData(formData, formType)}
        </table>
      </div>
    </div>
  `;

  const html = getEmailTemplate(content);

  await transporter.sendMail({
    from: `"DIMA360AI" <${config.sendEmail.email_from}>`,
    to: config.sendEmail.form_submission_email,
    subject,
    text: `New ${formTypeLabels[formType]} form submission received.`,
    html: html,
    headers: {
      'X-Mailer': 'DIMA360AI Email System',
      'X-Priority': '3',
      Importance: 'normal',
    },
  });
};

const consultation = (payload: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  websiteUrl?: string;
  industry: string;
  monthlyMarketingBudget: string;
  primaryGoal: string;
  currentMarketingChannels: string[];
  additionalDetails?: string;
  createdAt?: Date;
}): string => {
  const fullName = `${payload.firstName} ${payload.lastName}`;
  const submittedOn = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(payload.createdAt ? new Date(payload.createdAt) : new Date());

  const channelTags = payload.currentMarketingChannels
    .map((ch) => `<span class="tag">${ch}</span>`)
    .join("");

  const additionalDetailsHtml = payload.additionalDetails
    ? `<p>${payload.additionalDetails}</p>`
    : `<span class="message-none">No additional details provided.</span>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>DIMA360 Marketing – New Booking Request</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background-color: #1a2332;
    font-family: 'DM Sans', sans-serif;
    padding: 40px 16px;
    -webkit-font-smoothing: antialiased;
  }

  .email-outer { max-width: 620px; margin: 0 auto; }

  .preheader {
    text-align: center;
    font-size: 11px;
    color: #4a5d6e;
    letter-spacing: 0.06em;
    margin-bottom: 20px;
    text-transform: uppercase;
  }

  .email-card {
    background: #1e2d3d;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #263545;
  }

  .email-header {
    background: #162130;
    padding: 44px 52px 40px;
    text-align: center;
    position: relative;
    border-bottom: 1px solid #263545;
  }

  .top-accent {
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 200px; height: 2px;
    background: linear-gradient(90deg, transparent 0%, #3b9eca 50%, transparent 100%);
  }

  .logo-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-bottom: 28px;
  }

  .brand-text {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 800;
    color: #dce9f5;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    text-align: center;
  }

  .brand-text em { color: #3b9eca; font-style: normal; }

  .header-badge {
    display: inline-block;
    background: rgba(59,158,202,0.12);
    border: 1px solid rgba(59,158,202,0.3);
    color: #3b9eca;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 20px;
    margin-bottom: 18px;
  }

  .header-h1 {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #e8f0f8;
    line-height: 1.25;
    margin-bottom: 10px;
  }

  .header-sub {
    font-size: 14px;
    color: #5a7285;
    font-weight: 300;
    line-height: 1.6;
  }

  .email-body { padding: 40px 52px; }

  .greeting {
    font-size: 15px;
    color: #7a90a4;
    margin-bottom: 22px;
    font-weight: 300;
    line-height: 1.6;
  }

  .greeting strong { color: #c8d8e8; font-weight: 500; }

  .confirm-box {
    background: #162130;
    border: 1px solid #263545;
    border-left: 3px solid #3b9eca;
    border-radius: 10px;
    padding: 20px 24px;
    margin-bottom: 32px;
  }

  .confirm-box p { font-size: 14px; color: #7a90a4; line-height: 1.75; }
  .confirm-box p strong { color: #c8d8e8; font-weight: 500; }

  .section-label {
    font-size: 10.5px;
    font-weight: 600;
    color: #3b9eca;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #263545;
  }

  .details-table {
    width: 100%;
    border-collapse: collapse;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #263545;
    margin-bottom: 32px;
  }

  .details-table tr { border-bottom: 1px solid #263545; }
  .details-table tr:last-child { border-bottom: none; }

  .details-table td {
    padding: 13px 18px;
    font-size: 13.5px;
    vertical-align: top;
    line-height: 1.5;
  }

  .td-key { background: #162130; color: #4a5d6e; width: 38%; font-weight: 400; }
  .td-val { background: #1a2840; color: #b0c4d4; font-weight: 400; }

  .tag-list { display: flex; flex-wrap: wrap; gap: 6px; }

  .tag {
    display: inline-block;
    background: rgba(59,158,202,0.1);
    border: 1px solid rgba(59,158,202,0.25);
    color: #3b9eca;
    font-size: 11.5px;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.03em;
  }

  .message-box {
    background: #162130;
    border: 1px solid #263545;
    border-radius: 10px;
    padding: 20px 24px;
    margin-bottom: 36px;
  }

  .message-box p {
    font-size: 14px;
    color: #5a7285;
    line-height: 1.8;
    font-style: italic;
    font-weight: 300;
  }

  .message-box p::before {
    content: '\\201C';
    color: #3b9eca;
    font-size: 24px;
    font-style: normal;
    line-height: 0;
    vertical-align: -6px;
    margin-right: 4px;
  }

  .message-none { font-size: 13px; color: #3d5060; font-style: italic; }

  .cta-wrap { text-align: center; margin-bottom: 36px; }

  .cta-btn {
    display: inline-block;
    background: #3b9eca;
    color: #0e1e2c;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.06em;
    padding: 15px 40px;
    border-radius: 8px;
    text-decoration: none;
    text-transform: uppercase;
  }

  .cta-note { font-size: 12px; color: #3d5060; margin-top: 12px; }

  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #263545, transparent);
    margin: 0 0 28px;
  }

  .body-note { font-size: 13.5px; color: #4a5d6e; line-height: 1.8; font-weight: 300; }

  .email-footer {
    background: #121c27;
    border-top: 1px solid #1e2d3d;
    padding: 32px 52px 36px;
    text-align: center;
  }

  .footer-logo-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    margin-bottom: 16px;
    opacity: 0.6;
  }

  .footer-brand {
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #5a7285;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .footer-contact { font-size: 12px; color: #3d5060; margin-bottom: 18px; line-height: 1.7; }
  .footer-contact a { color: #3b9eca; text-decoration: none; }
  .footer-copy { font-size: 11px; color: #263545; letter-spacing: 0.04em; }

  @media (max-width: 600px) {
    .email-header, .email-body, .email-footer { padding-left: 24px; padding-right: 24px; }
    .header-h1 { font-size: 22px; }
    .details-table td { padding: 11px 14px; font-size: 12.5px; }
    .td-key { width: 42%; }
  }
</style>
</head>
<body>

<div class="email-outer">

  <p class="preheader">DIMA360 Marketing · Admin Alert · New Lead</p>

  <div class="email-card">

    <!-- HEADER -->
    <div class="email-header">
      <div class="top-accent"></div>

      <div class="logo-row">
        <svg width="42" height="42" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M29.0844 6.875H21.5625V4.625C21.5625 4.39294 21.4703 4.17038 21.3062 4.00628C21.1421 3.84219 20.9196 3.75 20.6875 3.75H19.3125C19.0804 3.75 18.8579 3.84219 18.6938 4.00628C18.5297 4.17038 18.4375 4.39294 18.4375 4.625V6.875H10.9156C9.34696 6.87583 7.84278 7.49935 6.73356 8.60856C5.62435 9.71778 5.00083 11.222 5 12.7906V16.3156C5 20.1936 6.54051 23.9127 9.28265 26.6549C12.0248 29.397 15.7439 30.9375 19.6219 30.9375H20.6875C20.9196 30.9375 21.1421 30.8453 21.3062 30.6812C21.4703 30.5171 21.5625 30.2946 21.5625 30.0625V28.6875C21.5625 28.4554 21.4703 28.2329 21.3062 28.0688C21.1421 27.9047 20.9196 27.8125 20.6875 27.8125H19.6219C16.5727 27.8125 13.6484 26.6012 11.4924 24.4451C9.33628 22.2891 8.125 19.3648 8.125 16.3156V12.7906C8.125 12.0505 8.41901 11.3407 8.94235 10.8174C9.4657 10.294 10.1755 10 10.9156 10H29.0844C29.8245 10 30.5343 10.294 31.0576 10.8174C31.581 11.3407 31.875 12.0505 31.875 12.7906V16.5625C31.873 17.4199 31.7681 18.2739 31.5625 19.1062C31.508 19.3207 31.5371 19.5479 31.6439 19.7417C31.7506 19.9355 31.9271 20.0815 32.1375 20.15L33.45 20.5781C33.5634 20.6157 33.6833 20.6297 33.8022 20.619C33.9212 20.6084 34.0367 20.5734 34.1417 20.5163C34.2466 20.4591 34.3386 20.3811 34.4121 20.2869C34.4855 20.1927 34.5389 20.0844 34.5688 19.9688C34.8529 18.8556 34.9978 17.7114 35 16.5625V12.7906C34.9992 11.222 34.3757 9.71778 33.2664 8.60856C32.1572 7.49935 30.653 6.87583 29.0844 6.875Z" fill="#3b9eca"/>
          <path d="M15 20C16.3807 20 17.5 18.8807 17.5 17.5C17.5 16.1193 16.3807 15 15 15C13.6193 15 12.5 16.1193 12.5 17.5C12.5 18.8807 13.6193 20 15 20Z" fill="#3b9eca"/>
          <path d="M25 20C26.3807 20 27.5 18.8807 27.5 17.5C27.5 16.1193 26.3807 15 25 15C23.6193 15 22.5 16.1193 22.5 17.5C22.5 18.8807 23.6193 20 25 20Z" fill="#3b9eca"/>
          <path d="M34.9155 29.0002L37.7468 30.1158C37.805 30.1388 37.8551 30.1789 37.8903 30.2307C37.9256 30.2825 37.9444 30.3438 37.9444 30.4064C37.9444 30.4691 37.9256 30.5303 37.8903 30.5822C37.8551 30.634 37.805 30.674 37.7468 30.6971L34.9155 31.8127C34.4143 32.0108 33.9591 32.3097 33.578 32.6908C33.1969 33.0719 32.8981 33.5271 32.6999 34.0283L31.5843 36.8408C31.5612 36.8991 31.5212 36.9491 31.4694 36.9843C31.4175 37.0196 31.3563 37.0384 31.2936 37.0384C31.231 37.0384 31.1697 37.0196 31.1179 36.9843C31.0661 36.9491 31.026 36.8991 31.003 36.8408L29.8874 34.0283C29.6897 33.5268 29.391 33.0714 29.0099 32.6902C28.6287 32.3091 28.1732 32.0104 27.6718 31.8127L24.8593 30.6971C24.801 30.674 24.751 30.634 24.7157 30.5822C24.6805 30.5303 24.6616 30.4691 24.6616 30.4064C24.6616 30.3438 24.6805 30.2825 24.7157 30.2307C24.751 30.1789 24.801 30.1388 24.8593 30.1158L27.6718 29.0002C28.1732 28.8025 28.6287 28.5038 29.0099 28.1226C29.391 27.7415 29.6897 27.286 29.8874 26.7846L31.003 23.9721C31.026 23.9138 31.0661 23.8637 31.1179 23.8285C31.1697 23.7933 31.231 23.7744 31.2936 23.7744C31.3563 23.7744 31.4175 23.7933 31.4694 23.8285C31.5212 23.8637 31.5612 23.9138 31.5843 23.9721L32.6999 26.7846C32.8981 27.2857 33.1969 27.741 33.578 28.122C33.9591 28.5031 34.4143 28.802 34.9155 29.0002Z" fill="#3b9eca"/>
        </svg>
        <span class="brand-text">DIMA360 <em>MARKETING</em></span>
      </div>

      <div class="header-badge">🔔 New Booking Request</div>
      <h1 class="header-h1">You have a new lead!</h1>
      <p class="header-sub">
        Someone just submitted the "Book a Call" form on your website.<br>
        Submitted on ${submittedOn}
      </p>
    </div>

    <!-- BODY -->
    <div class="email-body">

      <p class="greeting">Hello, <strong>Admin</strong> —</p>

      <div class="confirm-box">
        <p>
          A new <strong>Book a Call</strong> request has been received from
          <strong>${fullName}</strong>.
          All submitted details are listed below. Please follow up with them at
          <strong>${payload.email}</strong> within 24–48 hours.
        </p>
      </div>

      <!-- PERSONAL INFO -->
      <div class="section-label">Personal Info</div>
      <table class="details-table" cellpadding="0" cellspacing="0">
        <tr>
          <td class="td-key">Full Name</td>
          <td class="td-val">${fullName}</td>
        </tr>
        <tr>
          <td class="td-key">Email Address</td>
          <td class="td-val">${payload.email}</td>
        </tr>
        <tr>
          <td class="td-key">Phone Number</td>
          <td class="td-val">${payload.phoneNumber}</td>
        </tr>
      </table>

      <!-- COMPANY INFO -->
      <div class="section-label">Company Info</div>
      <table class="details-table" cellpadding="0" cellspacing="0">
        <tr>
          <td class="td-key">Company Name</td>
          <td class="td-val">${payload.companyName}</td>
        </tr>
        <tr>
          <td class="td-key">Website URL</td>
          <td class="td-val">${payload.websiteUrl ?? "N/A"}</td>
        </tr>
      </table>

      <!-- BUSINESS DETAILS -->
      <div class="section-label">Business Details</div>
      <table class="details-table" cellpadding="0" cellspacing="0">
        <tr>
          <td class="td-key">Industry</td>
          <td class="td-val">${payload.industry}</td>
        </tr>
        <tr>
          <td class="td-key">Monthly Marketing Budget</td>
          <td class="td-val">${payload.monthlyMarketingBudget}</td>
        </tr>
      </table>

      <!-- GOALS -->
      <div class="section-label">Goals</div>
      <table class="details-table" cellpadding="0" cellspacing="0">
        <tr>
          <td class="td-key">Primary Goal</td>
          <td class="td-val">${payload.primaryGoal}</td>
        </tr>
        <tr>
          <td class="td-key">Current Marketing Channels</td>
          <td class="td-val">
            <div class="tag-list">
              ${channelTags}
            </div>
          </td>
        </tr>
      </table>

      <!-- ADDITIONAL DETAILS -->
      <div class="section-label">Additional Details</div>
      <div class="message-box">
        ${additionalDetailsHtml}
      </div>

      <!-- CTA -->
      <div class="cta-wrap">
        <a href="mailto:${payload.email}?subject=Re: Your Booking Request – DIMA360 Marketing" class="cta-btn">Reply to Lead →</a>
        <p class="cta-note">Best practice: respond within 24–48 hours for highest conversion.</p>
      </div>

      <div class="divider"></div>

      <p class="body-note">
        This is an automated notification sent when a visitor submits the contact form on your website.
        Do not reply to this email directly — use the button above to reach the client.
      </p>

    </div>

    <!-- FOOTER -->
    <div class="email-footer">
      <div class="footer-logo-row">
        <svg width="22" height="22" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M29.0844 6.875H21.5625V4.625C21.5625 4.39294 21.4703 4.17038 21.3062 4.00628C21.1421 3.84219 20.9196 3.75 20.6875 3.75H19.3125C19.0804 3.75 18.8579 3.84219 18.6938 4.00628C18.5297 4.17038 18.4375 4.39294 18.4375 4.625V6.875H10.9156C9.34696 6.87583 7.84278 7.49935 6.73356 8.60856C5.62435 9.71778 5.00083 11.222 5 12.7906V16.3156C5 20.1936 6.54051 23.9127 9.28265 26.6549C12.0248 29.397 15.7439 30.9375 19.6219 30.9375H20.6875C20.9196 30.9375 21.1421 30.8453 21.3062 30.6812C21.4703 30.5171 21.5625 30.2946 21.5625 30.0625V28.6875C21.5625 28.4554 21.4703 28.2329 21.3062 28.0688C21.1421 27.9047 20.9196 27.8125 20.6875 27.8125H19.6219C16.5727 27.8125 13.6484 26.6012 11.4924 24.4451C9.33628 22.2891 8.125 19.3648 8.125 16.3156V12.7906C8.125 12.0505 8.41901 11.3407 8.94235 10.8174C9.4657 10.294 10.1755 10 10.9156 10H29.0844C29.8245 10 30.5343 10.294 31.0576 10.8174C31.581 11.3407 31.875 12.0505 31.875 12.7906V16.5625C31.873 17.4199 31.7681 18.2739 31.5625 19.1062C31.508 19.3207 31.5371 19.5479 31.6439 19.7417C31.7506 19.9355 31.9271 20.0815 32.1375 20.15L33.45 20.5781C33.5634 20.6157 33.6833 20.6297 33.8022 20.619C33.9212 20.6084 34.0367 20.5734 34.1417 20.5163C34.2466 20.4591 34.3386 20.3811 34.4121 20.2869C34.4855 20.1927 34.5389 20.0844 34.5688 19.9688C34.8529 18.8556 34.9978 17.7114 35 16.5625V12.7906C34.9992 11.222 34.3757 9.71778 33.2664 8.60856C32.1572 7.49935 30.653 6.87583 29.0844 6.875Z" fill="#4a5d6e"/>
          <path d="M15 20C16.3807 20 17.5 18.8807 17.5 17.5C17.5 16.1193 16.3807 15 15 15C13.6193 15 12.5 16.1193 12.5 17.5C12.5 18.8807 13.6193 20 15 20Z" fill="#4a5d6e"/>
          <path d="M25 20C26.3807 20 27.5 18.8807 27.5 17.5C27.5 16.1193 26.3807 15 25 15C23.6193 15 22.5 16.1193 22.5 17.5C22.5 18.8807 23.6193 20 25 20Z" fill="#4a5d6e"/>
          <path d="M34.9155 29.0002L37.7468 30.1158C37.805 30.1388 37.8551 30.1789 37.8903 30.2307C37.9256 30.2825 37.9444 30.3438 37.9444 30.4064C37.9444 30.4691 37.9256 30.5303 37.8903 30.5822C37.8551 30.634 37.805 30.674 37.7468 30.6971L34.9155 31.8127C34.4143 32.0108 33.9591 32.3097 33.578 32.6908C33.1969 33.0719 32.8981 33.5271 32.6999 34.0283L31.5843 36.8408C31.5612 36.8991 31.5212 36.9491 31.4694 36.9843C31.4175 37.0196 31.3563 37.0384 31.2936 37.0384C31.231 37.0384 31.1697 37.0196 31.1179 36.9843C31.0661 36.9491 31.026 36.8991 31.003 36.8408L29.8874 34.0283C29.6897 33.5268 29.391 33.0714 29.0099 32.6902C28.6287 32.3091 28.1732 32.0104 27.6718 31.8127L24.8593 30.6971C24.801 30.674 24.751 30.634 24.7157 30.5822C24.6805 30.5303 24.6616 30.4691 24.6616 30.4064C24.6616 30.3438 24.6805 30.2825 24.7157 30.2307C24.751 30.1789 24.801 30.1388 24.8593 30.1158L27.6718 29.0002C28.1732 28.8025 28.6287 28.5038 29.0099 28.1226C29.391 27.7415 29.6897 27.286 29.8874 26.7846L31.003 23.9721C31.026 23.9138 31.0661 23.8637 31.1179 23.8285C31.1697 23.7933 31.231 23.7744 31.2936 23.7744C31.3563 23.7744 31.4175 23.7933 31.4694 23.8285C31.5212 23.8637 31.5612 23.9138 31.5843 23.9721L32.6999 26.7846C32.8981 27.2857 33.1969 27.741 33.578 28.122C33.9591 28.5031 34.4143 28.802 34.9155 29.0002Z" fill="#4a5d6e"/>
        </svg>
        <span class="footer-brand">DIMA360 Marketing</span>
      </div>

      <p class="footer-contact">
        <a href="mailto:hello@dima360marketing.com">hello@dima360marketing.com</a>
      </p>

      <p class="footer-copy">© 2026 DIMA360 Marketing. Internal use only.</p>
    </div>

  </div>

</div>
</body>
</html>`;
};

export const ConsultationTemplates = {
  consultation,
};
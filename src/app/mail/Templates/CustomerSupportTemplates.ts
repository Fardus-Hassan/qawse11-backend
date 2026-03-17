const customerSupport = (payload: {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  country: string;
  projectType: string;
  budgetRange: string;
  message: string;
  createdAt?: Date;
}): string => {
  const fullName = `${payload.firstName} ${payload.lastName}`;
  const submittedOn = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(payload.createdAt ? new Date(payload.createdAt) : new Date());

  const fieldRow = (label: string, value: string, hint?: string) => `
    <tr>
      <td style="padding:0 0 18px 0;">
        <p style="margin:0 0 6px 0;font-size:12px;font-weight:500;color:#8faabb;letter-spacing:0.06em;text-transform:uppercase;font-family:'DM Sans',sans-serif;">${label}</p>
        <div style="background:#1a2d3e;border:1.5px solid #1e3248;border-radius:10px;padding:13px 16px;">
          <p style="margin:0;font-size:14px;color:#b0c8da;font-weight:300;font-family:'DM Sans',sans-serif;">${value}</p>
        </div>
        ${hint ? `<p style="margin:5px 0 0 0;font-size:11.5px;color:#3b9eca;font-weight:300;font-family:'DM Sans',sans-serif;">${hint}</p>` : ""}
      </td>
    </tr>`;

  const twoColRow = (
    label1: string, value1: string,
    label2: string, value2: string,
    hint2?: string
  ) => `
    <tr>
      <td style="padding:0 0 18px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="48%" style="vertical-align:top;">
              <p style="margin:0 0 6px 0;font-size:12px;font-weight:500;color:#8faabb;letter-spacing:0.06em;text-transform:uppercase;font-family:'DM Sans',sans-serif;">${label1}</p>
              <div style="background:#1a2d3e;border:1.5px solid #1e3248;border-radius:10px;padding:13px 16px;">
                <p style="margin:0;font-size:14px;color:#b0c8da;font-weight:300;font-family:'DM Sans',sans-serif;">${value1}</p>
              </div>
            </td>
            <td width="4%"></td>
            <td width="48%" style="vertical-align:top;">
              <p style="margin:0 0 6px 0;font-size:12px;font-weight:500;color:#8faabb;letter-spacing:0.06em;text-transform:uppercase;font-family:'DM Sans',sans-serif;">${label2}</p>
              <div style="background:#1a2d3e;border:1.5px solid #1e3248;border-radius:10px;padding:13px 16px;">
                <p style="margin:0;font-size:14px;color:#b0c8da;font-weight:300;font-family:'DM Sans',sans-serif;">${value2}</p>
              </div>
              ${hint2 ? `<p style="margin:5px 0 0 0;font-size:11.5px;color:#3b9eca;font-weight:300;font-family:'DM Sans',sans-serif;">${hint2}</p>` : ""}
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  const sectionHeading = (title: string) => `
    <tr>
      <td style="padding:8px 0 18px 0;">
        <p style="margin:0 0 10px;font-size:11px;font-weight:500;color:#3b9eca;letter-spacing:0.14em;text-transform:uppercase;font-family:'DM Sans',sans-serif;">${title}</p>
        <div style="height:1px;background:#1a2d3e;"></div>
      </td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>DIMA360 Marketing – New Support Request</title>
<style>@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');</style>
</head>
<body style="margin:0;padding:0;background-color:#0d1720;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d1720;padding:40px 16px;">
  <tr>
    <td align="center">

      <p style="font-size:11px;color:#2e4a5e;letter-spacing:0.07em;text-transform:uppercase;margin:0 0 18px;font-family:'DM Sans',sans-serif;">
        DIMA360 Marketing &middot; New Support Request
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0"
             style="max-width:620px;background:#111c27;border-radius:16px;border:1.5px solid #1a2d3e;overflow:hidden;">

        <tr><td style="height:3px;background:linear-gradient(90deg,#0d1720 0%,#3b9eca 50%,#0d1720 100%);"></td></tr>

        <!-- HEADER -->
        <tr>
          <td style="padding:32px 40px 28px;border-bottom:1px solid #1a2d3e;">
            <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:18px;">
              <tr>
                <td style="vertical-align:middle;padding-right:10px;">
                  <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M29.0844 6.875H21.5625V4.625C21.5625 4.39294 21.4703 4.17038 21.3062 4.00628C21.1421 3.84219 20.9196 3.75 20.6875 3.75H19.3125C19.0804 3.75 18.8579 3.84219 18.6938 4.00628C18.5297 4.17038 18.4375 4.39294 18.4375 4.625V6.875H10.9156C9.34696 6.87583 7.84278 7.49935 6.73356 8.60856C5.62435 9.71778 5.00083 11.222 5 12.7906V16.3156C5 20.1936 6.54051 23.9127 9.28265 26.6549C12.0248 29.397 15.7439 30.9375 19.6219 30.9375H20.6875C20.9196 30.9375 21.1421 30.8453 21.3062 30.6812C21.4703 30.5171 21.5625 30.2946 21.5625 30.0625V28.6875C21.5625 28.4554 21.4703 28.2329 21.3062 28.0688C21.1421 27.9047 20.9196 27.8125 20.6875 27.8125H19.6219C16.5727 27.8125 13.6484 26.6012 11.4924 24.4451C9.33628 22.2891 8.125 19.3648 8.125 16.3156V12.7906C8.125 12.0505 8.41901 11.3407 8.94235 10.8174C9.4657 10.294 10.1755 10 10.9156 10H29.0844C29.8245 10 30.5343 10.294 31.0576 10.8174C31.581 11.3407 31.875 12.0505 31.875 12.7906V16.5625C31.873 17.4199 31.7681 18.2739 31.5625 19.1062C31.508 19.3207 31.5371 19.5479 31.6439 19.7417C31.7506 19.9355 31.9271 20.0815 32.1375 20.15L33.45 20.5781C33.5634 20.6157 33.6833 20.6297 33.8022 20.619C33.9212 20.6084 34.0367 20.5734 34.1417 20.5163C34.2466 20.4591 34.3386 20.3811 34.4121 20.2869C34.4855 20.1927 34.5389 20.0844 34.5688 19.9688C34.8529 18.8556 34.9978 17.7114 35 16.5625V12.7906C34.9992 11.222 34.3757 9.71778 33.2664 8.60856C32.1572 7.49935 30.653 6.87583 29.0844 6.875Z" fill="#3b9eca"/>
                    <path d="M15 20C16.3807 20 17.5 18.8807 17.5 17.5C17.5 16.1193 16.3807 15 15 15C13.6193 15 12.5 16.1193 12.5 17.5C12.5 18.8807 13.6193 20 15 20Z" fill="#3b9eca"/>
                    <path d="M34.9155 29.0002L37.7468 30.1158C37.805 30.1388 37.8551 30.1789 37.8903 30.2307C37.9256 30.2825 37.9444 30.3438 37.9444 30.4064C37.9444 30.4691 37.9256 30.5303 37.8903 30.5822C37.8551 30.634 37.805 30.674 37.7468 30.6971L34.9155 31.8127C34.4143 32.0108 33.9591 32.3097 33.578 32.6908C33.1969 33.0719 32.8981 33.5271 32.6999 34.0283L31.5843 36.8408C31.5612 36.8991 31.5212 36.9491 31.4694 36.9843C31.4175 37.0196 31.3563 37.0384 31.2936 37.0384C31.231 37.0384 31.1697 37.0196 31.1179 36.9843C31.0661 36.9491 31.026 36.8991 31.003 36.8408L29.8874 34.0283C29.6897 33.5268 29.391 33.0714 29.0099 32.6902C28.6287 32.3091 28.1732 32.0104 27.6718 31.8127L24.8593 30.6971C24.801 30.674 24.751 30.634 24.7157 30.5822C24.6805 30.5303 24.6616 30.4691 24.6616 30.4064C24.6616 30.3438 24.6805 30.2825 24.7157 30.2307C24.751 30.1789 24.801 30.1388 24.8593 30.1158L27.6718 29.0002C28.1732 28.8025 28.6287 28.5038 29.0099 28.1226C29.391 27.7415 29.6897 27.286 29.8874 26.7846L31.003 23.9721C31.026 23.9138 31.0661 23.8637 31.1179 23.8285C31.1697 23.7933 31.231 23.7744 31.2936 23.7744C31.3563 23.7744 31.4175 23.7933 31.4694 23.8285C31.5212 23.8637 31.5612 23.9138 31.5843 23.9721L32.6999 26.7846C32.8981 27.2857 33.1969 27.741 33.578 28.122C33.9591 28.5031 34.4143 28.802 34.9155 29.0002Z" fill="#3b9eca"/>
                  </svg>
                </td>
                <td style="vertical-align:middle;">
                  <p style="margin:0;font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:#dce9f5;letter-spacing:0.12em;text-transform:uppercase;">
                    DIMA360 <span style="color:#3b9eca;">MARKETING</span>
                  </p>
                </td>
              </tr>
            </table>

            <span style="display:inline-block;background:rgba(59,158,202,0.10);border:1px solid rgba(59,158,202,0.28);color:#3b9eca;font-size:11px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;padding:4px 13px;border-radius:20px;margin-bottom:13px;font-family:'DM Sans',sans-serif;">
              New Support Request
            </span>
            <h1 style="margin:0 0 5px;font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:#dce9f5;line-height:1.2;">
              You have a new support request!
            </h1>
            <p style="margin:0;font-size:13px;color:#2e4a5e;font-weight:300;font-family:'DM Sans',sans-serif;">
              Submitted on ${submittedOn}
            </p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:32px 40px 36px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">

              <!-- alert strip -->
              <tr>
                <td style="padding:0 0 28px 0;">
                  <div style="background:#1a2d3e;border:1.5px solid #1e3248;border-left:3px solid #3b9eca;border-radius:0 10px 10px 0;padding:15px 20px;">
                    <p style="margin:0;font-size:13.5px;color:#5a7a8e;line-height:1.75;font-weight:300;font-family:'DM Sans',sans-serif;">
                      New <strong style="color:#c8d8e8;font-weight:500;">Support Request</strong> from
                      <strong style="color:#c8d8e8;font-weight:500;">${fullName}</strong> —
                      reply to <strong style="color:#3b9eca;font-weight:500;">${payload.email}</strong> within 24–48 hrs.
                    </p>
                  </div>
                </td>
              </tr>

              ${sectionHeading("Personal Info")}
              ${twoColRow("First Name", payload.firstName, "Last Name", payload.lastName)}
              ${fieldRow("Email Address", payload.email, "We'll never share your email with anyone")}

              ${sectionHeading("Project Details")}
              ${twoColRow("Company", payload.company, "Country", payload.country)}
              ${twoColRow("Project Type", payload.projectType, "Budget Range", payload.budgetRange, "This helps us tailor the right solution for you")}

              ${sectionHeading("Message")}
              <tr>
                <td style="padding:0 0 32px 0;">
                  <div style="background:#1a2d3e;border:1.5px solid #1e3248;border-radius:10px;padding:16px 20px;min-height:70px;">
                    <p style="margin:0;font-size:14px;color:#5a7a8e;line-height:1.8;font-style:italic;font-weight:300;font-family:'DM Sans',sans-serif;">${payload.message}</p>
                  </div>
                </td>
              </tr>

              <!-- CTA -->
              <tr>
                <td style="padding:0 0 28px 0;">
                  <a href="mailto:${payload.email}?subject=Re: Your Support Request – DIMA360 Marketing"
                     style="display:inline-block;background:#3b9eca;color:#0b1825;font-family:'Syne',sans-serif;font-size:13px;font-weight:700;letter-spacing:0.07em;padding:13px 28px;border-radius:8px;text-decoration:none;text-transform:uppercase;">
                    &#9993;&nbsp;&nbsp;Reply to Lead
                  </a>
                  <p style="margin:9px 0 0;font-size:11.5px;color:#2e4a5e;font-family:'DM Sans',sans-serif;">
                    Best practice: respond within 24–48 hours for highest conversion.
                  </p>
                </td>
              </tr>

              <tr><td style="padding:0 0 22px 0;"><div style="height:1px;background:#1a2d3e;"></div></td></tr>

              <tr>
                <td>
                  <p style="margin:0;font-size:12.5px;color:#2e4a5e;line-height:1.8;font-weight:300;font-family:'DM Sans',sans-serif;">
                    Automated notification from your website contact form. Do not reply directly — use the button above.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#0b1622;border-top:1px solid #111c27;padding:22px 40px 26px;text-align:center;">
            <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 10px;">
              <tr>
                <td style="vertical-align:middle;padding-right:7px;opacity:0.45;">
                  <svg width="16" height="16" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M29.0844 6.875H21.5625V4.625C21.5625 4.39294 21.4703 4.17038 21.3062 4.00628C21.1421 3.84219 20.9196 3.75 20.6875 3.75H19.3125C19.0804 3.75 18.8579 3.84219 18.6938 4.00628C18.5297 4.17038 18.4375 4.39294 18.4375 4.625V6.875H10.9156C9.34696 6.87583 7.84278 7.49935 6.73356 8.60856C5.62435 9.71778 5.00083 11.222 5 12.7906V16.3156C5 20.1936 6.54051 23.9127 9.28265 26.6549C12.0248 29.397 15.7439 30.9375 19.6219 30.9375H20.6875C20.9196 30.9375 21.1421 30.8453 21.3062 30.6812C21.4703 30.5171 21.5625 30.2946 21.5625 30.0625V28.6875C21.5625 28.4554 21.4703 28.2329 21.3062 28.0688C21.1421 27.9047 20.9196 27.8125 20.6875 27.8125H19.6219C16.5727 27.8125 13.6484 26.6012 11.4924 24.4451C9.33628 22.2891 8.125 19.3648 8.125 16.3156V12.7906C8.125 12.0505 8.41901 11.3407 8.94235 10.8174C9.4657 10.294 10.1755 10 10.9156 10H29.0844C29.8245 10 30.5343 10.294 31.0576 10.8174C31.581 11.3407 31.875 12.0505 31.875 12.7906V16.5625C31.873 17.4199 31.7681 18.2739 31.5625 19.1062C31.508 19.3207 31.5371 19.5479 31.6439 19.7417C31.7506 19.9355 31.9271 20.0815 32.1375 20.15L33.45 20.5781C33.5634 20.6157 33.6833 20.6297 33.8022 20.619C33.9212 20.6084 34.0367 20.5734 34.1417 20.5163C34.2466 20.4591 34.3386 20.3811 34.4121 20.2869C34.4855 20.1927 34.5389 20.0844 34.5688 19.9688C34.8529 18.8556 34.9978 17.7114 35 16.5625V12.7906C34.9992 11.222 34.3757 9.71778 33.2664 8.60856C32.1572 7.49935 30.653 6.87583 29.0844 6.875Z" fill="#4a6070"/>
                  </svg>
                </td>
                <td style="vertical-align:middle;opacity:0.45;">
                  <p style="margin:0;font-family:'Syne',sans-serif;font-size:11px;font-weight:700;color:#4a6070;letter-spacing:0.1em;text-transform:uppercase;">DIMA360 Marketing</p>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 12px;font-size:12px;color:#2e4a5e;font-family:'DM Sans',sans-serif;">
              <a href="mailto:hello@dima360marketing.com" style="color:#3b9eca;text-decoration:none;">hello@dima360marketing.com</a>
            </p>
            <p style="margin:0;font-size:11px;color:#1a2d3e;letter-spacing:0.04em;font-family:'DM Sans',sans-serif;">
              &copy; 2026 DIMA360 Marketing. Internal use only.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`;
};

export const CustomerSupportTemplates = {
  customerSupport,
};
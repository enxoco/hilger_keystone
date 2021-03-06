import { createAuth } from "@keystone-6/auth"
import { statelessSessions } from "@keystone-6/core/session"

require('dotenv-safe').config();
let sessionSecret = process.env.SESSION_SECRET

var postmark = require("postmark");

if (!sessionSecret) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("The SESSION_SECRET environment variable must be set in production")
  } else {
    sessionSecret = "-- DEV COOKIE SECRET; CHANGE ME --"
  }
}

let portalUrl = process.env.NODE_ENV == 'production' ? 'https://portal.hhlearning.com' : 'http://localhost:3001'
var client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

const { withAuth } = createAuth({
  listKey: "User",
  identityField: "email",
  sessionData: "name",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"],
  },
  passwordResetLink: {
    sendToken: async ({ identity, token }) => {


      const response = await client.sendEmailWithTemplate({
        "From": process.env.MAIL_FROM_ADDRESS,
        "To": identity,
        "TemplateAlias": "password-reset",
        "TemplateModel": {
          "action_url": `${portalUrl}/reset-password/${encodeURIComponent(identity)}/${token}`
        }
      });

    },
    tokensValidForMins: 4320,
  },
  magicAuthLink: {
    sendToken: async ({identity, token, }) => {
//       await transport
//       .sendMail({
//         to: identity,
//         from: process.env.MAIL_FROM_ADDRESS,
//         subject: "Hilger Report Card portal login",
//         text: `Use this link to login to the portal without a password: ${portalUrl}/passwordless-login/${encodeURIComponent(identity)}/${token}`,
//         html: `<!doctype html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><title></title><!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">#outlook a { padding:0; }
//         body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
//         table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
//         img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
//         p { display:block;margin:13px 0; }</style><!--[if mso]>
//       <noscript>
//       <xml>
//       <o:OfficeDocumentSettings>
//         <o:AllowPNG/>
//         <o:PixelsPerInch>96</o:PixelsPerInch>
//       </o:OfficeDocumentSettings>
//       </xml>
//       </noscript>
//       <![endif]--><!--[if lte mso 11]>
//       <style type="text/css">
//         .mj-outlook-group-fix { width:100% !important; }
//       </style>
//       <![endif]--><!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css"><style type="text/css">@import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);</style><!--<![endif]--><style type="text/css">@media only screen and (min-width:480px) {
//       .mj-column-per-100 { width:100% !important; max-width: 100%; }
//     }</style><style media="screen and (min-width:480px)">.moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }</style><style type="text/css">@media only screen and (max-width:480px) {
//     table.mj-full-width-mobile { width: 100% !important; }
//     td.mj-full-width-mobile { width: auto !important; }
//   }</style></head><body style="word-spacing:normal;"><div><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="margin:0px auto;max-width:600px;"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;"><tbody><tr><td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tbody><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr><td style="width:150px;"><img height="auto" src="https://hhlearning.com/wp-content/uploads/2017/04/cropped-HH-Logo.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:13px;" width="150"></td></tr></tbody></table></td></tr><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><p style="border-top:solid 4px #0071A1;font-size:1px;margin:0px auto;width:100%;"></p><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #0071A1;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
// </td></tr></table><![endif]--></td></tr><tr><td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;"><div style="font-family:helvetica;font-size:18px;line-height:1;text-align:left;color:#000000;">We have generated a unique code to allow you to login to the Hilger parent portal to view your students grades.  Click the button below to login.</div></td></tr><tr><td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;"><p style="border-top:solid 4px #ffffff;font-size:1px;margin:0px auto;width:100%;"></p><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:solid 4px #ffffff;font-size:1px;margin:0px auto;width:550px;" role="presentation" width="550px" ><tr><td style="height:0;line-height:0;"> &nbsp;
// </td></tr></table><![endif]--></td></tr><tr><td align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;"><tr><td align="center" bgcolor="#0071A1" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#0071A1;" valign="middle"><a href="${portalUrl}/passwordless-login/${encodeURIComponent(
//           identity
//         )}/${token}" style="display:inline-block;background:#0071A1;color:#ffffff;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:18px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank">Login</a></td></tr></table></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></div><!--[if mso | IE]></td></tr></table><![endif]--></div></body></html>`,
//       })
    },
    tokensValidForMins: 2880,
  },
})

let sessionMaxAge = 60 * 60 * 24 * 30

const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: sessionSecret!,
  secure: false,
  sameSite: "lax",
  path: "/",
  domain: process.env.DOMAIN,
})

export { withAuth, session }

import config from "../config";
import { transporter } from "./mail.config";
import { AuthTemplates } from "./Templates/AuthTemplates";
import { GigTemplates } from "./Templates/GigTemplates";
import { CustomerSupportTemplates } from "./Templates/CustomerSupportTemplates";
import { ConsultationTemplates } from "./Templates/ConsultationTemplates";

export const mailService = {
    sendEmail: async (to: string, otp: string, subject: string) => {
        const formattedDate = new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date());

        let html: string;
        html = AuthTemplates.otp(otp, formattedDate);

        const res = await transporter.sendMail({
            from: `${config.smtp.name} <${config.smtp.email_from}>`,
            to,
            subject,
            html,
        });
        return res
    },
    sendApplyGigConfirmation: async (to: string, name: string, subject: string) => {


        const html = GigTemplates.applyGig(name);

        const res = await transporter.sendMail({
            from: `${config.smtp.name} <${config.smtp.email_from}>`,
            to,
            subject,
            html,
        });
        return res
    },
    sendConsultationEmail: async (payload: any) => {
        const html = ConsultationTemplates.consultation(payload);

        const res = await transporter.sendMail({
            from: `${config.smtp.name} <${config.smtp.email_from}>`,
            to: "rafioulhasan2@gmail.com", // sends to admin/business inbox
            subject: `New Consultation Request from ${payload.firstName} ${payload.lastName}`,
            html,
        });
        return res;
    },
    sendCustomerSupportEmail: async (payload: any) => {
        const html = CustomerSupportTemplates.customerSupport(payload);

        const res = await transporter.sendMail({
            from: `${config.smtp.name} <${config.smtp.email_from}>`,
            to: "rafioulhasan2@gmail.com", // sends to admin/business inbox
            subject: `Customer Support Request: ${payload.subject}`,
            html,
        });
        return res;
    },

}


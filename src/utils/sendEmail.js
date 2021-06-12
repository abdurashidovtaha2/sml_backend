const nodemailer = require("nodemailer");
const statusCodes = require("../enums/statusCodes");
const emailTemplate = require("../templates/email");

const sendEmail = (email, text, title, subject, link) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: "hotmail",
            port: 465,
            secure: false,
            auth: {
                user: "abdurashidovtaha@hotmail.com",
                pass: "iamamuslim01",
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const message = {
            from: "abdurashidovtaha@hotmail.com",
            to: email,
            subject: subject,
            text: "hell",
            html: emailTemplate(link, text, title, subject),
            // attachments:[{
            //     filename : "logo.png",
            //     path: __dirname + "/images/logo.png",
            //     cid : "logo"
            // }]
        };
        
        transporter.sendMail(message, (error, info) => {
            if (error) {
                return reject({ statusCode: statusCodes.INTERNAL_ERROR, err: error });
            }

            resolve( {
                statusCode: statusCodes.OK,
                message: {
                    info,
                },
            });
        });
    });
};

module.exports = sendEmail;

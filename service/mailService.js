const nodemailer = require('nodemailer')

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }, tls: {
                rejectUnauthorized: false
            }
        })
    }
    async sendAcivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Activation the account on ' + process.env.API_URL,
            text: '',
            html: `
                <div>
                    <h1>For activation follow the link</h1>
                    <a href='${link}'>${link}</a>
                </div>
            `

        }, (err, info) => {
            if (err) {
                console.log(err);
                return
            }
            console.log(info);
        })
    }
}


module.exports = new MailService();
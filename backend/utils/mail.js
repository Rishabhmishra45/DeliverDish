import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
    },
});

export const sendOtpMail = async (to, otp) => {

    await transporter.sendMail({

        from: process.env.SMTP_EMAIL,

        to,

        subject: "Reset Your Password - DeliverDish",

        html: `
        
        <div style="
            max-width:600px;
            margin:auto;
            font-family:Arial,sans-serif;
            background:#fff9f6;
            padding:40px 20px;
        ">

            <div style="
                background:white;
                border-radius:12px;
                padding:40px 30px;
                box-shadow:0 4px 12px rgba(0,0,0,0.08);
                text-align:center;
            ">

                <h1 style="
                    color:#ff4d2d;
                    margin-bottom:10px;
                    font-size:32px;
                ">
                    DeliverDish
                </h1>

                <p style="
                    color:#666;
                    font-size:16px;
                    margin-bottom:30px;
                ">
                    Password Reset Request
                </p>

                <p style="
                    font-size:16px;
                    color:#333;
                    margin-bottom:20px;
                    line-height:1.6;
                ">
                    We received a request to reset your password.
                    Use the OTP below to continue resetting your password.
                </p>

                <div style="
                    background:#ff4d2d;
                    color:white;
                    display:inline-block;
                    padding:16px 40px;
                    border-radius:10px;
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:6px;
                    margin:20px 0;
                ">
                    ${otp}
                </div>

                <p style="
                    color:#777;
                    font-size:14px;
                    margin-top:25px;
                    line-height:1.6;
                ">
                    This OTP is valid for only 5 minutes.
                </p>

                <p style="
                    color:#777;
                    font-size:14px;
                    margin-top:10px;
                    line-height:1.6;
                ">
                    If you did not request a password reset,
                    you can safely ignore this email.
                </p>

                <hr style="
                    margin:30px 0;
                    border:none;
                    border-top:1px solid #eee;
                ">

                <p style="
                    color:#999;
                    font-size:13px;
                ">
                    © 2026 DeliverDish. All rights reserved.
                </p>

            </div>

        </div>
        
        `
    })
}
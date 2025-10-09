const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Tạo transporter cho Gmail (có thể thay đổi cho email provider khác)
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'your-email@gmail.com',
                pass: process.env.EMAIL_PASS || 'your-app-password'
            }
        });
    }

    // Gửi mã OTP
    async sendVerificationCode(email, code, fullName) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER || 'your-email@gmail.com',
                to: email,
                subject: 'Xác thực email - PartGO',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #ff6b35, #ff8a65); padding: 20px; text-align: center;">
                            <h1 style="color: white; margin: 0;">PartGO</h1>
                        </div>
                        
                        <div style="padding: 30px; background: #f8f9fa;">
                            <h2 style="color: #333; margin-bottom: 20px;">Xin chào ${fullName}!</h2>
                            
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                Cảm ơn bạn đã đăng ký tài khoản tại PartGO. Để hoàn tất quá trình đăng ký, 
                                vui lòng sử dụng mã xác thực sau:
                            </p>
                            
                            <div style="background: white; border: 2px solid #ff6b35; border-radius: 10px; 
                                        padding: 20px; text-align: center; margin: 20px 0;">
                                <h1 style="color: #ff6b35; font-size: 32px; letter-spacing: 5px; margin: 0;">
                                    ${code}
                                </h1>
                            </div>
                            
                            <p style="color: #666; font-size: 14px;">
                                <strong>Lưu ý:</strong>
                                <br>• Mã này có hiệu lực trong 10 phút
                                <br>• Không chia sẻ mã này với bất kỳ ai
                                <br>• Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email
                            </p>
                            
                            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                                <p style="color: #999; font-size: 12px; text-align: center;">
                                    Email này được gửi tự động từ hệ thống PartGO
                                </p>
                            </div>
                        </div>
                    </div>
                `
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', result.messageId);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error: error.message };
        }
    }

    // Gửi email chào mừng sau khi xác thực thành công
    async sendWelcomeEmail(email, fullName, role) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER || 'your-email@gmail.com',
                to: email,
                subject: 'Chào mừng đến với PartGO!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #ff6b35, #ff8a65); padding: 20px; text-align: center;">
                            <h1 style="color: white; margin: 0;">PartGO</h1>
                        </div>
                        
                        <div style="padding: 30px; background: #f8f9fa;">
                            <h2 style="color: #333; margin-bottom: 20px;">Chào mừng ${fullName}!</h2>
                            
                            <p style="color: #666; font-size: 16px; line-height: 1.6;">
                                Chúc mừng! Tài khoản ${role === 'employer' ? 'nhà tuyển dụng' : 'ứng viên'} của bạn 
                                đã được xác thực thành công.
                            </p>
                            
                            <div style="background: white; border-radius: 10px; padding: 20px; margin: 20px 0;">
                                <h3 style="color: #ff6b35; margin-top: 0;">
                                    ${role === 'employer' ? 'Bạn có thể:' : 'Bạn có thể:'}
                                </h3>
                                <ul style="color: #666; line-height: 1.8;">
                                    ${role === 'employer'
                        ? '<li>Đăng tin tuyển dụng</li><li>Quản lý ứng viên</li><li>Xem dashboard công ty</li>'
                        : '<li>Tìm kiếm việc làm</li><li>Tạo CV online</li><li>Ứng tuyển việc làm</li>'
                    }
                                </ul>
                            </div>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
                                   style="background: #ff6b35; color: white; padding: 12px 30px; 
                                          text-decoration: none; border-radius: 5px; font-weight: bold;">
                                    Bắt đầu ngay
                                </a>
                            </div>
                        </div>
                    </div>
                `
            };

            const result = await this.transporter.sendMail(mailOptions);
            console.log('Welcome email sent successfully:', result.messageId);
            return { success: true, messageId: result.messageId };
        } catch (error) {
            console.error('Error sending welcome email:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new EmailService();

// Frontend Email Service sử dụng EmailJS
// Cấu hình EmailJS
const EMAILJS_CONFIG = {
    serviceId: 'service_pocdysd', // ✅ Service ID đúng từ EmailJS
    templateId: 'template_u4b4325',
    publicKey: '4YSzE4Z6WTrOyeV4a' // ✅ Public Key mới
};

// Log config để debug
console.log('📋 EmailJS Config loaded:', EMAILJS_CONFIG);

class FrontendEmailService {
    constructor() {
        this.config = EMAILJS_CONFIG;
    }

    // Gửi mã OTP xác thực email
    async sendVerificationCode(email, code, fullName) {
        const templateParams = {
            title: `Xác thực email - PartGO`,
            name: fullName,
            time: new Date().toLocaleString('vi-VN'),
            message: `Xin chào ${fullName}! Cảm ơn bạn đã đăng ký tài khoản tại PartGO. Để hoàn tất quá trình đăng ký, vui lòng sử dụng mã xác thực sau: ${code}. Mã này có hiệu lực trong 10 phút. Không chia sẻ mã này với bất kỳ ai.`,
            email: email,
            verificationCode: code
        };

        try {
            console.log('🔧 EmailJS Config:', this.config);
            console.log('📧 Verification Data:', { email, code, fullName });
            console.log('📨 Template Params:', templateParams);

            // Kiểm tra EmailJS có sẵn sàng không
            if (typeof window.emailjs === 'undefined') {
                throw new Error('EmailJS library chưa được load từ CDN');
            }

            console.log('✅ EmailJS library đã sẵn sàng');

            console.log('🚀 Sending verification email via EmailJS...');
            console.log('📧 Final params:', {
                serviceId: this.config.serviceId,
                templateId: this.config.templateId,
                params: templateParams
            });

            const response = await window.emailjs.send(
                this.config.serviceId,
                this.config.templateId,
                templateParams
            );

            console.log('✅ EmailJS Response:', {
                status: response.status,
                text: response.text,
                full: response
            });

            return { success: true, messageId: response.text };

        } catch (error) {
            console.error('❌ EmailJS Error:', {
                message: error?.message,
                status: error?.status,
                text: error?.text,
                error
            });

            // Fallback demo
            console.warn('🔄 EmailJS failed, using mock email...');
            console.log('📧 ===== MOCK VERIFICATION EMAIL =====');
            console.log('To:', email);
            console.log('Subject:', `Xác thực email - PartGO`);
            console.log('Message:', `Xin chào ${fullName}! Mã xác thực của bạn là: ${code}`);
            console.log('=====================================');

            return {
                success: true,
                messageId: 'mock-verification-' + Date.now(),
                fallback: true
            };
        }
    }

    // Gửi email chào mừng sau khi xác thực thành công
    async sendWelcomeEmail(email, fullName, role) {
        const templateParams = {
            title: `Chào mừng đến với PartGO!`,
            name: fullName,
            time: new Date().toLocaleString('vi-VN'),
            message: `Chúc mừng ${fullName}! Tài khoản ${role === 'employer' ? 'nhà tuyển dụng' : 'ứng viên'} của bạn đã được xác thực thành công. Bạn có thể bắt đầu sử dụng các tính năng của PartGO ngay bây giờ.`,
            email: email,
            userRole: role === 'employer' ? 'Nhà tuyển dụng' : 'Ứng viên'
        };

        try {
            console.log('🔧 EmailJS Config:', this.config);
            console.log('📧 Welcome Data:', { email, fullName, role });
            console.log('📨 Template Params:', templateParams);

            // Kiểm tra EmailJS có sẵn sàng không
            if (typeof window.emailjs === 'undefined') {
                throw new Error('EmailJS library chưa được load từ CDN');
            }

            console.log('✅ EmailJS library đã sẵn sàng');

            console.log('🚀 Sending welcome email via EmailJS...');

            const response = await window.emailjs.send(
                this.config.serviceId,
                this.config.templateId,
                templateParams
            );

            console.log('✅ EmailJS Response:', {
                status: response.status,
                text: response.text,
                full: response
            });

            return { success: true, messageId: response.text };

        } catch (error) {
            console.error('❌ EmailJS Error:', {
                message: error?.message,
                status: error?.status,
                text: error?.text,
                error
            });

            // Fallback demo
            console.warn('🔄 EmailJS failed, using mock email...');
            console.log('📧 ===== MOCK WELCOME EMAIL =====');
            console.log('To:', email);
            console.log('Subject:', `Chào mừng đến với PartGO!`);
            console.log('Message:', `Chúc mừng ${fullName}! Tài khoản của bạn đã được xác thực thành công.`);
            console.log('=================================');

            return {
                success: true,
                messageId: 'mock-welcome-' + Date.now(),
                fallback: true
            };
        }
    }

    // Gửi mã OTP reset mật khẩu
    async sendPasswordResetCode(email, code) {
        const templateParams = {
            title: `Reset mật khẩu - PartGO`,
            to_email: email,
            verification_code: code,
            message: `Mã xác thực reset mật khẩu của bạn là: ${code}`,
            company_name: 'PartGO',
            support_email: 'support@partgo.com'
        };

        try {
            console.log('📧 Sending password reset code via EmailJS...', {
                to: email,
                code: code
            });

            const result = await window.emailjs.send(
                this.config.serviceId,
                this.config.templateId,
                templateParams,
                this.config.publicKey
            );

            console.log('✅ Password reset code sent successfully:', result);
            return {
                success: true,
                messageId: result.text,
                fallback: false
            };

        } catch (error) {
            console.error('❌ EmailJS password reset error:', error);

            // Fallback demo
            console.warn('🔄 EmailJS failed, using mock email...');
            console.log('📧 ===== MOCK PASSWORD RESET EMAIL =====');
            console.log('To:', email);
            console.log('Subject:', `Reset mật khẩu - PartGO`);
            console.log('Message:', `Mã xác thực reset mật khẩu của bạn là: ${code}`);
            console.log('=====================================');

            return {
                success: true,
                messageId: 'mock-reset-' + Date.now(),
                fallback: true
            };
        }
    }
}

// Export instance
export default new FrontendEmailService();


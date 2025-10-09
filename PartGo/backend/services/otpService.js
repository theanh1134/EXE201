const crypto = require('crypto');

class OTPService {
    // Tạo mã OTP 6 chữ số
    generateOTP() {
        return crypto.randomInt(100000, 999999).toString();
    }

    // Tạo mã OTP với thời gian hết hạn
    generateOTPWithExpiry(minutes = 10) {
        const code = this.generateOTP();
        const expiresAt = new Date(Date.now() + minutes * 60 * 1000);
        return { code, expiresAt };
    }

    // Kiểm tra mã OTP có hợp lệ không
    validateOTP(userCode, storedCode, expiresAt) {
        if (!userCode || !storedCode || !expiresAt) {
            return { valid: false, message: 'Mã OTP không hợp lệ' };
        }

        if (new Date() > new Date(expiresAt)) {
            return { valid: false, message: 'Mã OTP đã hết hạn' };
        }

        if (userCode !== storedCode) {
            return { valid: false, message: 'Mã OTP không đúng' };
        }

        return { valid: true, message: 'Mã OTP hợp lệ' };
    }

    // Kiểm tra số lần thử
    checkAttempts(attempts, maxAttempts = 5) {
        if (attempts >= maxAttempts) {
            return { 
                valid: false, 
                message: 'Bạn đã thử quá nhiều lần. Vui lòng thử lại sau 15 phút.' 
            };
        }
        return { valid: true };
    }
}

module.exports = new OTPService();







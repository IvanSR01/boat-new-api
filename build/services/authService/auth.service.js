import { genSalt, hash } from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
dotenv.config();
class AuthService {
    constructor() {
        this.secret = speakeasy.generateSecret();
    }
    async getNewTokens(id) {
        const data = { id: id };
        const accessToken = jwt.sign(data, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        const refreshToken = jwt.sign(data, process.env.JWT_SECRET, {
            expiresIn: '15d',
        });
        return {
            accessToken,
            refreshToken,
        };
    }
    verifyToken(token) {
        const tokens = jwt.verify(token, process.env.JWT_SECRET);
        return tokens;
    }
    detectInputType(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        let result = {
            value: input,
            isEmail: false,
            isPhone: false,
        };
        if (emailRegex.test(input)) {
            result.isEmail = true;
        }
        else if (phoneRegex.test(input)) {
            result.isPhone = true;
        }
        return result;
    }
    decodedToken(token) {
        return jwt.decode(token);
    }
    async hashPassword(password) {
        const salt = await genSalt(10);
        return await hash(password, salt);
    }
    async verifyEmailOrPhone(phone) {
        try {
            const genCode = speakeasy.totp({
                secret: this.secret.base32,
                encoding: 'base32',
                digits: 6,
            });
            if (phone) {
            }
            return {
                error: {
                    isError: false,
                },
                code: genCode,
            };
        }
        catch (e) {
            return {
                error: {
                    isError: true,
                    errorMessage: 'Ошибка при отправке кода',
                    errorStatus: 500,
                },
                code: null,
            };
        }
    }
}
export default new AuthService();
//# sourceMappingURL=auth.service.js.map
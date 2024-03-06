import { UserModel } from '../../db/models/user.model.js';
import authService from '../authService/auth.service.js';
import dotenv from 'dotenv';
dotenv.config();
class UserService {
    async findUserByEmail(email) {
        return await UserModel.findOne({
            where: {
                email: email,
            },
        });
    }
    async findUserByPhone(phone) {
        return await UserModel.findOne({
            where: {
                phone: phone,
            },
        });
    }
    async findUserById(id) {
        return await UserModel.findOne({
            where: {
                id,
            },
        });
    }
    returnUserField(user, isSeller) {
        const basicFields = {
            id: user.id,
            email: user.email,
            name: user.name,
            surname: user.surname,
            phone: user.phone,
            role: user.role,
        };
        if (isSeller) {
            return {
                ...basicFields,
                personalUrl: user.personalUrl,
                paymentInfo: user.paymentInfo,
            };
        }
        return basicFields;
    }
    setPhone(phoneNumber) {
        if (phoneNumber.startsWith('8')) {
            phoneNumber = '+7' + phoneNumber.slice(1);
        }
        return phoneNumber;
    }
    async checkUser(phoneOrMail) {
        try {
            const result = authService.detectInputType(phoneOrMail);
            if (result.isEmail) {
                const userByMail = await this.findUserByEmail(result.value);
                if (!userByMail)
                    return {
                        user: null,
                        error: {
                            isError: true,
                            errorMessage: 'Телефон, почта или пароль неверны',
                            errorStatus: 401,
                        },
                    };
                return {
                    user: userByMail,
                    error: { isError: false },
                };
            }
            const userByPhone = await this.findUserByPhone(this.setPhone(result.value));
            if (!userByPhone)
                return {
                    user: null,
                    error: {
                        isError: true,
                        errorMessage: 'Телефон, почта или пароль неверны',
                        errorStatus: 401,
                    },
                };
            return {
                user: userByPhone,
                error: { isError: false },
            };
        }
        catch (error) {
            console.log(error);
            return {
                user: null,
                error: {
                    isError: true,
                    errorMessage: 'Ошибка при авторизации',
                    errorStatus: 500,
                },
            };
        }
    }
}
export default new UserService();
//# sourceMappingURL=user.service.js.map
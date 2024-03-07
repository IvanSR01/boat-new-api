import { UserModel } from '../../db/models/user.model.js'
import authService from '../authService/auth.service.js'
import { TypeResultCheckUser, TypeReturnUserField } from './user.types.js'
import dotenv from 'dotenv'

dotenv.config()
class UserService {
	async findUserByEmail(email: string): Promise<UserModel | null> {
		// Поиск юзера по email
		return await UserModel.findOne({
			where: {
				email: email,
			},
		})
	}
	async findUserByPhone(phone: string): Promise<UserModel | null> {
		// Поиск юзера по телефону
		return await UserModel.findOne({
			where: {
				phone: phone,
			},
		})
	}
	async findUserById(id: string): Promise<UserModel | null> {
		return await UserModel.findOne({
			where: {
				id,
			},
		})
	}

	returnUserField(user: UserModel, isSeller: boolean): TypeReturnUserField {
		// Возврат в api только нужные данные
		const basicFields: TypeReturnUserField = {
			id: user.id,
			email: user.email,
			name: user.name,
			surname: user.surname,
			phone: user.phone,
			role: user.role,
		}

		if (isSeller) {
			// Если isSeller равно true, добавляем дополнительные поля
			return {
				...basicFields,
				personalUrl: user.personalUrl,
				paymentInfo: user.paymentInfo,
			}
		}

		// Если isSeller равно false, возвращаем только основные поля
		return basicFields
	}

	setPhone(phoneNumber: string) {
		// Удаляем все символы, кроме цифр
		const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '')

		// Добавляем международный код, если номер начинается с "8" и имеет девять цифр
		if (
			cleanedPhoneNumber.startsWith('8') &&
			cleanedPhoneNumber.length === 10
		) {
			return '+7' + cleanedPhoneNumber.slice(1)
		}
		// console.log(phoneNumber, cleanedPhoneNumber);

		if (cleanedPhoneNumber.startsWith('+7')) return cleanedPhoneNumber
		// Удаляем начальный "+" и добавляем международный код, если его нет
		if (
			!cleanedPhoneNumber.startsWith('+') &&
			cleanedPhoneNumber.charAt(2) !== '7'
		) {
			return '+7' + cleanedPhoneNumber.slice(1)
		} else {
			return '+' + cleanedPhoneNumber
		}
	}

	async checkUser(phoneOrMail: string): Promise<TypeResultCheckUser> {
		// Проверяем есть ли пользователь в бд
		try {
			const result = authService.detectInputType(phoneOrMail)
			if (result.isEmail) {
				const userByMail = await this.findUserByEmail(result.value)
				if (!userByMail)
					// Если пользователя по email не находим возвращаем ошибку
					return {
						user: null,
						error: {
							isError: true,
							errorMessage: 'Телефон, почта или пароль неверны',
							errorStatus: 401,
						},
					}
				return {
					user: userByMail,
					error: { isError: false },
				}
			}
			const userByPhone = await this.findUserByPhone(
				this.setPhone(result.value)
			)
			if (!userByPhone)
				// Если пользователя по телефону не находим возвращаем ошибку
				return {
					user: null,
					error: {
						isError: true,
						errorMessage: 'Телефон, почта или пароль неверны',
						errorStatus: 401,
					},
				}
			return {
				user: userByPhone,
				error: { isError: false },
			}
		} catch (error) {
			console.log(error)
			return {
				user: null,
				error: {
					isError: true,
					errorMessage: 'Ошибка при авторизации',
					errorStatus: 500,
				},
			}
		}
	}
}

export default new UserService()

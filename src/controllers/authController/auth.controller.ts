import { compare } from 'bcrypt'
import type { Request, Response } from 'express'
import userService from '../../services/userService/user.service.js'
import authService from '../../services/authService/auth.service.js'
import { UserModel } from '../../db/models/user.model.js'
import dotenv from 'dotenv'
import callApiService from '../../services/call-api-service/call-api.service.js'
dotenv.config()
class AuthController {
	async getCode(req: Request, res: Response) {
		try {
			const { phone } = req.body

			const { error, code } = await callApiService.flashCall(
				userService.setPhone(phone)
			)
			if (error.isError)
				return res.status(error.errorStatus || 500).json({
					message: error.errorMessage,
				})

			return res.json({
				code,
			})
		} catch (error) {
			return res.status(500).json({ message: 'Ошибка при прозвоне' })
		}
	}
	async hasUser(req: Request, res: Response) {
		try {
			const { phone, email } = req.body
			const userByPhone = await userService.findUserByPhone(
				userService.setPhone(phone)
			)
			if (userByPhone)
				return res.status(409).json({
					message: 'Телефон уже занят',
					type: 'phone',
				})
			const userByMail = await userService.findUserByEmail(email)
			if (userByMail)
				return res.status(409).json({
					message: 'E-mai уже занят',
					type: 'email',
				})

			return res.json({
				message: 'Пользователь не существует',
				phone,
				email,
			})
		} catch (error) {
			console.error('Ошибка при проверке пользователя:', error)
			return res.status(500).json({
				message: 'Ошибка при проверке пользователя',
			})
		}
	}
	async login(req: Request, res: Response) {
		try {
			const { phoneOrMail, password } = req.body
			const { user, error } = await userService.checkUser(phoneOrMail)

			if (!user || error.isError)
				return res.status(error.errorStatus || 401).json({
					message: error.errorMessage || 'Телефон, почта или пароль неверны',
				})

			const isValidPass = compare(password, user.password)

			if (!isValidPass)
				return res.status(401).json({
					message: 'Пароль не верный',
					type: password,
				})

			const tokens = authService.getNewTokens(user.id)

			return res.json({
				...userService.returnUserField(user, user.role === 'seller'),
				...tokens,
			})
		} catch (error) {
			return res.status(500).json({
				message: 'Ошибка при авторизации',
			})
		}
	}

	async userRegistration(req: Request, res: Response) {
		try {
			const { email, phone, name, surname, password, confirm } = req.body

			const { user: userByMail } = await userService.checkUser(email)
			if (userByMail)
				return res.status(400).json({
					message: 'Этот почта занята',
					type: 'email',
				})
			const { user: userByPhone } = await userService.checkUser(phone)

			if (userByPhone)
				return res.status(400).json({
					message: 'Этот номер занят',
				})

			if (password !== confirm)
				return res.status(400).json({
					message: 'Пароли не совпадают',
				})

			const newUser = await UserModel.create({
				email,
				phone: userService.setPhone(phone),
				name,
				surname,
				password: await authService.hashPassword(password),
				role: 'user',
			})
			const tokens = await authService.getNewTokens(newUser.id)

			return res.json({
				...userService.returnUserField(newUser, false),
				...tokens,
			})
		} catch (error) {
			return res.status(500).json({
				message: 'Ошибка при регистрации',
			})
		}
	}
	async sellerRegistration(req: Request, res: Response) {
		try {
			const {
				email,
				phone,
				name,
				surname,
				password,
				confirm,
				personalUrl,
				paymentInfo,
			} = req.body

			const { user: userByMail } = await userService.checkUser(email)
			if (userByMail)
				return res.status(400).json({
					message: 'Этот почта занята',
					type: 'email',
				})
			const { user: userByPhone } = await userService.checkUser(phone)

			if (userByPhone)
				return res.status(400).json({
					message: 'Этот номер занят',
				})
			if (password !== confirm)
				return res.status(400).json({
					message: 'Пароли не совпадают',
				})

			const newUser = await UserModel.create({
				email,
				phone: phone,
				name,
				surname,
				password: await authService.hashPassword(password),
				paymentInfo,
				personalUrl,
			})
			const tokens = await authService.getNewTokens(newUser.id)

			return res.json({
				...userService.returnUserField(newUser, true),
				...tokens,
			})
		} catch (error) {
			return res.status(500).json({
				message: 'Ошибка при регистрации',
			})
		}
	}
	async getNewTokens(req: Request, res: Response) {
		try {
			const { refreshToken } = req.body

			const result = authService.verifyToken(refreshToken)

			if (!result)
				return res.status(400).json({
					message: 'Токен недействителен',
				})

			const user = await userService.findUserById(result.id)
			if (user) {
				const newTokens = await authService.getNewTokens(user.phone)

				return res.json({
					...userService.returnUserField(user, user.role === 'seller'),
					...newTokens,
				})
			}

			return res.status(404).json({
				message: 'Пользаватель не найден',
			})
		} catch (e) {
			console.log(e)
			return res.status(500).json({
				message: 'Ошибка при обновлении токенов',
			})
		}
	}
	async changePassword(req: Request, res: Response) {
		try {
			const { phoneOrMail, password, confirm } = req.body
			console.log( req.body)
			const { user, error } = await userService.checkUser(phoneOrMail)

			if (!user || error.isError)
				return res.status(404).json({
					message: 'Пользователь не найден',
				})

			if (password !== confirm)
				return res.status(400).json({
					message: 'Пароли не совпадают',
					type: 'confirm',
				})

			await user.update({
				password: await authService.hashPassword(password),
			})
			await user.save()

			return res.json({
				success: true,
			})
		} catch (error) {
			console.log(error)
			return res.status(500).json({
				message: 'Ошибка при смене пароля',
			})
		}
	}
}

export default new AuthController()

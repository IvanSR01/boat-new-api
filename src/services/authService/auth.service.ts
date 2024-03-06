import { genSalt, hash } from 'bcrypt'
import dotenv from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
import speakeasy from 'speakeasy'
import type { TypeError } from '../../types.js'
import type { TypeReturnJWT } from './auth.types.js'

dotenv.config()

class AuthService {
	private secret: any
	constructor() {
		this.secret = speakeasy.generateSecret()
	}
	async getNewTokens(id: string): Promise<TypeReturnJWT> {
		const data = { id: id }
		const accessToken = jwt.sign(data, process.env.JWT_SECRET as string, {
			expiresIn: '1h',
		})
		const refreshToken = jwt.sign(data, process.env.JWT_SECRET as string, {
			expiresIn: '15d',
		})

		return {
			accessToken,
			refreshToken,
		}
	}

	verifyToken(token: string): JwtPayload {
		const tokens = jwt.verify(token, process.env.JWT_SECRET as string)
		return tokens as {
			id: string
		}
	}

	detectInputType(input: string): {
		value: string
		isEmail: boolean
		isPhone: boolean
	} {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

		const phoneRegex = /^\d{10}$/

		let result = {
			value: input,
			isEmail: false,
			isPhone: false,
		}

		if (emailRegex.test(input)) {
			result.isEmail = true
		} else if (phoneRegex.test(input)) {
			result.isPhone = true
		}

		return result
	}

	decodedToken(token: string): string | JwtPayload | null {
		return jwt.decode(token)
	}

	async hashPassword(password: string): Promise<string> {
		const salt = await genSalt(10)
		return await hash(password, salt)
	}

	async verifyEmailOrPhone(
		phone: string | null,
	): Promise<{ error: TypeError; code: string | null }> {
		try {
			const genCode = speakeasy.totp({
				secret: this.secret.base32,
				encoding: 'base32',
				digits: 6,
			})
			if (phone) {
			}
			return {
				error: {
					isError: false,
				},
				code: genCode,
			}
		} catch (e) {
			return {
				error: {
					isError: true,
					errorMessage: 'Ошибка при отправке кода',
					errorStatus: 500,
				},
				code: null,
			}
		}
	}
}

export default new AuthService()

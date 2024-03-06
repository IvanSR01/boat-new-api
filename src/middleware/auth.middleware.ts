// import type { NextFunction, Request, Response } from 'express'
// import authService from '../services/authService/auth.service.js'

// interface IReqUser {
// 	id: string
// }

// declare global {
// 	namespace Express {
// 		interface Request {
// 			userData: IReqUser
// 		}
// 	}
// }

// const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
// 	if (req.method === 'OPTIONS') {
// 		next()
// 	}
// 	try {
// 		const token = req.headers.authorization?.split(' ')[1]

// 		if (!token) {
// 			return res.status(400).json({
// 				message: 'Пользователь не авторизован',
// 			})
// 		}

// 		const decodedData = authService.verifyToken(token)
		
// 		req.userData = decodedData as IReqUser

// 		next()
// 	} catch (error) {
// 		console.log(error)
// 		return res.status(500).json({
// 			message: 'Ошибка при аутентификации',
// 		})
// 	}
// }

// export default authMiddleware
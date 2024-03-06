import { IPaymentInfo, IUser, UserModel } from '../../db/models/user.model.js'
import { TypeError } from '../../types.js'

export type TypeUpdateProps = {
	user: UserModel
	propsUpdate: IUser
}
export type TypeReturnUserField = {
	id: string
	email: string
	phone: string
	name: string
	surname: string
	role: 'user' | 'seller'
	personalUrl?: string
	paymentInfo?: IPaymentInfo
}


export type TypeResultCheckUser = {
	user: UserModel | null
	error: TypeError
}
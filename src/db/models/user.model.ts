import {
	AllowNull,
	BelongsToMany,
	Column,
	DataType,
	Default,
	Model,
	PrimaryKey,
	Table,
	Unique,
} from 'sequelize-typescript'

export interface IUser {
	id?: string
	email?: string
	password?: string
	name?: string
	surname?: string
	phone?: string
	role?: 'user' | 'seller'
	personalUrl?: string
	paymentInfo?: IPaymentInfo
}

export interface IPaymentInfo {
	status: 'Физлиц и самозанятые' | 'ООО и ИП'
	nameACompany?: string
	itn?: string
	bic?: string
	cardNumber?: string
	paymentAccount?: string
}

@Table({
	timestamps: true,
})
export class UserModel extends Model<IUser> {
	@PrimaryKey
	@Default(DataType.UUIDV4)
	@Column(DataType.UUID)
	id!: string

	@AllowNull(false)
	@Unique
	@Column(DataType.STRING)
	email!: string

	@AllowNull(false)
	@Unique
	@Column(DataType.STRING)
	phone!: string

	@AllowNull(false)
	@Unique
	@Column(DataType.STRING)
	password!: string

	@Column(DataType.STRING)
	role!: 'user' | 'seller'

	@Column(DataType.STRING)
	name!: string

	@Column(DataType.STRING)
	surname!: string

	@Default('')
	@Column(DataType.STRING)
	personalUrl?: string

	@Default({})
	@Column(DataType.JSONB)
	paymentInfo?: IPaymentInfo
}

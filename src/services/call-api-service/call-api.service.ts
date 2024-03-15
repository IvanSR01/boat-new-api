import axios, { AxiosRequestConfig } from 'axios'
import FormData from 'form-data'
import { TypeCallApi, TypeResultCall } from './call-api.type.js'
import dotenv from 'dotenv'

dotenv.config()
class CallApiService {
	private readonly axiosConfig: AxiosRequestConfig
	private readonly data: FormData
	constructor() {
		this.data = new FormData()
		this.axiosConfig = {
			method: 'post',
			maxBodyLength: Infinity,
			timeout: 10000,
			url: 'https://zvonok.com/manager/cabapi_external/api/v1/phones/flashcall/',
			headers: {
				...this.data.getHeaders(),
			},
			data: this.data,
		}
	}
	async flashCall(
		phone: string
	): Promise<TypeResultCall> {
		try {
			this.data.append('public_key', process.env.PUBLIC_KEY as string)
			this.data.append('phone', phone)
			this.data.append('campaign_id', process.env.ID as string)
			const { data: response } = await axios<TypeCallApi>(this.axiosConfig)
			return { code: response.data.pincode, error: { isError: false } }
		} catch (error) {
			console.log(error)
			return {
				code: null,
				error: {
					isError: true,
					errorMessage: 'Ошибка при прозвоне, повторите чуть позже',
					errorStatus: 500,
				},
			}
		}
	}
}

export default new CallApiService()

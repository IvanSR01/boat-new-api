import type { TypeError } from './../../types.js'


export type TypeCallApi = {
	status: string
	data: {
		balance: string
		call_id: number
		created: string
		phone: string
		pincode: string
	}
}

export type TypeResultCall = {
	code: string | null; error: TypeError
}
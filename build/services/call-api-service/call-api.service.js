import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';
dotenv.config();
class CallApiService {
    constructor() {
        this.data = new FormData();
        this.axiosConfig = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://zvonok.com/manager/cabapi_external/api/v1/phones/flashcall/',
            headers: {
                ...this.data.getHeaders(),
            },
            data: this.data,
        };
    }
    async flashCall(phone) {
        try {
            this.data.append('public_key', process.env.PUBLIC_KEY);
            this.data.append('phone', phone);
            this.data.append('campaign_id', process.env.ID);
            const { data: response } = await axios(this.axiosConfig);
            return { code: response.data.pincode, error: { isError: false } };
        }
        catch (error) {
            return {
                code: null,
                error: {
                    isError: true,
                    errorMessage: 'Ошибка при прозвоне',
                    errorStatus: 500,
                },
            };
        }
    }
}
export default new CallApiService();
//# sourceMappingURL=call-api.service.js.map
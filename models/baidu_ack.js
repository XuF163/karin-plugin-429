import Cfg from '../lib/config.js'
import request from 'request'
export default class baidu_ack {
    async getAccessToken() {
        let AK = Config.config.API_Key
        let SK = Config.config.Secret_Key
    let options = {
        'method': 'POST',
        'url': 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK,
    }
    return new Promise((resolve, reject) => {
        request(options, (error, response) => {
            if (error) { reject(error) }
            else { resolve(JSON.parse(response.body).access_token) }
        })
    })
}}
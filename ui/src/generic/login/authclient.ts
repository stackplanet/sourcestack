import { UserDetails } from "./userdetails";
import axios from 'restyped-axios'
import { AuthApi } from '../../../../api/src/generic/auth/authapitypes'

export class AuthClient {

    static user: UserDetails;

    static client = axios.create<AuthApi>();

    static async init() {
        let res = await this.client.request({
            url: '/api/auth/user',
            method: 'GET'
        });
        AuthClient.user = res.data; 
    }

    static async logout() {
        AuthClient.user = {};
        await this.client.request({
            url: '/api/auth/logout',
            method: 'POST'
        });
    }

    static async forgotPassword(username: string) {
        await this.client.request({
            url: '/api/auth/forgotpassword',
            method: 'POST',
            data: {
                username: username
            }
        });
        AuthClient.user.userId = username;
    }

    static async login(username: string, password: string) {
        let res = await this.client.request({
            url: '/api/auth/login',
            method: 'POST',
            data: {
                username: username,
                password: password
            }
        });
        AuthClient.user = res.data;
    }

    static async signup(username: string, password: string) {
        let res = await this.client.request({
            url: '/api/auth/signup',
            method: 'POST',
            data: {
                username: username,
                password: password
            }
        });
        AuthClient.user = res.data;
        AuthClient.user.password = password; // Needed at the confirmSignup stage, to log the user in
    }

    static async confirmSignup(username: string, code: string) {
        let res = await this.client.request({
            url: '/api/auth/confirmsignup',
            method: 'POST',
            data: {
                username: username,
                password: AuthClient.user.password, 
                code: code
            }
        });
        AuthClient.user = res.data;
    }

    static async confirmForgotPassword(username: string, code: string, password: string) {
        let res = await this.client.request({
            url: '/api/auth/confirmforgotpassword',
            method: 'POST',
            data: {
                username: username,
                password: password, 
                code: code
            }
        });
        AuthClient.user = res.data;
    }


}
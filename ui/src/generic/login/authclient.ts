import { UserDetails } from "./userdetails";
import m from 'mithril';

export class AuthClient {

    static user: UserDetails;

    static async init(){
        AuthClient.user = await m.request({
            url: '/api/auth/user'
        });
    }

    static async logout(){
        AuthClient.user = {};
        await m.request({
            url: '/api/auth/logout',
            method: 'POST'
        })
    }

    static async forgotPassword(username: string){
        await m.request({
            url: '/api/auth/forgotpassword',
            method: 'POST',
            body: {
                username: username
            }
        });
        AuthClient.user.userId = username;
    }

    static async login(username: string, password: string) {
        AuthClient.user = await m.request({
            url: 'api/auth/login',
            method: 'POST',
            body: {
                username: username, password: password
            }

        });
    }

    static async signup(username: string, password: string) {
        AuthClient.user = await m.request({
            url: 'api/auth/signup',
            method: 'POST',
            body: {
                username: username, password: password
            }

        });
        AuthClient.user.password = password; // Needed at the confirmSignup stage, to log the user in
    }

    static async confirmSignup(username: string, code: string) {
        AuthClient.user = await m.request({
            url: 'api/auth/confirmsignup',
            method: 'POST',
            body: {
                username: username, password: AuthClient.user.password, code: code
            }
        });
    }

    static async confirmForgotPassword(username: string, code: string, password: string) {
        AuthClient.user = await m.request({
            url: 'api/auth/confirmforgotpassword',
            method: 'POST',
            body: {
                username: username, password: password, code: code
            }
        });
    }
    

}
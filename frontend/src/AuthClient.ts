import { UserDetails } from "./userdetails";
import m from 'mithril';

export class AuthClient {

    static user: UserDetails;

    static async init(){
        AuthClient.user = await m.request({
            url: '/api/user'
        });
    }

    static async logout(){
        await m.request({
            url: '/api/logout',
            method: 'POST'
        })
        AuthClient.user = {};
    }

    static async forgotPassword(username: string){
        await m.request({
            url: '/api/forgotpassword',
            method: 'POST',
            body: {
                username: username
            }
        });
        AuthClient.user.userId = username;
    }

    static async login(username: string, password: string) {
        AuthClient.user = await m.request({
            url: 'api/login',
            method: 'POST',
            body: {
                username: username, password: password
            }

        });
    }

    static async signup(username: string, password: string) {
        AuthClient.user = await m.request({
            url: 'api/signup',
            method: 'POST',
            body: {
                username: username, password: password
            }

        });
        AuthClient.user.password = password; // Needed at the confirmSignup stage, to log the user in
    }

    static async confirmSignup(username: string, code: string) {
        AuthClient.user = await m.request({
            url: 'api/confirmsignup',
            method: 'POST',
            body: {
                username: username, password: AuthClient.user.password, code: code
            }
        });
    }

    static async confirmForgotPassword(username: string, code: string, password: string) {
        AuthClient.user = await m.request({
            url: 'api/confirmforgotpassword',
            method: 'POST',
            body: {
                username: username, password: password, code: code
            }
        });
    }
    

}
import { UserDetails } from "./userdetails";
import m from 'mithril';

export class AuthClient {

    static user: UserDetails;

    static async init(){
        AuthClient.user = await m.request({
            url: '/api/user'
        });
        console.log(AuthClient.user)
    }

    static async logout(){
        await m.request({
            url: '/api/logout',
            method: 'POST'
        })
        AuthClient.user = {};
        m.route.set('/splash');
    }

    static async login(username: string, password: string) {
        AuthClient.user = await m.request({
            url: 'api/login',
            method: 'POST',
            body: {
                username: username, password: password
            }

        })
        m.route.set('/home');
        m.redraw();
    }

}
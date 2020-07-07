import m from 'mithril';
import { AuthClient } from "./authclient";

export class AuthPage {

    error: string;

    navigateOnSuccess(page: string){
        if (AuthClient.user.loginError){
            this.error = AuthClient.user.loginError;
            m.redraw();
        }
        else {
            m.route.set(page);
        }
    }

}   
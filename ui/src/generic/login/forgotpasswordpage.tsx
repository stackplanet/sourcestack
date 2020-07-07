import m from 'mithril';
import { LoginPanel } from '../../components/login/loginpanel';
import { bind } from '../../uiutils';
import { LabelledInput } from '../../components/labelledinput';
import { AuthClient } from './authclient';
import { Button } from '../../components/button';
import { AuthPage } from './authpage';

export class ForgotPasswordPage extends AuthPage {

    email: string = '';

    oncreate(){
        document.getElementById('email').focus();
    }

    view() {
        return <LoginPanel title="Reset your password">
            <div {...bind(this)}>   
                <div class="mb-4">
                    <LabelledInput label="Email" id="email" type="email" placeholder="me@awesome.com"/>    
                    {this.error && <p class="text-red-500 text-xs italic">{this.error}</p>}
                </div>
                <div class="mb-4">
                    <Button label="Reset" disabled={!this.complete()} callback={() => this.resetpassword()}/>
                </div>
            </div>
        </LoginPanel>
    }

    async resetpassword() {
        AuthClient.user.userId = this.email;
        await AuthClient.forgotPassword(this.email);
        this.navigateOnSuccess('/confirmforgotpassword');
    }

    complete() {
        return this.email !== '';
    }
}
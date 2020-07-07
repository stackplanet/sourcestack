import m from 'mithril';
import { bind } from '../../uiutils';
import { AuthClient } from './authclient';
import { LabelledInput } from '../../components/labelledinput';
import { Button } from '../../components/button';
import { LoginPanel } from '../../components/login/loginpanel';
import { AuthPage } from './authpage';

export class ConfirmSignupPage extends AuthPage {

    code = '';

    oncreate(){
        document.getElementById('code').focus();
    }

    view() {
        return <LoginPanel title="Check your email!">
            <div {...bind(this)}>
                <div class="mb-4">
                    <p>We've sent a six-digit code to your email address. Please enter the code below:</p>
                </div>
                <div class="mb-4">
                    <LabelledInput label="Code" id="code" type="text" placeholder="******"/>    
                    {this.error && <p class="text-red-500 text-xs italic">{this.error}</p>}
                </div>
                <div class="mb-4">
                    <Button label="OK" disabled={!this.complete()} callback={() => this.login()}/>
                </div>
            </div>
        </LoginPanel>
    }

    async login() {
        await AuthClient.confirmSignup(AuthClient.user.userId, this.code);
        this.navigateOnSuccess('/home');
    }

    complete() {
        return this.code.length === 6;
    }
}
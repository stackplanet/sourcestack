import m from 'mithril';
import { bind } from '../../uiutils';
import { AuthClient } from './authclient';
import { PasswordValidator } from './passwordvalidator';
import { LabelledInput } from '../../components/labelledinput';
import { Button } from '../../components/button';
import { LoginPanel } from '../../components/login/loginpanel';
import { AuthPage } from './authpage';

export class ConfirmForgotPasswordPage extends AuthPage {

    code = '';
    password = '';
    confirmPassword = '';

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
                </div>
                {this.code && <div>
                    <div class="mb-4">
                        <LabelledInput label="Password" id="password" type="password" placeholder="********"/>    
                    </div>
                    <div class="mb-4">
                        <LabelledInput label="Password" id="confirmPassword" type="password" placeholder="********"/>    
                        {this.password && this.confirmPassword && !this.passwordsMatch() && <p class="text-red-500 text-xs italic">Passwords do not match</p>}
                        {this.password && !PasswordValidator.passwordValid(this.password) && <p class="text-red-500 text-xs italic">{PasswordValidator.passwordPolicy()}</p>}
                    </div>
                </div>}
                {this.error && <p class="text-red-500 text-xs italic">{this.error}</p>}
                <div class="mb-4">
                    <Button label="OK" disabled={!this.complete()} callback={() => this.login()}/>
                </div>
            </div>
        </LoginPanel>
    }

    async login() {
        await AuthClient.confirmForgotPassword(AuthClient.user.userId, this.code, this.password);
        this.navigateOnSuccess('/home');
    }

    complete() {
        return this.code.length === 6 && this.passwordsMatch() && PasswordValidator.passwordValid(this.password) && this.password !== ''
    }

    passwordsMatch(){
        return this.password === this.confirmPassword;
    }


}
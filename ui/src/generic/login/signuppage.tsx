import m from 'mithril';
import { bind } from '../../uiutils';
import { AuthClient } from './authclient';
import { PasswordValidator } from './passwordvalidator';
import { LabelledInput } from '../../components/labelledinput';
import { Button } from '../../components/button';
import { LoginPanel } from '../../components/login/loginpanel';
import { AuthPage } from './authpage';

export class SignUpPage extends AuthPage {

    email: string = '';
    password: string = '';
    confirmPassword: string = '';

    oncreate(){
        document.getElementById('email').focus();
    }

    view() {
        return <LoginPanel title="Sign up for sourcestack-demo">
            <div {...bind(this)}>
                <div class="mb-4">
                    <LabelledInput label="Email" id="email" type="email" placeholder="me@awesome.com"/>    
                </div>
                <div class="mb-4">
                    <LabelledInput label="Password" id="password" type="password" placeholder="********"/>    
                </div>
                <div class="mb-4">
                    <LabelledInput label="Confirm password" id="confirmPassword" type="password" placeholder="********"/>    
                    {this.error && <p class="text-red-500 text-xs italic">{this.error}</p>}
                    {this.password && this.confirmPassword && !this.passwordsMatch() && <p class="text-red-500 text-xs italic">Passwords do not match</p>}
                    {this.password && !PasswordValidator.passwordValid(this.password) && <p class="text-red-500 text-xs italic">{PasswordValidator.passwordPolicy()}</p>}
                </div>
                <div class="flex items-center justify-between mb-4">
                    <Button label="Sign up" disabled={!this.complete()} callback={() => this.login()}/>
                </div>
            </div>
        </LoginPanel>
    }

    async login() {
        await AuthClient.signup(this.email, this.password);
        this.navigateOnSuccess('/confirmsignup');
    }

    complete() {
        return this.passwordsMatch() && PasswordValidator.passwordValid(this.password) && this.email !== '' && this.password !== ''
    }

    passwordsMatch(){
        return this.password === this.confirmPassword;
    }


}
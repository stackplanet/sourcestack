import m from 'mithril';
import { bind } from '../uiutils';
import { Page } from './page';
import { AuthClient } from '../authclient';
import { PasswordValidator } from './passwordvalidator';
import { LabelledInput } from '../components/labelledinput';
import { Button } from '../components/button';

export class ConfirmForgotPasswordPage {

    code = '';
    password = '';
    confirmPassword = '';

    oncreate(){
        document.getElementById('code').focus();
    }

    view() {
        let complete = this.complete();
        return <Page hideNavbar={true}>
            <div class="flex justify-center">
                <div class="w-full max-w-md pt-8">
                    <h1 class="text-center text-2xl mb-4">Check your email!</h1>
                    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" {...bind(this)}>
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
                        {AuthClient.user.loginError && <p class="text-red-500 text-xs italic">{AuthClient.user.loginError}</p>}
                        <div class="flex items-center justify-between mb-4">
                            <Button label="OK" disabled={!this.complete()} callback={() => this.login()}/>
                        </div>
                        
                    </form>

                </div>
            </div>
        </Page>
    }

    async login() {
        await AuthClient.confirmForgotPassword(AuthClient.user.userId, this.code, this.password);
        if (!AuthClient.user.loginError){
            m.route.set('/home');
        }
        else {
            m.redraw();
        }
    }

    complete() {
        return this.code.length === 6 && this.passwordsMatch() && PasswordValidator.passwordValid(this.password) && this.password !== ''
    }

    passwordsMatch(){
        return this.password === this.confirmPassword;
    }


}
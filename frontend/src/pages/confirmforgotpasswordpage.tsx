import m from 'mithril';
import { bind } from '../uiutils';
import { Page } from './page';
import { AuthClient } from '../authclient';
import { PasswordValidator } from './passwordvalidator';

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
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Code</label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline" id="code" type="code" placeholder="******"/>
                        </div>
                        {this.code && <div>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="password">New password</label>
                                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************"/>
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Confirm new password</label>
                                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline" id="confirmPassword" type="password" placeholder="******************"/>
                                {!this.passwordsMatch() && <p class="text-red-500 text-xs italic">Passwords do not match</p>}
                                {!PasswordValidator.passwordValid(this.password) && <p class="text-red-500 text-xs italic">{PasswordValidator.passwordPolicy()}</p>}
                            </div>
                        </div>}
                        {AuthClient.user.loginError && <p class="text-red-500 text-xs italic">{AuthClient.user.loginError}</p>}
                        <div class="flex items-center justify-between mb-4">
                            <button disabled={!complete} class="disabled:opacity-50 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button" onclick={() => this.login()}>
                                OK
                            </button>
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
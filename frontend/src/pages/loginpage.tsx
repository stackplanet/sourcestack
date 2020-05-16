import m from 'mithril';
import { bind } from '../uiutils';
import { Page } from './page';
import { AuthClient } from '../authclient';
import { LabelledInput } from '../components/labelledinput';
import { Button } from '../components/button';

export class LoginPage {

    email: string = '';
    password: string = '';

    oncreate(){
        document.getElementById('email').focus();
    }

    view() {
        let complete = this.complete();
        return <Page hideNavbar={true}>
            <div class="flex justify-center">
                <div class="w-full max-w-md pt-8">
                    <h1 class="text-center text-2xl mb-4">Log in to staklist</h1>
                    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" {...bind(this)}>
                        <div class="mb-4">
                            <LabelledInput label="Email" id="email" type="email" placeholder="me@awesome.com"/>
                        </div>
                        <div class="mb-4">
                            <LabelledInput label="Password" id="password" type="password" placeholder="********"/>    
                            {AuthClient.user.loginError && <p class="text-red-500 text-xs italic">{AuthClient.user.loginError}</p>}
                            <a class="text-sm text-blue-500" href="/#!/forgotpassword">Forgot your password?</a>
                        </div>
                        <div class="flex items-center justify-between mb-4">
                            <Button label="Log in" disabled={!this.complete()} callback={() => this.signup()}/>
                        </div>
                        <div class="text-center text-sm">
                            Need an account? <a href="/#!/signup" class="text-blue-500">Sign up</a>
                        </div>
                    </form>

                </div>
            </div>
        </Page>
    }

    async signup() {
        await AuthClient.login(this.email, this.password);
        if (!AuthClient.user.loginError){
            m.route.set('/home');
        }
        else {
            m.redraw();
        }
    }

    complete() {
        console.log('Calling complete')
        return this.email !== '' && this.password !== ''
    }
}
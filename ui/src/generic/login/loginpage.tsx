import m from 'mithril';
import { bind } from '../../uiutils';
import { AuthClient } from './authclient';
import { LabelledInput } from '../../components/labelledinput';
import { Button } from '../../components/button';
import { LoginPanel } from '../../components/login/loginpanel';
import { AuthPage } from './authpage';

export class LoginPage extends AuthPage {

    email: string = '';
    password: string = '';

    oncreate(){
        document.getElementById('email').focus();
    }

    view() {
        return <LoginPanel title="Log in to sourcestack-demo">
            <div {...bind(this)}>
                <div class="mb-4">
                    <LabelledInput label="Email" id="email" type="email" placeholder="me@awesome.com"/>
                </div>
                <div class="mb-4">
                    <LabelledInput label="Password" id="password" type="password" placeholder="********"/>    
                    {this.error && <p class="text-red-500 text-xs italic">{this.error}</p>}
                    <a class="text-sm text-blue-500" href="/#!/forgotpassword">Forgot your password?</a>
                </div>
                <div class="mb-4">
                    <Button label="Log in" id="ok" disabled={!this.complete()} callback={() => this.signup()}/>
                </div>
                <div class="text-center text-sm">
                    Need an account? <a href="/#!/signup" class="text-blue-500">Sign up</a>
                </div>
            </div>
        </LoginPanel>
    }

    async signup() {
        await AuthClient.login(this.email, this.password);
        this.navigateOnSuccess('/home');
    }

    complete() {
        console.log('Calling complete')
        return this.email !== '' && this.password !== ''
    }
}
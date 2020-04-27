import m from 'mithril';
import { bind } from '../UiUtils';
import { Page } from './Page';
import { AuthClient } from '../AuthClient';

export class SignInPage {

    username: string = '';
    password: string = '';

    view() {
        return <Page hideNavbar={true}>
            <div class="container">
            <div class="columns centerall">
                <div class="column"></div>
                <div class="column" {...bind(this)}>
                    <h1 class="is-size-3 has-text-centered">Sign in</h1>
                    <div class="field">
                        <label class="label">Username</label>
                        <div class="control">
                            <input class="input" type="text" placeholder="Username" id="username" value={this.username} autofocus={true}></input>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Password</label>
                        <div class="control">
                            <input class="input" type="password" placeholder="Password" id="password" value={this.password} />
                            
                        </div>
                    </div>
                    
                    <div class="field has-padding-top-10">
                        <a class="button is-primary is-fullwidth" onclick={() => this.login()}>Sign in</a>
                    </div>
                    <div class="level has-padding-top-10">
                        <div class="level-item has-text-centered">
                            <a href="#">Forgot password?</a>
                        </div>
                        
                        <div class="level-item has-text-centered">
                            <a href="#">Sign up</a>
                        </div>
                    </div>
                    {AuthClient.user.loginError && <article class="message is-danger">
                        <div class="message-body">
                            {AuthClient.user.loginError}
                        </div>    
                    </article>}
                </div>
                <div class="column"></div>
            </div>
            </div>
        </Page>
    }

    async login() {
        await AuthClient.login(this.username, this.password);
    }
}
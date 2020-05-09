import m from 'mithril';
import { bind } from '../uiutils';
import { Page } from './page';
import { AuthClient } from '../authclient';

export class SignUpPage {

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
                    <h1 class="text-center text-2xl mb-4">Sign up for staklist</h1>
                    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" {...bind(this)}>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="email" />
                        </div>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
                            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" onkeyup={() => {console.log('key')}}/>
                            {AuthClient.user.loginError && <p class="text-red-500 text-xs italic">{AuthClient.user.loginError}</p>}
                        </div>
                        <div class="flex items-center justify-between mb-4">
                            <button disabled={!complete} class="disabled:opacity-50 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button" onclick={() => this.login()}>
                                Sign up
                            </button>
                        </div>
                        
                    </form>

                </div>
            </div>
        </Page>
    }

    async login() {
        await AuthClient.signup(this.email, this.password);
    }

    complete() {
        return this.email !== '' && this.password !== ''
    }
}
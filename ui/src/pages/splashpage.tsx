import { Page } from '../components/page';
import m from 'mithril';
import { AuthClient } from '../generic/login/authclient';

export class SplashPage {

    view() {
        return <Page>
            <div class="py-20" style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%)">
                <div class="container mx-auto px-6">
                    <h2 class="text-4xl font-bold mb-2 text-white">
                        A really simple demo app
                    </h2>
                    <h3 class="text-2xl mb-8 text-gray-200">
                        Built with <a class="text-blue-300 text-" href="https://github.com/stacklords/sourcestack">sourcestack</a>
                    </h3>
                    {AuthClient.user.userId ? 
                    <a href="#!/home" class="bg-white font-bold rounded-full py-4 px-8 shadow-lg uppercase tracking-wider">
                        Your list
                    </a>
                    :
                    <a href="#!/login" class="bg-white font-bold rounded-full py-4 px-8 shadow-lg uppercase tracking-wider">
                        Log in
                    </a>
                    }
                    
                </div>
            </div>
        </Page>
    }

}
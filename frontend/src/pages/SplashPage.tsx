import { Page } from './Page';
import m from 'mithril';

export class SplashPage {

    view() {
        return <Page>
            <div class="py-20" style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%)">
                <div class="container mx-auto px-6">
                    <h2 class="text-4xl font-bold mb-2 text-white">
                        A really simple team todo list
                    </h2>
                    <h3 class="text-2xl mb-8 text-gray-200">
                        Built with stak
                    </h3>
                    <a href="#!/signin" class="bg-white font-bold rounded-full py-4 px-8 shadow-lg uppercase tracking-wider">
                        Log in
                    </a>
                </div>
            </div>
        </Page>
    }

}
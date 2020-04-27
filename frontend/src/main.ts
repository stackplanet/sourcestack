import m from 'mithril';
import { HomePage } from './pages/homepage';
import { FrontendConfig } from './frontendconfig';
import { AuthClient } from './AuthClient';
import { LoadingPage } from './pages/LoadingPage';
import { SplashPage } from './pages/SplashPage';
import { SignInPage } from './pages/SignInPage';
import { UserHomePage } from './pages/UserHomePage';
import '../sass/mystyles.scss'

(async () => {
    
    await AuthClient.init();

    m.route.set('/signin');
    m.route(document.body, '/splash', {
        '/loading': LoadingPage,
        '/splash': SplashPage,
        '/signin': SignInPage,
        '/home': UserHomePage,
    });

    if (AuthClient.user.userId){
        m.route.set('/home');
    }
    else {
        m.route.set('/splash');
    }

})();

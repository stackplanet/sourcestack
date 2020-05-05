import m from 'mithril';
import { HomePage } from './pages/homepage';
import { FrontendConfig } from './frontendconfig';
import { AuthClient } from './authclient';
import { LoadingPage } from './pages/loadingpage';
import { SplashPage } from './pages/splashpage';
import { LoginPage } from './pages/loginpage';
import { UserHomePage } from './pages/userhomepage';
import './css/main.css';

(async () => {
    
    await AuthClient.init();

    m.route.set('/login');
    m.route(document.body, '/splash', {
        '/loading': LoadingPage,
        '/splash': SplashPage,
        '/login': LoginPage,
        '/home': UserHomePage,
    });

    if (AuthClient.user.userId){
        m.route.set('/home');
    }
    else {
        m.route.set('/splash');
    }

})();

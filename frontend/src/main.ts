import m from 'mithril';
import { HomePage } from './pages/homepage';
import { FrontendConfig } from './frontendconfig';
import { AuthClient } from './authclient';
import { LoadingPage } from './pages/loadingpage';
import { SplashPage } from './pages/splashpage';
import { LoginPage } from './pages/loginpage';
import { UserHomePage } from './pages/userhomepage';
import './css/main.css';
import { ForgotPasswordPage } from './pages/forgotpasswordpage';
import { SignUpPage } from './pages/signuppage';
import { ConfirmSignupPage } from './pages/confirmsignuppage';
import { ConfirmForgotPasswordPage } from './pages/confirmforgotpasswordpage';

(async () => {
    
    await AuthClient.init();

    // m.route.set('/login');
    m.route(document.body, '/splash', {
        '/loading': LoadingPage,
        '/splash': SplashPage,
        '/login': LoginPage,
        '/home': UserHomePage,
        '/signup': SignUpPage,
        '/confirmsignup': ConfirmSignupPage,
        '/forgotpassword': ForgotPasswordPage,
        '/confirmforgotpassword': ConfirmForgotPasswordPage,
    });

    // if (AuthClient.user.userId){
    //     m.route.set('/home');
    // }
    // else {
    //     m.route.set('/splash');
    // }

})();

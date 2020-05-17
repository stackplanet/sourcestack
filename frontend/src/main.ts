import m from 'mithril';
import { HomePage } from './pages/homepage';
import { FrontendConfig } from './frontendconfig';
import { AuthClient } from './authclient';
import { LoadingPage } from './pages/loadingpage';
import { SplashPage } from './pages/splashpage';
import { LoginPage } from './pages/login/loginpage';
import { UserHomePage } from './pages/userhomepage';
import './css/main.css';
import { SignUpPage } from './pages/login/signuppage';
import { ConfirmSignupPage } from './pages/login/confirmsignuppage';
import { ConfirmForgotPasswordPage } from './pages/login/confirmforgotpasswordpage';
import { ForgotPasswordPage } from './pages/login/forgotpasswordpage';

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

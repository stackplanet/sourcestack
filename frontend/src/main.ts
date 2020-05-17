import m from 'mithril';
import { AuthClient } from './authclient';
import { LoadingPage } from './pages/loadingpage';
import { SplashPage } from './pages/splashpage';
import { LoginPage } from './pages/login/loginpage';
import { UserHomePage } from './pages/userhomepage';
import { SignUpPage } from './pages/login/signuppage';
import { ConfirmSignupPage } from './pages/login/confirmsignuppage';
import { ConfirmForgotPasswordPage } from './pages/login/confirmforgotpasswordpage';
import { ForgotPasswordPage } from './pages/login/forgotpasswordpage';
import './css/main.css';

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

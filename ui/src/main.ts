import m from 'mithril';
import { AuthClient } from './generic/login/authclient';
import { SplashPage } from './pages/splashpage';
import { LoginPage } from './generic/login/loginpage';
import { UserHomePage } from './pages/userhomepage';
import { SignUpPage } from './generic/login/signuppage';
import { ConfirmSignupPage } from './generic/login/confirmsignuppage';
import { ConfirmForgotPasswordPage } from './generic/login/confirmforgotpasswordpage';
import { ForgotPasswordPage } from './generic/login/forgotpasswordpage';
import './css/main.css';

(async () => {
    
    await AuthClient.init();

    m.route(document.body, '/splash', {
        '/splash': SplashPage,
        '/login': LoginPage,
        '/home': UserHomePage,
        '/signup': SignUpPage,
        '/confirmsignup': ConfirmSignupPage,
        '/forgotpassword': ForgotPasswordPage,
        '/confirmforgotpassword': ConfirmForgotPasswordPage,
    });

    if (AuthClient.user.userId){
        m.route.set('/home');
    }
    else {
        m.route.set('/splash');
    }

})();

import { Auth } from 'aws-amplify';

// To federated sign in from Google
export default class SignInWithGoogle {

    async init() {
        const ga = window['gapi'] && window['gapi'].auth2 ? 
            window['gapi'].auth2.getAuthInstance() : 
            null;
        if (!ga) this.createScript();
    }

    async getUser(){
        try {
            return await Auth.currentAuthenticatedUser()
        } catch (e){
            return null
        }
    }

    async signIn() {
        const ga = window['gapi'].auth2.getAuthInstance();
        ga.signIn().then(
            async googleUser => {
                let user = await this.getAWSCredentials(googleUser);
                let user2 = await this.getUser();
            },
            error => {
                console.log(error);
            }
        )
    }
    
    private async getAWSCredentials(googleUser) {
        const { id_token, expires_at } = googleUser.getAuthResponse();
        const profile = googleUser.getBasicProfile();
        let user = {
            email: profile.getEmail(),
            name: profile.getName()
        };
        
        const credentials = await Auth.federatedSignIn(
            'google',
            { token: id_token, expires_at },
            user
            );
        console.log('credentials', credentials);
        return user;
    }

    private createScript() {
        // load the Google SDK
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/platform.js';
        script.async = true;
        script.onload = this.initGapi;
        document.body.appendChild(script);
    }

    private initGapi() {
        // init the Google SDK client
        const g = window['gapi'];
        g.load('auth2', function() {
            g.auth2.init({
                client_id: '1055443311100-1i0mr6i8am16l1rimmhs1k1d5v9r4vkj.apps.googleusercontent.com',
                // authorized scopes
                scope: 'profile email openid'
            });
        });
    }

    async signOut(){
        await Auth.signOut()
    }

}
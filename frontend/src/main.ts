import m from 'mithril';
import { HomePage } from './pages/homepage';
import { FrontendConfig } from './frontendconfig';


FrontendConfig.init().then(() => {
    console.log('API endpoint is ' + FrontendConfig.instance.api);
})


m.route(document.body, '/home', {
    '/home': HomePage,
});



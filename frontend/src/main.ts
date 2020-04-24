import m from 'mithril';
import { HomePage } from './pages/homepage';
import { UiConfig } from './Config';


UiConfig.init().then(() => {
    console.log('API endpoint is ' + UiConfig.instance.api);
})


m.route(document.body, '/home', {
    '/home': HomePage,
});



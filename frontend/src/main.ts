import m from 'mithril';
import { HomePage } from './pages/homepage';

m.route(document.body, '/home', {
    '/home': HomePage,
});



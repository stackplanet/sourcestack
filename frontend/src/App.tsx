import m, { Vnode } from 'mithril';
import '../sass/mystyles.scss'
import MessageList from './MessageList';
import { Page } from './Page';
import { AppContext } from './model/AppContext';
import { MenuItem } from './MenuItem';
import Person from './model/Person';
import { Colors } from './Colors';
import Calendar from './Calendar';
import Amplify, { API, Auth } from 'aws-amplify';
import { CalendarEvent } from './model/CalendarEvent';
// import image from '../images/img.jpg';


// Replace HMR with browser reload 
if (module['hot']) module['hot'].accept(() => window.location.reload())

// function person(name:string){
//     let person = new Person();
//     person.name = name;
//     person.color = Colors.nextColor();
//     return person;
// }

// AppContext.dataProvider.deleteAllModels(Person);
// AppContext.dataProvider.saveModel(person('Dad'));
// AppContext.dataProvider.saveModel(person('Mum'));
// AppContext.dataProvider.saveModel(person('Jamie'));
// AppContext.dataProvider.saveModel(person('Rory'));
// AppContext.dataProvider.saveModel(person('Robin'));
// AppContext.init();

// class Goals {
//     view(){
//         return <h1>Goals</h1>
//     }
// }

// class PocketMoney {
//     view(){
//         return <h1>Pocket Money</h1>
//     }
// }

// class Settings {
//     view(){
//         return <h1>Settings</h1>
//     }
// }

// m.route(document.body, '/messages', {
//     '/messages': {view: () => <Page><MessageList/></Page>},
//     '/calendar': {view: () => <Page><Calendar/></Page>},
//     '/goals': {view: () => <Page><Goals/></Page>},
//     '/pocketmoney': {view: () => <Page><PocketMoney/></Page>},
//     '/settings': {view: () => <Page><Settings/></Page>}
// })

Amplify.configure({
    Auth: {
        identityPoolId: 'eu-west-2:881e406c-fa2c-44b2-9094-f4fea18c8f36',
        region: 'eu-west-2',
        userPoolId: 'eu-west-2_T9GvvZHYL',
        userPoolWebClientId: 'd830ie9k2hdcv6re4cke021uq',
    },
    API: {
        region: 'eu-west-2',
        endpoints: [
            {
                name: "api",
                endpoint: "https://yslqvw8j5b.execute-api.eu-west-2.amazonaws.com/alpha"
                // endpoint: "http://localhost:3000"
            }
        ]
    }
});


class HomePage {

    response:any
    events: CalendarEvent[] = [];

    async oninit(){
        // window['LOG_LEVEL'] = 'DEBUG';
        await Auth.signIn('martin', 'Monkey123!');
        this.updateEvents();
    }


    async updateEvents(){
        console.log("Logged in");
        let response = await API.get('api', '/CalendarEvent', {
            response: true
            
        });
        
        this.events = response.data as CalendarEvent[];
        m.redraw();
    }

    view(){
        
        return <div>
            <ul>
                {this.events.map((e:CalendarEvent) => <li>{e.id} {e.created}</li>)}

            </ul>
            <button onclick={() => this.addEvent()}>Add a new event</button>
        </div>
    }

    async addEvent(){
        let event:CalendarEvent = {name: "New event", date:new Date().toISOString()}
        await API.post('api', '/CalendarEvent', {
            response: true,
            body: event
        })
        this.updateEvents();
    }
}


m.route(document.body, '/home', {
    '/home': {view: () => <HomePage/>},
})

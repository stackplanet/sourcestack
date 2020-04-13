import m, { Vnode } from 'mithril';
import { AppContext } from './model/AppContext';
import Person from './model/Person';

export default class PersonSwitchMenu {

    switchPerson(person:Person){
        AppContext.currentUser = person;
    }

    view() {
        let people = AppContext.dataProvider.loadModels(Person);
        
        return <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">{AppContext.currentUser.name}</a>
            <div class="navbar-dropdown">
                {people.map(p => <a class="navbar-item" onclick={() => this.switchPerson(p)}>{p.name}</a>)}
                <hr class="navbar-divider"/>
                <a class="navbar-item">Add new user...</a>
            </div>
        </div>
    }

}
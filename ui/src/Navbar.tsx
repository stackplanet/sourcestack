import m, { Vnode } from 'mithril';
import { AppContext } from './model/AppContext';
import PersonSwitchMenu from './PersonSwitchMenu';

export default class Navbar {
    view() {
        return <nav class="navbar has-shadow" role="navigation" aria-label="main navigation">
            <div class="container">
                <div class="navbar-brand">
                    <a class="navbar-item navbar__logo" href="/#!">
                        fb
                    </a>

                    <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div id="navbarBasicExample" class="navbar-menu">
                    <div class="navbar-start">
                        
                    </div>

                    <div class="navbar-end">
                    <div class="navbar-item">
                        Logged in as:
                    </div>
                        <PersonSwitchMenu/>
                            
                        <div class="navbar-item">
                            <div class="buttons">
                                
                                <a class="button is-light">
                                    Log out family
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    }
}


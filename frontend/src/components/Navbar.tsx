import m, { Vnode } from 'mithril';
import { AuthClient } from '../AuthClient';

export default class Navbar {

    view() {
        return <nav class="navbar has-shadow" role="navigation" aria-label="main navigation">
            <div class="container">
                <div class="navbar-brand">
                    <a class="navbar-item navbar__logo" href="/#!">
                        fu-du
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


                    {AuthClient.user.userId ?
                        <div class="navbar-end">
                            <div class="navbar-item">
                                {AuthClient.user.userId}
                            </div>
                            <div class="navbar-item">
                                <div class="buttons">
                                    <a class="button is-light" onclick={async () => await AuthClient.logout()}>
                                            Sign out
                                    </a>
                                </div>
                            </div>
                        </div>
                        :
                        <div class="navbar-end">
                            <div class="navbar-item">
                                <div class="buttons">
                                    <a class="button is-light" onclick={() => {}}>
                                        Register
                                    </a>
                                </div>
                            </div>
                            {/* <div class="navbar-item">
                                Already have an account?
                            </div> */}
                            <div class="navbar-item">
                                <div class="buttons">
                                    <a class="button is-light" href='#!/signin'>
                                        Sign in
                                    </a>
                                </div>
                            </div>
                            
                            
                        </div>
                    }
                </div>
            </div>
        </nav>
    }

}


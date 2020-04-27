import { Page } from './Page';
import m from 'mithril';

export class SplashPage {

    view() {
        return <Page>
            <div>

                <section class="hero is-primary is-medium" style="height: 100%">
                    <div class="hero-body">
                        <div class="container has-text-centered" >
                            <h1 class="title">
                                A really simple team todo list
                            </h1>
                            
                        </div>
                    </div>
                </section>
                
                
            </div>
        </Page>
    }

}
import { Page } from '../components/page';
import m from 'mithril';
import '../css/main.css'

export class HomePage {

    view() {
        return <Page>
            <h1 class="text-blue-400 text-3xl">Hello world</h1>
            <img src="images/earth.jpeg"/>
        </Page>
    }

}
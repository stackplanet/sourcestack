import m, { Vnode } from 'mithril';
import Navbar from './Navbar';
import { MenuItem } from './MenuItem';

export class Page {
    view(vnode:Vnode<any>) {
        return <div>
            <Navbar />
            <div class="container">
                <div class="columns main">
                    <div class="column is-one-quarter">
                        <aside class="menu">
                            <ul class="menu-list">
                                <MenuItem icon="fa-comments" text="Messages" href="#!/messages"/>
                                <MenuItem icon="fa-calendar" text="Calendar" href="#!/calendar"/>
                                <MenuItem icon="fa-bullseye" text="Goals" href="#!/goals" />
                                <MenuItem icon="fa-piggy-bank" text="Pocket money" href="#!/pocketmoney"/>
                                <MenuItem icon="fa-cog" text="Settings" href="#!/settings"/>
                            </ul>
                        </aside>
                    </div>
                    <div class="column">
                        {vnode.children}
                    </div>
                </div>
            </div>
        </div>
    }
}
import m from 'mithril';
import { statelessViewComponent } from './statelessviewcomponent';

export const Page = statelessViewComponent<{}>(n =>
    <div class="">
        {n.children}
    </div>);
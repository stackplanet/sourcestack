import m, { Vnode } from 'mithril';
import Navbar from '../components/Navbar';
import { MithrilTsxComponent } from 'mithril-tsx-component';

class IAttrs {

    hideNavbar?: boolean;

}

export class Page extends MithrilTsxComponent<IAttrs>{

    view(vnode: Vnode<any>) {
        return <div class="bg-gray-100 h-screen">
            {!vnode.attrs.hideNavbar && <Navbar />}
            <div>
                {vnode.children}
            </div>
        </div>
    }
    
}
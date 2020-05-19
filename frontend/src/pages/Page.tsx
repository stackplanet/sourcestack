import m, { Vnode } from 'mithril';
import Navbar from '../components/navbar';
import { MithrilTsxComponent } from 'mithril-tsx-component';

class IAttrs {

    hideNavbar?: boolean;

}

export class Page extends MithrilTsxComponent<IAttrs>{

    view(vnode: Vnode<any>) {
        return <div class="bg-gray-100 h-screen min-h-screen w-full">
            {!vnode.attrs.hideNavbar && <Navbar />}
            <div class="container px-6 py-2 mx-auto">
                {vnode.children}
            </div>
        </div>
    }
    
}
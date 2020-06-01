import m, { Vnode } from 'mithril';
import Navbar from './navbar';
import { MithrilTsxComponent } from 'mithril-tsx-component';
import Footer from './footer';

class IAttrs {

    hideNavbar?: boolean;
    bg?: string;
}

export class Page extends MithrilTsxComponent<IAttrs>{

    view(vnode: Vnode<any>) {
        let bg = vnode.attrs.bg || 'bg-gray-100';
        return <div class={`${bg} flex flex-col h-screen justify-between`}>
            {!vnode.attrs.hideNavbar && <Navbar />}
            <div class="container px-6 py-2 mb-auto mx-auto">
                {vnode.children}
            </div>
            <Footer/>
        </div>
    }
    
}
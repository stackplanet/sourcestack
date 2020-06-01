import { MithrilTsxComponent } from "mithril-tsx-component";
import m, { Vnode } from "mithril";

interface Attrs {

    loading: boolean;
}

export class WithSpinner extends MithrilTsxComponent<Attrs> {

    view(vnode: Vnode<Attrs>) {
        let a = vnode.attrs;
        return <div>
            {a.loading ? <div class="loader h-screen"/> : vnode.children}
        </div>
    }

}
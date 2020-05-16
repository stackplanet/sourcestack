import { MithrilTsxComponent } from "mithril-tsx-component";
import m, { Vnode } from "mithril";

interface Attrs {

    label: string;
    callback: () => any;
    id?: string;
    disabled?: boolean;

}

export class Button extends MithrilTsxComponent<Attrs> {

    view(vnode: Vnode<Attrs>) {
        let a = vnode.attrs;
        return <button disabled={a.disabled} class="disabled:opacity-50 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" 
            type="button" onclick={() => a.callback()}>
        {a.label}
    </button>
    }

}
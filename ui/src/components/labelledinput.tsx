import { MithrilTsxComponent } from "mithril-tsx-component";
import m, { Vnode } from "mithril";

interface Attrs {

    label: string;
    id: string;
    type: string;
    placeholder?: string;
    onchange?: Function
}

export class LabelledInput extends MithrilTsxComponent<Attrs> {

    view(vnode: Vnode<Attrs>) {
        let a = vnode.attrs;
        return <div>
            <label class="block text-gray-700 text-sm font-bold mb-2" for={a.id}>{a.label}</label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline" 
                id={a.id} name={a.id} type={a.type} placeholder={a.placeholder} onchange={a.onchange}/> 
        </div>
    }

}
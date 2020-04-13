import { MithrilTsxComponent } from "mithril-tsx-component";
import m, { Vnode } from "mithril";

export class MenuItem extends MithrilTsxComponent<any> {

    view(vnode: Vnode<any>) {
        let active = location.hash == vnode.attrs['href'];
        return <li>
            <a href={vnode.attrs['href']} class={active ? 'is-active' : ''}>
                <span class="icon">
                    <i class={'fas ' + vnode.attrs['icon']} aria-hidden="true"></i>
                </span>
                {vnode.attrs['text']}
            </a>
        </li>
    }

}
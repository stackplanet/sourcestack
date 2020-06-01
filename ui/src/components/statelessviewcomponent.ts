import m, { Vnode, Children } from 'mithril';
import { MithrilTsxComponent } from 'mithril-tsx-component';

// @common
export function statelessViewComponent<T>(c: (x: Vnode<T>) => Children) {
    return class Page extends MithrilTsxComponent<T> {
        view(n: Vnode<T>) {
            return c(n);
        }
    }
}
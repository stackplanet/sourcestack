import { MithrilTsxComponent } from "mithril-tsx-component";
import m, { Vnode } from "mithril";
import { Page } from "../page";

interface Attrs {
    title: string;
}

export class LoginPanel extends MithrilTsxComponent<Attrs> {

    view(vnode: Vnode<Attrs>) {
        return <Page hideNavbar={true} bg="white">
            <div class="flex justify-center">
                <div class="w-full max-w-md pt-8">
                    <h1 class="text-center text-2xl mb-4">{vnode.attrs.title}</h1>
                    <form class="lg:shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        {vnode.children}
                    </form>
                </div>
            </div>
        </Page>
    }

}
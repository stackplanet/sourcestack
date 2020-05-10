import m from 'mithril';
import { Page } from "./page";
import { AuthClient } from '../authclient';
import { Todo} from '../todo'

export class UserHomePage {

    results:Todo[] = [];

    // https://github.com/MithrilJS/mithril.js/issues/2426
    async oninit() {
        // this.results = await m.request({
        //     url: '/api/todos'
        // })
        this.results = [];
        m.redraw();
    }

    view() {
        return <Page>
            <h1>Welcome {AuthClient.user.userId}</h1>
            {/* <h1>TODOs</h1>
            <table>
                {this.results.map((t:Todo) => <tr>
                    <td>{t.created}</td>
                    <td>{t.status}</td>
                    <td>{t.value}</td>
                    <td>{t.userid}</td>
                </tr>)}

            </table>
            <button onclick={() => this.createTodo()}>Create</button> */}
        </Page>
    }

    async createTodo(){
        let todo:Todo = {
            value: 'Todo ' + new Date().getTime(),
            userid: AuthClient.user.userId,
            created: new Date(),
            status: 'new'
        }
        await m.request({
            method: 'POST',
            url: '/api/todo',
            body: todo
        });
        this.results = await m.request({
            url: '/api/todos'
        })
        m.redraw();
    }

}
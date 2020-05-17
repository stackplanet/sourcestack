import m from 'mithril';
import { Page } from "./page";
import { AuthClient } from '../authclient';
import { Todo} from '../todo'
import { Button } from '../components/button';
import { LabelledInput } from '../components/labelledinput';
import { targetValue } from '../uiutils';

export class UserHomePage {

    results:Todo[] = [];
    hoveredTodo: Todo;
    newTodo: string;

    async oninit() {
        await this.refresh();
    }

    view() {
        return <Page>
            <LabelledInput id="newTodo" type="text" label="What needs done?" placeholder="New item" onchange={() => this.createTodo()}/>
            <table>
                {this.results.map((t:Todo) => <tr onmouseover={() => this.hoveredTodo = t}>
                    <td>{t.id}</td>
                    <td>{t.created}</td>
                    <td>{t.status}</td>
                    <td>{t.value}</td>
                    <td>{t.userid}</td>
                    {t === this.hoveredTodo && <td><button onclick={() => this.deleteTodo(t)}>delete</button></td>}
                </tr>)}

            </table>
            {/* <Button label="create" callback={() => this.createTodo()}/> */}
        </Page>
    }

    async deleteTodo(todo:Todo){
        await m.request({
            method: 'DELETE',
            url: '/api/todo?id=' + todo.id,
        });
        await this.refresh();
    }

    async createTodo(){
        let input = document.getElementById('newTodo') as HTMLInputElement;
        let todo:Todo = {
            value: input.value,
            userid: AuthClient.user.userId, // TODO - move this to server side
            created: new Date(),
            status: 'new'
        }
        await m.request({
            method: 'POST',
            url: '/api/todo',
            body: todo
        });
        input.value = '';
        this.newTodo = undefined;
        await this.refresh();
    }

    async refresh(){
        this.results = await m.request({
            url: '/api/todos'
        })
        m.redraw();
    }

}
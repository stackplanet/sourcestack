import m from 'mithril';
import axios from 'restyped-axios';
import { Todo } from '../../../api/src/model';
import { TodoApi } from '../../../api/src/apitypes';
import { Page } from "../components/page";
import { WithSpinner } from '../components/withspinner';

export class UserHomePage {

    results:Todo[] = [];
    loading = true;
    client = axios.create<TodoApi>();

    async oninit() {
        await this.refresh();
    }

    view() {
        return <Page>
            <input id="newTodo" autocomplete="no" class="w-full h-20 px-5 text-xl" type="text" placeholder="What needs to be done?" onchange={() => this.createTodo()}/>
            <WithSpinner loading={this.loading}>
                <ul>
                    {this.results.map((t:Todo) => <li class="h-20 border-b-2 w-full hover:bg-gray-200 flex items-center px-5 text-xl justify-between">
                        <div>{t.title}</div> 
                        <button class="focus:outline-none" onclick={() => this.deleteTodo(t)}>×</button>
                    </li>)}
                </ul>
            </WithSpinner>
        </Page>
    }

    async deleteTodo(todo:Todo){
        await this.client.request({
            url: '/api/private/todo',
            method: 'DELETE',
            params: {
                id: todo.taskId.toString()
            }
        });
        await this.refresh();
    }

    async createTodo(){
        let input = document.getElementById('newTodo') as HTMLInputElement;
        await this.client.request({
            url: '/api/private/todo',
            method: 'POST',
            data: {
                title: input.value
            }
        });
        input.value = '';
        await this.refresh();
    }

    async refresh(){
        this.loading = true;
        m.redraw()
        let res = await this.client.request({
            url: '/api/private/todos',
            method: 'GET',
        });
        this.results = res.data;
        this.loading = false;
        m.redraw();
        document.getElementById('newTodo').focus();
    }

}
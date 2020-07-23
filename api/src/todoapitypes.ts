import { Todo } from "./todo";

export interface TodoApi {
    '/api/private/todos': {
        GET: {
            response: Todo[]
        }
    },
    '/api/private/todo': {
        POST: {
            body: {
                title: string
            }
            response: Todo
        },
        DELETE: {
            query: {
                id: string
            }
        }
    },
    '/api/ping': {
        GET: {
            response: string
        }
    },
    '/api/private/ping': {
        GET: {
            response: string
        }
    }
}
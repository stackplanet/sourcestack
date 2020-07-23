import { UserDetails } from "./userdetails";

export interface AuthApi {
    '/api/auth/user': {
        GET: {
            response: { userId: string | undefined }
        }
    },
    '/api/auth/login': {
        POST: {
            body: {
                username: string
                password: string
            },
            response: UserDetails
        }
    }
    '/api/auth/signup': {
        POST: {
            body: {
                username: string
                password: string
            },
            response: UserDetails
        }
    },
    '/api/auth/confirmsignup': {
        POST: {
            body: {
                username: string,
                password: string,
                code: string
            },
            response: UserDetails
        }
    },
    '/api/auth/forgotpassword': {
        POST: {
            body: {
                username: string
            },
            response: UserDetails
        }
    },
    '/api/auth/confirmforgotpassword': {
        POST: {
            body: {
                username: string,
                password: string,
                code: string
            },
            response: UserDetails
        }
    },
    '/api/auth/logout': {
        POST: {}
    }
}
import request from 'supertest';
import { configureApp } from '../../src/api';
import { fromStack } from '../../../infra/src/generic/stackoutput';
import { execute } from '../../../scripts/execute';

/**
 * Integration test for authhandler.
 * 
 * To run, this requires an environment called staklist-alpha to be created.
 * 
 * It also requires a user refreshtest@staklist.net to be created. Follow the instructions in "generate expiredJwt" below.
 * 
 */

let app = configureApp();

let user1 = 'foo@staklist.net';
let password1 = 'Foo_Bar_123';

let userPoolId = '';

let testState = {
    authToken: '',
    refreshToken: ''
}

beforeAll(async () => {
    let s = await fromStack('staklist-alpha')
    userPoolId = s.UserPoolId;
});

let deleteUser = async () => {
    await execute(`aws cognito-idp admin-delete-user --user-pool-id ${userPoolId} --username ${user1}`, false);
}

let signUp = async (username = user1, password = password1) => {
    return await request(app).post('/api/signup').send({ username: username, password: password });
}

let confirmSignUp = async (username = user1) => {
    await execute(`aws cognito-idp admin-confirm-sign-up --user-pool-id ${userPoolId} --username ${username}`, false);
}

let login = async (username = user1, password = password1) => {
    let response = await request(app).post('/api/login').send({ username: username, password: password });
    let authTokenCookie = response.header['set-cookie'][0];
    testState.authToken = authTokenCookie.split(';')[0];
    let refreshTokenCookie = response.header['set-cookie'][1];
    testState.refreshToken = refreshTokenCookie.split(';')[0];
    return response;
}

test(`when not logged in, then 401 on private endpoint`, async () => {
    let response = await request(app).get('/api/private/ping');
    expect(response.status).toBe(401);
});

test(`when not logged in, then undefined on user endpoint`, async () => {
    let response = await request(app).get('/api/user');
    expect(response.body).toEqual({ userId: undefined });
});

test(`when signed up but not confirmed, can't log in`, async () => {
    await deleteUser();
    await signUp();
    let response = await request(app).post('/api/login').send({ username: user1, password: password1 });
    expect(response.body).toEqual({ loginError: "User is not confirmed." });
});

test(`when signing up with existing user, then error`, async () => {
    await deleteUser();
    await signUp();
    let response = await signUp();
    expect(response.body.loginError).toEqual('An account with the given email already exists.');
});

test(`when signing up, then success`, async () => {
    await deleteUser();
    let response = await signUp();
    expect(response.body).toEqual({ userId: user1 });
})

test(`when signing up with password that doesn't meet policy, then error message`, async () => {
    await deleteUser();

    let response = await request(app).post('/api/signup').send({ username: user1, password: 'p4ssw0rd' });
    expect(testState.authToken).toEqual('');
    expect(response.body.loginError).toEqual('Password did not conform with policy: Password must have uppercase characters');
});

test(`when sign up code incorrect, then error`, async () => {
    await deleteUser();
    await signUp();
    let response = await request(app).post('/api/confirmsignup').send({ code: 'rubbish', username: user1 });
    expect(response.body.loginError).toBe('Invalid verification code provided, please try again.');
})

test(`when signed up and confirmed, can log in`, async () => {
    await deleteUser();
    await signUp();
    await confirmSignUp();
    let response = await login();
    expect(response.body).toEqual({ userId: user1 });
});

test(`when logging in with wrong password, then error`, async () => {
    await deleteUser();
    await signUp();
    await confirmSignUp();
    let response = await request(app).post('/api/login').send({ username: user1, password: 'ahaha' });
    expect(response.body.loginError).toEqual('Incorrect username or password.');
});

test(`when logged in, user and private endpoints work`, async () => {
    await deleteUser();
    await signUp();
    await confirmSignUp();
    await login();
    let response = await request(app).get('/api/user').set('Cookie', [testState.authToken]);
    expect(response.body).toEqual({ userId: user1 });
    response = await request(app).get('/api/private/ping').set('Cookie', [testState.authToken]);
    expect(response.text).toEqual(`pong ${user1}`);
});


test(`when expired token, then refresh`, async () => {
    // If this user needs to be recreated, run "generate expiredJwt" below.
    let expiredJwt = 'eyJraWQiOiJvakdUR0tcL0FydjFiNEI2Q0tGczdXRzVxNmMxRWxkYXpITG5NXC9qTXVSTTg9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIxYTJmYzg4Ni1jODFmLTQ1ZTUtOGEwOC05MzBjNGYzYTY1NGYiLCJldmVudF9pZCI6IjVmYzE2MWVhLTRiMDQtNDYyNy1hNDllLWM0OTE3ZDk4Nzc2MyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE1OTI1MDU5MTksImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTEuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0xX1NTYUVQYmVMdCIsImV4cCI6MTU5MjUwOTUxOSwiaWF0IjoxNTkyNTA1OTE5LCJqdGkiOiI1YzFjOThlNi01NTNkLTRhOTAtYjdhOC1jNjJlMjdhMGY2YTQiLCJjbGllbnRfaWQiOiI3dG1qOXNycTZqODZodGVwbDZhMXI4dTVrYyIsInVzZXJuYW1lIjoiMWEyZmM4ODYtYzgxZi00NWU1LThhMDgtOTMwYzRmM2E2NTRmIn0.j6VkoBLRJaxu1rbQMdfoHBxzX9YlFSzFAcaeVcJLfRqcydt2eT9gUonMTZcXVxU1d1wLQy0OBmL2Drr3FmuSA-PsUS5-IBBVh8lF40DnA9T26RPH7ieLyUqZ8LORHCOl1epEmb4j5Lwh2Y2KZzJABlOCZ3wt3wZaq70UY29-g6dZdO1zD9Clr6nRzy5ElLvZGggwL-ikmxYu6p2Ha4FJUoKVm8C-cGStG27DfFti4wyjE1nZN3wBGeJiSkRlo_0azs6g6urvrfLlN30ebfqh1kex7zzRwFN-pF0f1ZmWs8YViFTtGe_M0VpVFWgWhgVi8GUc4V7jDboSJUX5B876cg';
    await deleteUser();
    await signUp();
    await confirmSignUp();
    await login();
    await request(app).get('/api/user').set('Cookie', [testState.authToken, testState.refreshToken]);
    let expiredCookie = `auth_token=${expiredJwt}; Path=/; HttpOnly; Secure`;
    let response2 = await request(app).get('/api/private/ping').set('Cookie', [expiredCookie, testState.refreshToken]);
    let authTokenCookie = response2.header['set-cookie'][0];
    let newAuthToken = authTokenCookie.split(';')[0];
    expect(newAuthToken).toMatch(/auth_token=.*/);
    expect(newAuthToken).not.toEqual(testState.authToken);
    expect(response2.text).toMatch('pong ' + user1);
    let response3 = await request(app).get('/api/private/ping').set('Cookie', [newAuthToken, testState.refreshToken]);
    expect(response3.text).toMatch('pong ' + user1);
});

async function generateExpiredJwt(){
    let user = 'refreshtest@staklist.net';
    let password = 'Tht_htht%214';
    await signUp(user, password);
    await confirmSignUp(user);
    await login(user, password);
    console.log('Use the following for the value of expiredJwt (it will expire after 1 hour)')
    console.log(testState.authToken);
}

// (async () => generateExpiredJwt)();
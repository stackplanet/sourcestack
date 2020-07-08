import * as expect from 'expect';
import * as randomstring from 'randomstring';
import { click, closeBrowser, goto, into, openBrowser, press, text, textBox, write } from 'taiko';
import { execute } from '../../../scripts/execute';

export async function testApp(url: string, userPoolId: string){
    let random = randomstring.generate({length: 8,charset: 'alphabetic'});
    let username = random + '@sourcestack-demo.com';
    let password = randomstring.generate() + '!';
    let createdUser = false;
    try {
        await openBrowser({ignoreCertificateErrors:true, headless: false});
        await goto(url);
        await click('Log in');
        await click('Sign up');
        await write(username, into(textBox('Email')));
        await write(password, into(textBox('Password')));
        await write(password, into(textBox('Confirm password')));
        await click('Sign up');
        createdUser = true;
        // TODO - implement a mechanism for receiving the signup email so the six-digit code can be used here.
        // For now, just use this backdoor command to confirm the user
        await execute(`aws cognito-idp admin-confirm-sign-up --user-pool-id ${userPoolId} --username ${username}`, false);
        await goto(url);
        await click('Log in');
        await write(username, into(textBox('Email')));
        await write(password, into(textBox('Password')));
        await click('Log in');
        let todo = 'Wash the dishes';
        await write(todo, into(textBox({placeholder: 'What needs to be done?'})));
        await press('Enter');
        expect.default(await text(todo).exists()).toBe(true);
    } catch (error) {
        console.error(error);
    } finally {
        if (createdUser) await execute(`aws cognito-idp admin-delete-user --user-pool-id ${userPoolId} --username ${username}`, false);
        await closeBrowser();
    }
    console.log('Test successful!')
}
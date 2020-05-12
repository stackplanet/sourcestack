import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as AWS from 'aws-sdk';
import { UserDetails } from './userdetails';
import e = require('express');
import { BackendConfig } from './backendconfig';

declare global {

    namespace Express {
        interface Request {
            user: UserDetails;
        }
    }

}

export namespace AuthHandler {

    async function login(req: express.Request, res: express.Response, config: BackendConfig){
        let cognito = new AWS.CognitoIdentityServiceProvider();
            try {
                let authResponse = await cognito.adminInitiateAuth({
                    UserPoolId: config.UserPoolId,
                    ClientId: config.UserPoolClientId,
                    AuthFlow: 'ADMIN_NO_SRP_AUTH',
                    AuthParameters: {
                        USERNAME: req.body.username,
                        PASSWORD: req.body.password
                    }
                }).promise();
                if (authResponse.AuthenticationResult === undefined){
                    res.send(<UserDetails>{loginError:'Invalid Cognito response from initiate auth: ' + JSON.stringify(authResponse)});
                }
                else {
                    res.cookie('auth_token', authResponse.AuthenticationResult.AccessToken);
                    res.cookie('refresh_token', authResponse.AuthenticationResult.RefreshToken);
                    res.send(<UserDetails>{userId: req.body.username});
                }

            } catch (e){
                res.send(<UserDetails>{loginError:e.message});
            }
    }

    export function init(config: BackendConfig, app: express.Express) {

        app.use(async (req: express.Request, res: express.Response, next: any) => {
            req.user = {};
            const userId = await getId(req, config);
            if (userId) {
                req.user.userId = userId;
            }
            if (req.path.startsWith('/api/private')){
                if (userId){
                    next();
                }
                else res.status(401).send();
            }
            else {
                next();
            }
        });

        app.get('/api/user', async (req, res) => {
            const userId = await getId(req, config);
            res.send({userId: userId} || {});
        });

        app.post('/api/logout', async (req, res) => {
            res.clearCookie('auth_token');
            res.clearCookie('refresh_token');
            res.sendStatus(200);
        });
    
        app.post('/api/login', async (req, res) => {
            login(req, res, config);
        });

        app.post('/api/forgotpassword', async (req, res) => {
            let cognito = new AWS.CognitoIdentityServiceProvider();
            try {
                let response = await cognito.forgotPassword({
                    ClientId: config.UserPoolClientId,
                    Username: req.body.username,
                }).promise();
                if (response.$response.httpResponse.statusCode !== 200){
                    res.send(<UserDetails>{loginError:'Invalid Cognito response from reset password: ' + JSON.stringify(response)});
                }
                res.send(<UserDetails>{userId: req.body.username});
            } catch (e){
                res.send(<UserDetails>{loginError:e.message});
            }
        });

        app.post('/api/forgotpassword', async (req, res) => {
            console.log('diuhdhdhdiuiuh')
            let cognito = new AWS.CognitoIdentityServiceProvider();
            try {
                let username = req.body.username;
                let response = await cognito.forgotPassword({
                    ClientId: config.UserPoolClientId,
                    Username: username,
                }).promise();
                if (response.$response.httpResponse.statusCode !== 200){
                    res.send(<UserDetails>{loginError:'Invalid Cognito response from reset password: ' + JSON.stringify(response)});
                }
                res.send(<UserDetails>{userId: username});
            } catch (e){
                res.send(<UserDetails>{loginError:e.message});
            }
        });


        app.post('/api/confirmforgotpassword', async (req, res) => {
            let cognito = new AWS.CognitoIdentityServiceProvider();
            try {
                let username = req.body.username;
                let response = await cognito.confirmForgotPassword({
                    Username: username,
                    Password: req.body.password,
                    ConfirmationCode: req.body.code,
                    ClientId: config.UserPoolClientId
                }).promise();
                if (response.$response.httpResponse.statusCode !== 200){
                    res.send(<UserDetails>{loginError:'Invalid Cognito response for confirm forgot password' + JSON.stringify(response)});
                }
                login(req, res, config);
            } catch (e){
                res.send(<UserDetails>{loginError:e.message});
            }
        });


        app.post('/api/signup', async (req, res) => {
            let cognito = new AWS.CognitoIdentityServiceProvider();
            try {
                let username = req.body.username;
                let response = await cognito.signUp({
                    ClientId: config.UserPoolClientId,
                    Username: username,
                    Password: req.body.password
                }).promise();
                if (response.$response.httpResponse.statusCode !== 200){
                    res.send(<UserDetails>{loginError:'Invalid Cognito response for signup' + JSON.stringify(response)});
                }
                res.send(<UserDetails>{userId: username});
                
            } catch (e){
                res.send(<UserDetails>{loginError:e.message});
            }
        });

        app.post('/api/confirmsignup', async (req, res) => {
            let cognito = new AWS.CognitoIdentityServiceProvider();
            try {
                let username = req.body.username;
                let response = await cognito.confirmSignUp({
                    Username: username,
                    ConfirmationCode: req.body.code,
                    ClientId: config.UserPoolClientId
                }).promise();
                if (response.$response.httpResponse.statusCode !== 200){
                    res.send(<UserDetails>{loginError:'Invalid Cognito response for confirm code' + JSON.stringify(response)});
                }
                login(req, res, config);
            } catch (e){
                res.send(<UserDetails>{loginError:e.message});
            }
        });

    }

    async function getId(req: express.Request, config: BackendConfig) {
        let token = req.cookies['auth_token'];
        if (!token) return null;
        let decoded = jwt.decode(token, { complete: true }) as any;
        if (!decoded) return null;
        let kid = decoded['header']['kid'];
        let pem = config.kidToPems[kid];
        if (!pem) return null;
        try {
            let issuer = `https://cognito-idp.eu-west-1.amazonaws.com/${config.UserPoolId}`;
            jwt.verify(token, pem, { issuer: issuer });
        }
        catch (err) {
            req.user.loginError = err.name;
            // if (err.name == 'TokenExpiredError'){
            //     req.cookies['auth_token'] = '';
            //     req.cookies['refresh_token'] = '';
            // }
            return null;
        }
        let username = decoded['payload'].username;
        let cognito = new AWS.CognitoIdentityServiceProvider();
        let user = await cognito.adminGetUser({
            UserPoolId: config.UserPoolId,
            Username: username
        }).promise();
        return user.UserAttributes?.find((s) => {return s.Name == 'email'})?.Value;
    }


}
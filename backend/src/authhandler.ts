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

    export function init(config: BackendConfig, app: express.Express) {

        app.use((req: express.Request, res: express.Response, next: any) => {
            req.user = {};
            const userId = getId(req, config);
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
            const userId = getId(req, config);
            res.send({userId: userId} || {});
        });

        app.post('/api/logout', async (req, res) => {
            res.clearCookie('auth_token');
            res.clearCookie('refresh_token');
            res.send(200);
        });
    
        app.post('/api/login', async (req, res) => {
            console.log('Signing in')
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
                    res.status(500);
                    // res.send(<UserDetails>{loginError:'Invalid Cognito response ' + JSON.stringify(authResponse)});
                }
                else {
                    res.cookie('auth_token', authResponse.AuthenticationResult.AccessToken);
                    res.cookie('refresh_token', authResponse.AuthenticationResult.RefreshToken);
                    res.send(<UserDetails>{userId: req.body.username});
                }

            } catch (e){
                res.status(400);
                res.send(<UserDetails>{loginError:e.message});
            }
        });

        app.post('/api/forgotpassword', async (req, res) => {
            let cognito = new AWS.CognitoIdentityServiceProvider();
            try {
                let response = await cognito.adminResetUserPassword({
                    Username: req.body.username,
                    UserPoolId: config.UserPoolId
                }).promise();
                if (response.$response.httpResponse.statusCode !== 200){
                    res.status(500);
                    // res.send(<UserDetails>{loginError:'Invalid Cognito response ' + JSON.stringify(response)});
                }
            } catch (e){
                res.status(400);
                res.send(<UserDetails>{loginError:e.message});
            }
        });

        app.post('/api/signup', async (req, res) => {
            let cognito = new AWS.CognitoIdentityServiceProvider();
            try {
                let username = req.body.username;
                let response = await cognito.adminCreateUser({
                    UserPoolId: config.UserPoolId,
                    Username: username,
                    TemporaryPassword: req.body.password,
                    MessageAction: 'SUPPRESS',
                    UserAttributes: [
                        {
                            Name: 'email', 
                            Value: req.body.username
                        },
                        {
                            Name: 'name', /* required */
                            Value: username
                        }
                    ],
                }).promise();
                // console.log('Signup response', response)
                if (response.$response.httpResponse.statusCode !== 200){
                    res.status(500);
                    res.send(<UserDetails>{loginError:'Invalid Cognito response for create user' + JSON.stringify(response)});
                }
                response = await cognito.adminSetUserPassword({
                    UserPoolId: config.UserPoolId,
                    Username: username,
                    Password: req.body.password,
                    Permanent: true
                }).promise();
                if (response.$response.httpResponse.statusCode !== 200){
                    res.status(500);
                    res.send(<UserDetails>{loginError:'Invalid Cognito response for set user password' + JSON.stringify(response)});
                }
                
            } catch (e){
                console.log('Signup error', e)
                res.status(400);
                res.send(<UserDetails>{loginError:e.message});
            }
        });

    }

    

    

    function getId(req: express.Request, config: BackendConfig) {
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
        return decoded['payload'].username;
    }


}
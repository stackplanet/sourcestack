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
            console.log('Sigining ibn')
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
                    console.error('Invalid Cognito response');
                    res.status(500);
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
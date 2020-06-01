# Configure Cognito to send email via SES

By default, your Cognito User Pool sends account verification and password reset emails directly. This has some limitations:

- Emails are sent from no-reply@verificationemail.com rather than your custom domain
- A maximum of 50 emails can be sent per day: https://docs.aws.amazon.com/cognito/latest/developerguide/limits.html

You can configure your User Pool to send emails from SES, meaning that emails will come from your domain with far higher daily sending limits.

- [Set up a custom domain](//readme-domain.md) if you haven't already.
- In Route 53, add an MX record as per https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-mx-record.html
- Verify your domain in SES: https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-getting-started.html
- Add a new email address `noreply@<your domain>.com`, e.g. `noreply@myamazingapp.com`
- Verify the email address (you can find the verification link in the S3 bucket you created above)
- In the SES console, click on `noreply@<your domain>.com` and then Identity Policies. Add a policy to allow Cognito to use the email address: https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pool-settings-ses-authorization-to-send-email.html
- Edit `app.json` and add your email address ARN to `cognitoEmailArn`

        {
            ...
            "cognitoEmailArn": ""arn:aws:ses:eu-west-1:XXXXXXXXXX:identity/noreply@myamazingapp.com",
            ...
        }

- Run `npm run deploy --env=alpha`. When you go through the forgot password process you should receive an email from your domain.
# Configure Cognito to send email via SES

- [Set up a custom domain](//readme-domain.md) if you haven't already.
- In Route 53, go to Hosted Zones and select your domain. 
  - Click on "Create Record Set" 
  - Name: leave blank
  - Type: `MX - Mail exchange`
  - Value: `10 inbound-smtp.<region>.amazonaws.com`, wnere `region` is the region your app resides in, e.g. `10 inbound-smtp.eu-west-1.amazonaws.com`
- Verify your domain in Simple Email Service (SES): 
  - Open the SES console in your app's region
  - In the left-hand pane, click "Domains"
  - Click "Verify a new domain", enter your domain name and click "Verify This Domain"
  - Click "Use Route 53"
  - Click "Create Record Sets"
- Create a mail delivery rule to deliver incoming email to an S3 bucket
  - Open the SES console in your app's region
  - In the left-hand pane, click "Rule Sets"
  - Click "View Active Rule Set"
  - Click "Create Rule"
  - Add two recipients: `<your domain>` and `.<your domain>`, e.g. `myapp.com` and `.myapp.com`
  - Click "Next Step" 
  - For "Add Action" select "S3"
  - For "S3 bucket" select "Create S3 bucket" and enter a unique bucket name, e.g. `myapp.com-email`
  - Click "Next Step"
  - In "Rule name" enter a unique rule name, e.g. `myapp`
  - Click "Next Step" then "Create Rule"
- Verify an email address:
  - Open the SES console in your app's region
  - In the left-hand pane, click "Email Addresses" 
  - Click "Verify a New Email Address" and add a new email address `noreply@<your domain>`, e.g. `noreply@myapp.com`
  - Verify the email address (you can find the email containing the verification link in the S3 bucket you created above)
- Allow Cognito to use the email address:
  - Open the SES console in your app's region
  - In the left-hand pane, click "Email Addresses" 
  - Expand "Identity Policies"
  - Take a copy of the ARN next to "Identity ARN"
  - Click "Create Policy"
  - Click "Custom Policy" and enter the following:
```
{
    "Version": "2008-10-17",
    "Statement": [
        {
            "Sid": "stmnt1234567891234",
            "Effect": "Allow",
            "Principal": {
                "Service": "cognito-idp.amazonaws.com"
            },
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail"
            ],
            "Resource": "<your SES identity ARN>"
        }
    ]
}
```
- Click "Apply policy"
- Edit `app.json` and add your email address ARN to `cognitoEmailArn`

        {
            ...
            "cognitoEmailArn": ""arn:aws:ses:eu-west-1:XXXXXXXXXX:identity/noreply@myapp.com",
            ...
        }

- Run `npm run deploy --env=dev`. When you go through the forgot password process you should receive an email from your domain.
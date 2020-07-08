# Use a custom domain

Here's how to create a custom domain and associate it with your app:

- Register a domain via the Route 53 console, e.g. myapp.com
- Create a certificate in the Certificate Manager console, **in region us-east-1** (the certificate must be in this region for CloudFront to be able to use it)
  - Click "Request a certificate"
  - Choose "Request a public certificate" 
  - In "Add domain names" enter your domain name, e.g. `myapp.com`
  - Click "Add another name to this certificate" and add `*.<your domain name>`, e.g. `*.myapp.com`
  - Choose "DNS Validation"
  - Accept the rest of the defaults and click "Confirm and request"
  - On the "Validation" page, expand both entries and click "Create record in Route 53"
- Wait for the certificate to be validated, as indicated in the Certificate Manager console. **Note that this can take several hours**.
- Open the `app.json` file and add your domain name and certificate ARN, for example:

        {
            ...
            "domain": "myapp.com",
            "certificateArn": "arn:aws:acm:us-east-1:XXXXXXXX:certificate/a7664ab3-be5c-4e2c-967d-330cd7d83cca",
            ...
        }

- Test environments will now be deployed to subdomains, e.g. `npm run deploy --env=dev` deploys your app to `https://dev.myapp.com`
- Production will be deployed to the apex domain, e.g. `npm run deploy --env=production` deploys your app to `https://myapp.com`
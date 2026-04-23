Steps to obtain access tokens for Sub-account to make api calls to upsert data to GoHighLevel CRM

- Go to: https://marketplace.gohighlevel.com/login
- Sign in using email: info@web2autos.com (App developer account)
- Once signed in, access: https://marketplace.gohighlevel.com/app-settings/68999b4e7091972603e3fd96/version/68999b4e7091972603e3fd96/advanced/auth
- Open a new browser tab and go to: https://marketplace.gohighlevel.com/v2/oauth/chooselocation?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Foauth&client_id=68999b4e7091972603e3fd96-me6srmeg&scope=contacts.write+objects%2Frecord.readonly+objects%2Fschema.readonly+locations%2FcustomFields.readonly&version_id=68999b4e7091972603e3fd96
- If asked for sign in after redirection, use email: web2autos@gmail.com (Agency account)
- Once app installed, copy authorization code from browser url
- Go to: https://marketplace.gohighlevel.com/docs/Authorization/TargetUserAgency
- Fill in required fields and make request to obtain agency access token
- Then go to: https://marketplace.gohighlevel.com/docs/ghl/oauth/get-location-access-token
- Again, fill in required fields in combination with agency access token to make request to obtain Location access token.

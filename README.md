# Getting Start

## Clone the Repository

First, clone the repository to your local machine using Git:
git clone https://github.com/nimblechapps/Social-Login.git

## Install Dependencies

Navigate to code repository:
cd Social-Login

Use npm to install the project's dependencies:
npm install

## Configure Environment Variables

### Replace the following placeholders with your actual credentials

REACT_APP_GOOGLE_APP_ID = your_google_app_id
REACT_APP_GOOGLE_APP_SECRET = your_google_app_secret

REACT_APP_MICROSOFT_APP_ID = your_microsoft_app_id
REACT_APP_MICROSOFT_APP_SECRET = your_microsoft_app_secret

REACT_APP_FACEBOOK_APP_ID = your_facebook_app_id
REACT_APP_FACEBOOK_APP_SECRET = your_facebook_app_secret

REACT_APP_INSTAGRAM_APP_ID = your_instagram_app_id
REACT_APP_INSTAGRAM_APP_SECRET = your_instagram_app_secret

REACT_APP_GITHUB_APP_ID = your_github_app_id
REACT_APP_GITHUB_APP_SECRET = your_github_app_secret

To use this project, you need to set up the required Client ID and Client Secret for various social media platforms. Follow the steps below to obtain the credentials:

### Google

1. Go to the [Google Developers Console](https://console.developers.google.com/).
2. Create a new project.
3. Navigate to "Credentials" under "APIs & Services."
4. Create credentials and select "OAuth client ID."
5. Configure the OAuth consent screen and provide information about your app.
6. After creating the OAuth client ID, you can find the Client ID and Client Secret in the credentials details.

### Microsoft

1. Go to the [Microsoft Application Registration Portal](https://portal.azure.com/).
2. Sign in with your Microsoft account.
3. In the Azure portal, click on "Create a resource" in the left-hand menu.
4. Search for "App registrations" and select it.
5. Create a new application registration and provide a name for your app.
6. Configure the redirect URI, permissions, and other settings for your app.
7. After registering the app, you can find the Application (Client) ID and generate a client secret.

### Facebook

1. Go to the [Facebook for Developers website](https://developers.facebook.com/).
2. Log in with your Facebook account.
3. Create a new app by going to "My Apps" and selecting "Create App."
4. Choose what do you want your app to do and provide a name for your app.
5. Follow the setup instructions to create your app.
6. Once your app is created, you can find the Client ID and Client Secret in the app's settings under "Basic" or "App Secret."

### Instagram

1. Instagram requires you to set up a Facebook App first. Follow the steps to create a Facebook App.
2. After setting up a Facebook App, add Instagram Basic Display from Dashboard.
3. Now, go to the Instagram Basic Display section using sidebar within your Facebook App.
4. Configure Instagram Basic Display and obtain the Client ID and Client Secret.

### GitHub

1. Go to your GitHub account settings [here](https://github.com/settings).
2. Select "Developer settings" in the left sidebar.
3. Click on "OAuth Apps."
4. Create a new OAuth App and fill in the required information.
5. After creating the OAuth App, you can find the Client ID and Client Secret on the app's settings page.

Note that the exact steps and user interfaces may change over time, so it's a good practice to refer to the official documentation of each platform for the most up-to-date instructions on creating and configuring apps and obtaining the required credentials.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

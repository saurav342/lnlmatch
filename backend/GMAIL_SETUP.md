# How to Get Gmail Credentials (Junior Dev Guide)

Think of these credentials (`CLIENT_ID` and `CLIENT_SECRET`) like a special ID card and password that Google gives your app. They let your app say, "Hey Google, I'm the Capify app, and I want to ask this user for permission to send emails."

## Step 1: Create the "ID Card" (Google Cloud Console)

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  **Create a Project**:
    *   Click the project dropdown (top left) > **New Project**.
    *   Name it "Capify Dev" and click **Create**.
3.  **Enable Gmail API**:
    *   In the search bar at the top, type "Gmail API" and select it.
    *   Click **Enable**.
4.  **Configure Consent Screen** (The screen users see when they log in):
    *   Go to **APIs & Services** > **OAuth consent screen**.
    *   Choose **External** (for testing) and click **Create**.
    *   Fill in:
        *   **App Name**: Capify
        *   **User Support Email**: Your email.
        *   **Developer Contact Info**: Your email.
    *   Click **Save and Continue** until you finish.
5.  **Create Credentials**:
    *   Go to **APIs & Services** > **Credentials**.
    *   Click **+ CREATE CREDENTIALS** > **OAuth client ID**.
    *   **Application type**: Web application.
    *   **Name**: Capify Backend.
    *   **Authorized redirect URIs**:
        *   Click **+ ADD URI**.
        *   Paste: `http://localhost:5001/api/auth/google/callback`
        *   *(Note: This must match exactly what is in your code!)*
    *   Click **Create**.

## Step 2: Get the Keys

*   A popup will show your **Client ID** and **Client Secret**.
*   Copy them!

## Step 3: Put them in your App

1.  Go to your `backend` folder.
2.  Look for the file named `.env.example`.
3.  **Rename** it to just `.env` (remove the `.example`).
4.  Open `.env` and paste your keys:

```env
PORT=5001
GMAIL_CLIENT_ID=paste_your_long_client_id_here
GMAIL_CLIENT_SECRET=paste_your_secret_here
GMAIL_REDIRECT_URI=http://localhost:5001/api/auth/google/callback
```

5.  **Restart your backend server** (Ctrl+C to stop, then `npm run dev` again) so it loads the new keys.

## FAQ

### Which email address will send the emails?
The emails will be sent from **whichever Gmail account you log into** when you click the "Connect Gmail" button in the app.

*   The `CLIENT_ID` and `SECRET` just identify your *App* (Capify) to Google.
*   The *User* (you) gives permission to the App to use *your* email address.

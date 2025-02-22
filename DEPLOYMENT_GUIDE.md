# Deployment Guide

This project can be deployed to Netlify. Here are the steps to deploy:

1. Make sure you have a Netlify account at https://app.netlify.com/

2. Prerequisites:
   - Node.js installed on your machine
   - Netlify CLI (optional, for local testing)
   - Git repository initialized and committed

3. Deployment Options:

   ## Option 1: Deploy via Netlify UI (Recommended for beginners)
   1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
   2. Log in to your Netlify account
   3. Click "New site from Git"
   4. Choose your repository
   5. Configure build settings:
      - Build command: `npm run build`
      - Publish directory: `dist`
   6. Click "Deploy site"

   ## Option 2: Deploy via Netlify CLI
   1. Install Netlify CLI:
      ```bash
      npm install -g netlify-cli
      ```
   2. Login to Netlify:
      ```bash
      netlify login
      ```
   3. Initialize Netlify:
      ```bash
      netlify init
      ```
   4. Deploy:
      ```bash
      netlify deploy
      ```

4. Environment Variables:
   - Make sure to set up your Firebase configuration in Netlify:
     1. Go to Site settings > Build & deploy > Environment variables
     2. Add the following variables from your Firebase project:
        - VITE_FIREBASE_API_KEY
        - VITE_FIREBASE_AUTH_DOMAIN
        - VITE_FIREBASE_PROJECT_ID
        - VITE_FIREBASE_STORAGE_BUCKET
        - VITE_FIREBASE_MESSAGING_SENDER_ID
        - VITE_FIREBASE_APP_ID

5. After Deployment:
   - Your site will be live at a *.netlify.app domain
   - You can set up a custom domain in the Netlify settings
   - Netlify automatically handles HTTPS certificates
   - Your serverless functions in the /netlify/functions directory will be deployed automatically

Notes:
- The project is configured with Vite, and the build output will be in the `dist` directory
- Netlify Functions are already configured in netlify.toml
- Firebase configuration is properly set up for the project
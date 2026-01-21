<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Vq4VYYALKsegjW2SVpbU_m8WyhXAEPlg

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`





## INSTRCTION

To deploy this application to an Ubuntu VPS, we need to containerize it using Docker and serve it with Nginx. I will add the necessary configuration files (package.json, vite.config.ts, Dockerfile, etc.) and provide the deployment commands.
Here are the changes to prepare the codebase for production deployment.
1. Build Configuration & Dependencies
I am creating the standard configuration files required to bundle the React app and Tailwind CSS for production.
package.json
check_circle
vite.config.ts
check_circle
tsconfig.json
check_circle
tsconfig.node.json
check_circle
tailwind.config.js
check_circle
postcss.config.js
check_circle
index.css
check_circle
index.tsx
check_circle
index.html
check_circle
Dockerfile
error
error
An internal error occurred.
nginx.conf
check_circle
docker-compose.yml
check_circle
2. Ubuntu VPS Deployment Instructions
Here is the step-by-step procedure to deploy the SecureDocs Chat application on a fresh Ubuntu 20.04/22.04 VPS.
Step 1: Connect to your VPS
SSH into your server:
code
Bash
ssh user@your-server-ip
Step 2: Install Docker and Git
Update the package index and install Docker and Docker Compose.
code
Bash
# Update repositories
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io git

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Install Docker Compose
sudo apt install -y docker-compose
Step 3: Clone/Upload Your Code
You can clone your repository from GitHub or upload the files directly. Assuming you create a directory called securedocs:
code
Bash
mkdir securedocs
cd securedocs
(Copy all the application files provided above into this directory)
Step 4: Configure Environment Variables
Create a .env file to store your Gemini API Key. This is required for the build process.
code
Bash
nano .env
Paste the following content (replace YOUR_GEMINI_API_KEY with your actual key):
code
Env
API_KEY=YOUR_GEMINI_API_KEY
Save and exit (Ctrl+O, Enter, Ctrl+X).
Step 5: Build and Deploy
Run Docker Compose to build the application image and start the Nginx container.
code
Bash
# Build and start in detached mode
sudo docker-compose up -d --build
Step 6: Verify Deployment
Check if the container is running:
code
Bash
sudo docker ps
Open your browser and navigate to http://your-server-ip.
(Optional) Step 7: Secure with SSL (Certbot)

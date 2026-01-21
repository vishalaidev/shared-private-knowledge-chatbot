<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://chatgpt.com/s/m_69708b3eac0c8191876eb8f3203456d0" />
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





SecureDocs Chat — Production Deployment (Docker + Nginx)

SecureDocs Chat is a React + Vite + Tailwind application deployed on an Ubuntu VPS using Docker.
In production, the app is built into static files and served by Nginx.

==================================================
TECH STACK
==================================================
- React + TypeScript
- Vite
- Tailwind CSS
- Docker (multi-stage build)
- Nginx (static hosting)

==================================================
PROJECT STRUCTURE (EXPECTED)
==================================================
securedocs/
 ├─ src/
 ├─ public/
 ├─ index.html
 ├─ package.json
 ├─ vite.config.ts
 ├─ tsconfig.json
 ├─ tsconfig.node.json
 ├─ tailwind.config.js
 ├─ postcss.config.js
 ├─ docker-compose.yml
 ├─ nginx.conf
 ├─ Dockerfile
 └─ .env   (server only, not committed)

==================================================
PREREQUISITES
==================================================
- Ubuntu VPS (20.04 / 22.04)
- Docker & Docker Compose
- Open ports:
  - 80 (HTTP)
  - 443 (HTTPS – optional)

==================================================
DEPLOYMENT STEPS
==================================================
1. SSH into VPS
ssh user@your-server-ip

2. Install Docker & Git
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose git
sudo systemctl enable docker
sudo systemctl start docker

3. Clone or upload code
git clone <YOUR_REPO_URL> securedocs
cd securedocs

4. Create environment file
nano .env
API_KEY=YOUR_GEMINI_API_KEY

5. Build & deploy
docker-compose up -d --build

6. Verify
docker ps
Open http://your-server-ip in browser

==================================================
USEFUL COMMANDS
==================================================
docker-compose logs -f
docker-compose restart
docker-compose down
docker-compose up -d --build

==================================================
NGINX SPA ROUTING
==================================================
Ensure nginx.conf includes:
try_files $uri $uri/ /index.html;

==================================================
SSL (OPTIONAL)
==================================================
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com

==================================================
END
==================================================

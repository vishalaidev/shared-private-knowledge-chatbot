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
 Production Deployment (Docker + Nginx)

Chat is a React + Vite + Tailwind application deployed on an Ubuntu VPS using Docker.
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
1. CONNECT TO VPS
==================================================
ssh user@your-server-ip

==================================================
2. INSTALL DOCKER & GIT
==================================================
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose git
sudo systemctl enable docker
sudo systemctl start docker

(Optional: run docker without sudo)
sudo usermod -aG docker $USER
newgrp docker

==================================================
3. UPLOAD / CLONE PROJECT
==================================================
Option A: Clone repository
git clone <YOUR_REPO_URL> securedocs
cd securedocs

Option B: Manual upload
mkdir securedocs
cd securedocs
(copy all project files here)

==================================================
4. ENVIRONMENT VARIABLES
==================================================
Create .env file:
nano .env

Add:
API_KEY=YOUR_GEMINI_API_KEY

Save & exit (Ctrl+O, Enter, Ctrl+X)

NOTE:
If using Vite, env variables usually must start with:
VITE_API_KEY=YOUR_GEMINI_API_KEY

==================================================
5. BUILD & DEPLOY
==================================================
docker-compose up -d --build

Verify:
docker ps

Open browser:
http://your-server-ip

==================================================
6. USEFUL COMMANDS
==================================================
View logs:
docker-compose logs -f

Restart:
docker-compose restart

Stop:
docker-compose down

Rebuild clean:
docker-compose down
docker-compose up -d --build

==================================================
7. NGINX SPA ROUTING
==================================================
Ensure nginx.conf contains:
try_files $uri $uri/ /index.html;

This prevents 404 on page refresh.

==================================================
8. SSL (OPTIONAL – RECOMMENDED)
==================================================
Install Certbot:
sudo apt install -y certbot python3-certbot-nginx

Generate SSL:
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

Test auto-renew:
sudo certbot renew --dry-run

==================================================
TROUBLESHOOTING
==================================================

Port 80 already in use:
sudo lsof -i :80
sudo systemctl stop apache2
sudo systemctl disable apache2

Firewall issue:
sudo ufw status
sudo ufw allow 80/tcp

Env changes not applied:
docker-compose up -d --build

==================================================
PRODUCTION BEST PRACTICES
==================================================
- Do NOT commit .env
- Always use HTTPS in production
- Clean unused docker images:
docker system prune -af

==================================================
END
==================================================

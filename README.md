# 🕸️ Web Scraper + Flask Server (Multi-Stage Docker App)

This project demonstrates a multi-stage Docker setup using **Node.js with Puppeteer and Chromium** to scrape a webpage, and **Python Flask** to serve the scraped content via HTTP. It is designed for clean separation of concerns and minimal runtime overhead.

---

## ✅ Overview

- **Stage 1 (Scraper)**: Node.js script uses Puppeteer to scrape a user-provided URL. It extracts the `<title>` and first `<h1>` and stores them in `scraped_data.json`.
- **Stage 2 (Server)**: A Python Flask app reads `scraped_data.json` and serves it at `/` as JSON.
- **Multi-Stage Docker**: Keeps the final container image lightweight by excluding build tools and Puppeteer dependencies.

---

## 📦 Tech Stack

- Node.js 18-slim
- Puppeteer with Chromium
- Python 3.10-slim
- Flask
- Docker (multi-stage builds)
- Deployed on AWS EC2 (Ubuntu)

---

## 📁 Project Structure

web-scraper-server/ ├── scrape.js # Node.js scraper script ├── package.json # Node.js dependencies ├── server.py # Flask server script ├── requirements.txt # Python dependencies ├── Dockerfile # Multi-stage build definition
---

## 🚀 Setup Instructions

### 🖥️ 1. EC2 Setup (Ubuntu)

```
# Update system and install Docker
sudo apt update
sudo apt install -y docker.io

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to the docker group
sudo usermod -aG docker $USER
```

📁 2. Project Setup
---
```
mkdir ~/web-scraper-server
cd ~/web-scraper-server
```
---
# Create all project files listed above (scrape.js, server.py, etc.)
🛠️ 3. Build Docker Image
docker build --build-arg SCRAPE_URL=https://en.wikipedia.org -t scraper-server .


### 4. Run the Container
```bash
docker run -p 5000:5000 scraper-server
```

Access: `http://<EC2-PUBLIC-IP>:5000`
http://3.110.209.166:5000/
---
![Screenshot 2025-04-22 034845](https://github.com/user-attachments/assets/d3c99ebb-2d6c-4199-990b-981258ca12da)


## 📱 Example Output
```json
{
  "heading": "Web scraping",
  "title": "Web scraping - Wikipedia"
}
```
---

## 📅 GitHub Push

### Git Commands
```bash
git init
git remote add origin git@github.com:sultanashah/scraper-server.git
git add .
git commit -m "Initial commit"
git push -u origin master
```

## 🚀 Result

- ✅ Dynamic scraper + server in one Docker image
- ✅ Lightweight container with only runtime dependencies
- ✅ Hosted on EC2, pushed to GitHub
---
Made by [@sultanashah](https://github.com/sultanashah)



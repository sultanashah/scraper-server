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

▶️ 4. Run the Container
```
---
docker run -d -p 5000:5000 scraper-server
```
---
Then open in browser:
📡 http://<EC2-PUBLIC-IP>:5000/

Example output:
{
  "title": "Web scraping - Wikipedia",
  "heading": "Web scraping"
}

✉️ Submission Info
Completed on: EC2 Ubuntu instance
Dockerized multi-stage application
Fully tested output with Wikipedia page
Ready for immediate deployment




































































































































































































===============================
![Screenshot 2025-04-22 034845](https://github.com/user-attachments/assets/092a7256-ae66-43ef-8d81-f7b707f51040)# 🕸️ Web Scraper + Flask Server (Multi-Stage Docker App)

This project demonstrates the power of using **Node.js with Puppeteer and Chromium** to scrape data from any webpage, and **Python with Flask** to host that data via a minimal Docker container using a multi-stage build.
---

## 🔧 What This Project Does

- 🚀 Scrapes data from any webpage using Puppeteer (Node.js).
- 💻 Serves the scraped JSON data using Flask (Python).
- 📂 Uses a multi-stage Dockerfile to keep the final image slim.
- 🚮 Fully containerized and deployed on an AWS EC2 Ubuntu instance.

---

## 🗂️ Project Structure

```
web-scraper-server/
├── Dockerfile
├── scrape.js
├── server.py
├── package.json
├── requirements.txt
└── README.md
```

---

## 🌐 Prerequisites (on EC2 Ubuntu)

```bash
sudo apt update
sudo apt install git docker.io -y
sudo systemctl start docker
sudo usermod -aG docker $USER
newgrp docker
```

Clone your GitHub repo or create project folder:
```bash
mkdir web-scraper-server && cd web-scraper-server
```

---

## 📃 Files Overview

### scrape.js (Node.js Puppeteer Script)
```js
const fs = require("fs");
const puppeteer = require("puppeteer");
const url = process.env.SCRAPE_URL;

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url);

  const data = await page.evaluate(() => ({
    title: document.title,
    heading: document.querySelector("h1")?.innerText || "No H1 found"
  }));

  fs.writeFileSync("scraped_data.json", JSON.stringify(data, null, 2));
  await browser.close();
})();
```

### package.json
```json
{
  "name": "web-scraper",
  "version": "1.0.0",
  "dependencies": {
    "puppeteer": "^21.11.0"
  }
}
```

### server.py (Flask App)
```python
from flask import Flask, jsonify
import json

app = Flask(__name__)

@app.route('/')
def serve_data():
    with open('scraped_data.json') as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

### requirements.txt
```
flask
```

---

## 📁 Dockerfile (Multi-Stage Build)
```dockerfile
# Stage 1: Node Scraper
FROM node:18-slim AS scraper

ARG SCRAPE_URL
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN apt update && apt install -y chromium fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 \
    libcups2 libdbus-1-3 libgdk-pixbuf2.0-0 libnspr4 libnss3 libx11-xcb1 libxcomposite1 \
    libxdamage1 libxrandr2 xdg-utils && apt clean

ENV CHROMIUM_PATH=/usr/bin/chromium

WORKDIR /app
COPY package.json scrape.js ./
RUN npm install
RUN node scrape.js

# Stage 2: Flask Server
FROM python:3.10-slim

WORKDIR /app
COPY --from=scraper /app/scraped_data.json ./
COPY server.py requirements.txt ./
RUN pip install -r requirements.txt

EXPOSE 5000
CMD ["python", "server.py"]
```

---

## 📆 Build and Run

### 1. Build the Docker Image
```bash
docker build --build-arg SCRAPE_URL=https://en.wikipedia.org/wiki/Web_scraping -t scraper-server .
```

### 2. Run the Container
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

## 👤 Author
Made by [@sultanashah](https://github.com/sultanashah)


Happy Scraping! 🧰


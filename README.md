# 🕸️ Web Scraper + Flask Server (Multi-Stage Docker App)

This project demonstrates the power of using **Node.js with Puppeteer and Chromium** to scrape data from any webpage, and **Python with Flask** to host that data via a minimal Docker container using a multi-stage build.

---

## 🔧 What This Project Does

- 🚀 Scrapes data (title and first <h1>) from any webpage using Puppeteer (Node.js).
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

---

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


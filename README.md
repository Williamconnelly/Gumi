# Gumi

![Gumi Homepage](/public/assets/read-me/home-screenshot.png)

Gumi is a web-based interface for the [AniList API](https://anilist.co/) with an emphasis on Anime production and staffing details.

It uses your favorite staff picks from AniList to visualize a configurable feed of anime and staff credits. It’s a great tool for exploring recent production announcements and hidden gems through the lens of your favorite directors, animators, producers, and more.

## 🚀 Features

- Search AniList Users
- View a staff-specific feed of anime production details

![Gumi Search](/public/assets/read-me/search-screenshot.png)

- Search and filter the feed through a number of controls
- Remove unwanted media with the toggleable Ignore feature.

![Gumi Production Feed](/public/assets/read-me/production-feed-screenshot.png)

## 📦 Getting Started

### Requirements

- Node.js (v18+ recommended)
- Angular CLI (v19+)

✅ _If you already have Node.js and Angular installed - you can skip to step 3._

### 1. Install Node.js

First, you’ll need [Node.js](https://nodejs.org/en) installed on your machine.

- Recommended version: Node.js 18+

- To check if Node is installed, run:

```bash
node -v
```

If you don’t have it, download and run the installer.

### 2. Install Angular CLI

Once Node is installed, install the Angular CLI globally:

```bash
npm install -g @angular/cli
```

You can verify the installation with:

```bash
ng version
```

### Download Gumi

#### **Option 1:**

- Click the green "Code" button

- Choose "Download ZIP"

- Then unzip it, open a terminal in that folder, and follow the install steps in step 4.

#### **Option 2: Clone this Repository**

If you have git installed or want to install [git](https://git-scm.com/downloads)

```bash
git clone https://github.com/Williamconnelly/Gumi
cd gumi
```

### 4. Install Dependencies

Run this to install the necessary files

```bash
npm install
```

### 5. Serve the Application Locally

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`.

✅ You're good to go!

## 📝 Notes

The AniList API, while bountiful, imposes rather steep rate-limitations which restrict Gumi from fetching larger sets of data at one time. It's possible you may encounter an error when fetching *particularly large* lists of media and will have to wait out the timer to complete the task.

## ⚙️ Technical Details

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.3.

Data is sourced from the [AniList GraphQL API](https://docs.anilist.co/)

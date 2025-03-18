# Coding Task Project

## Project Overview

This project consists of three main components:

- **Backend**: Handles API requests and database management.
- **Contest Worker**: Periodically fetches contests and assigns them to relevant videos.
- **Frontend**: Provides the user interface.

## Setup Instructions

### 1. Backend

1. Navigate to the backend directory:

   ```sh
   cd backend
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Create a `.env` file and copy the contents from `.env.example`:

   ```sh
   cp .env.example .env
   ```

4. Run the development server:

   ```sh
   pnpm run dev
   ```

   **Note:** The first run might fail as it attempts to set up Docker. If it fails, try running the command again.

### 2. Contest Worker

1. Navigate to the contest worker directory:

   ```sh
   cd contestWorker
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Create a `.env` file and copy the contents from `.env.example`:

   ```sh
   cp .env.example .env
   ```

4. Start the worker:

   ```sh
   pnpm run dev
   ```

   > [!NOTE]
   > Keep this running to ensure contest data is continuously saved
   > to the database.
   > This worker keeps running to save contests to the database.
   > An event listener runs every 2 minutes to fetch the latest video uploads on
   > the platform and assign relevant contests.
   > Currently, it fetches videos from the last 30 days, but ideally, it should
   > fetch only videos uploaded in the last 2 minutes.

### 3. Frontend

1. Navigate to the frontend directory:

   ```sh
   cd frontend
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Run the development server:

   ```sh
   pnpm run dev
   ```

   **Routes:**

   - The user platform is available at `/`.
   - The `/upload` route is for manually uploading solutions.

## Features

- Fetch and display past, ongoing, and upcoming coding contests.
- Bookmark contests for future reference.
- Automatically update contest data via the contest worker.
- Built using **TypeScript, React, Node.js, PostgreSQL**, and **Docker**.
- Fetches past, upcoming, and featured contests.
- Assigns contests to newly uploaded videos.
- Efficient database and caching mechanisms.
- Mobile and tablet responsive UI.
- Light and dark mode with a toggle option.
- Automated fetching of solution links from YouTube.
- Well-documented code.

## Assignment Details

### Requirements Implemented

- Fetching upcoming contests from Codeforces, CodeChef, and Leetcode.
- Displaying the date and time remaining before the contest starts.
- Displaying past contests with filtering by platform.
- Allowing users to bookmark contests.
- Providing a way to populate and fetch contest solutions from YouTube.
- UI is mobile and tablet responsive.
- Light and dark mode toggle.
- Automated fetching of YouTube solution links.
- Well-documented and structured codebase.

## Demo

To see the demo, visit the Google Drive link:
[Demo Link](https://drive.google.com/drive/folders/1J8_h0RqX57NdOf7eSKG_mrpIAfEDU4-R?usp=sharing)

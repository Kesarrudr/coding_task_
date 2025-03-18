# Coding Task Project

This project is designed to manage and track coding contests from various platforms. It consists of three main parts:

- **Backend** (Handles API and database operations)
- **Contest Worker** (Fetches contest data and saves it to the database)
- **Frontend** (User interface for viewing and interacting with contests)

## Repository

GitHub Repository: [Coding Task](https://github.com/Kesarrudr/coding_task_)

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

3. Start the worker:

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

## Features

- Fetch and display past, ongoing, and upcoming coding contests.
- Bookmark contests for future reference.
- Automatically update contest data via the contest worker.
- Built using **TypeScript, React, Node.js, PostgreSQL**, and **Docker**.

## Demo

To see the demo, visit the Google Drive link:
[Demo Link](https://drive.google.com/drive/folders/1J8_h0RqX57NdOf7eSKG_mrpIAfEDU4-R?usp=sharing)

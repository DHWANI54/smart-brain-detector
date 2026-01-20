# Smart Brain Detector

A full-stack web application that detects faces in images using AI. It features a React frontend with real-time face detection (via `face-api.js`) and a Node.js/Express backend with a local SQLite database to track user user entry counts.

## 🚀 Features

*   **Face Detection**: Detects human faces in images using local AI models (no external API keys required).
*   **Dual Input**: Supports both Image URLs and direct File Uploads.
*   **Authentication**: Complete Register and Sign In system.
*   **Persistent Data**: Uses a local SQLite database (`database.db`) to store users and entry counts.
*   **Responsive Design**: Modern UI built with Tachyons and CSS3.

---

## 🛠️ Prerequisites

*   **Node.js** (v18 or higher recommended)
*   **npm** (comes with Node.js)

---

## 🏁 How to Run

You need to run the Backend and Frontend in separate terminal windows.

### 1. Start the Backend

The backend handles authentication and updates user entry counts.

```bash
cd backend

# Install dependencies
npm install

# Start the server
npm start
```
*   The server will run on `http://localhost:3000`.
*   It will automatically create a local `database.db` file if one doesn't exist.

### 2. Start the Frontend

The frontend is the user interface built with React + Vite.

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
*   Open the link shown in the terminal (usually `http://localhost:5173`).

---

## 🔑 Demo Credentials

To test the application immediately without registering, use the following account (automatically created on server start):

*   **Email:** `demo@gmail.com`
*   **Password:** `demo`

---

## 🧪 How to Use

1.  **Sign In** using the demo credentials above (or Register a new account).
2.  **Detect a Face**:
    *   **Option A (URL)**: Paste a direct link to an image (e.g., from Google Images) into the text box and click "Detect".
    *   **Option B (Upload)**: Click the **"Upload Image"** button and select a file from your computer.
3.  **Result**: 
    *   A **Blue Box** will appear around any detected human face.
    *   The status text will say "Face Detected!".
    *   Your "entries" count at the top will increment.
    *   *Note: If you upload a picture of a pet or object, it will say "No Human Face Detected".*

---

## 📂 Project Structure

*   **/backend**: Node.js/Express API & SQLite database logic.
*   **/frontend**: React application with `face-api.js` integration.
    *   `/public/models`: Local AI models for face detection.
    *   `/src/components`: React components (FaceRecognition, Logo, etc.).

## 🔧 Troubleshooting

*   **Port In Use**: If `npm start` fails in the backend saying port 3000 is busy, ensure no other process is using it.
*   **Face Detection Error**: If faces aren't loading, ensure the frontend `npm run dev` terminal shows no errors and that the models exist in `frontend/public/models`.

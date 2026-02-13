
# 🌦️ Weather Forecast

## Overview

**SkyCast** is a modern, responsive, and feature-rich weather dashboard built to provide users with actionable weather insights. Unlike standard weather apps that just display numbers, SkyCast focuses on **utility**—helping users plan their day with lifestyle scores, hourly trends, and intelligent daily briefings.

Built with **React, TypeScript, and Tailwind CSS**, this project demonstrates a commitment to clean code architecture, type safety, and a premium user experience (UX).

## ✨ Key Features

* **Real-Time Weather:** Instant access to current temperature, wind, humidity, visibility, and UV index.
* **Dynamic Theming:** The interface automatically adapts its color palette and gradients based on the time of day (Day/Night) and weather conditions.
* **Interactive 24-Hour Chart:** Visualizes temperature trends using `Recharts` for easy scanning.
* **Upto 13-Days of Forecast:** Detailed daily cards with high/lows and weather icons.
* **Lifestyle Hub:** A unique "suitability index" for activities like Running, Driving, Picnics, and Hiking based on live weather metrics.
* **Daily Briefing:** A summarized view of the day's high/lows, sunrise/sunset times, and moon phases.
* **Interactive Map:** Visual location picker to explore weather in different areas.

## 🛠️ Tech Stack

### **Frontend**

* **Framework:** React (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Components:** Shadcn/UI (Radix Primitives)
* **Icons:** Lucide React
* **Charts:** Recharts
* **State Management:** React Hooks (`useState`, `useEffect`)
* **HTTP Client:** Axios

### **Backend (Server)**

* **Runtime:** Node.js
* **Framework:** Express.js
* **Role:** Acts as a secure proxy to handle API requests, manage CORS, and protect API keys from exposure in the client-side build.

## 📂 Project Structure

```bash
Weather_App_TypeScript/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/         # Reusable UI components (Card, Button, Slider)
│   │   │   ├── weather/    # Feature-specific components (CurrentWeather, Forecast, etc.)
│   │   ├── lib/            # Utilities (weatherFormatter, themeHelpers)
│   │   ├── services/       # API integration (weatherService.ts)
│   │   ├── types/          # TypeScript interfaces (WeatherResponse, ForecastDay)
│   │   ├── App.tsx         # Main application logic
│   │   └── main.tsx        # Entry point
│   ├── .env                # Frontend environment variables
│   └── package.json
│
├── server/                 # Backend Node.js Application
│   ├── index.js            # Express server entry point
│   ├── routes/             # API routes (weather.js)
│   ├── .env                # Backend environment variables
│   └── package.json
│
└── README.md

```

## Getting Started

Follow these steps to set up the project locally.

### **Prerequisites**

* Node.js (v16 or higher)
* npm or yarn

### **1. Clone the Repository**

```bash
git clone https://github.com/karthik-provus/Weather_App_TypeScript.git
cd Weather_App_TypeScript

```

### **2. Setup the Server (Backend)**

Navigate to the server folder and install dependencies:

```bash
cd server
npm install

```

Create a `.env` file in the `server` directory and add your WeatherAPI key:

```env
WEATHER_API_KEY=your_actual_api_key_here
PORT=5000

```

Start the server:

```bash
npm start

```

*The server should now be running on `http://localhost:5000*`

### **3. Setup the Client (Frontend)**

Open a new terminal, navigate to the client folder, and install dependencies:

```bash
cd client
npm install

```

Create a `.env` file in the `client` directory to point to your local server (or direct API if testing):

```env
VITE_API_URL=http://localhost:5000

```

Start the frontend:

```bash
npm run dev

```

*Open your browser and visit `http://localhost:5173*`

## Evaluation Highlights

* **Type Safety:** Strict TypeScript interfaces (e.g., `WeatherResponse`, `HourData`) are used throughout to prevent runtime errors and ensure code reliability.
* **Component Modularity:** The UI is broken down into small, reusable components (`CurrentWeather`, `Forecast`, `HourlyTemperature`) making the codebase easy to maintain and scale.
* **Error Handling:** Robust error states for failed API calls, geolocation denials, and missing data.
* **UX Considerations:** Includes loading skeletons, smooth transitions, and intuitive data visualization.

## 🔮 Future Roadmap

* **Comparison Mode:** A side-by-side view to compare weather between two cities (In Progress).
* **AI Insights:** Integration with Gemini API to provide witty, AI-generated weather summaries (In Progress).


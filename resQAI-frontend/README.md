# resQAI: AI-Powered Disaster Response Dashboard

### An interactive, real-time dashboard for managing emergency incidents and resources with the power of AI.

-----

## 🚀 Key Features

  * **Interactive Geospatial Map:** Visualize real-time incidents and the location of available resources on a dynamic map.
  * **Real-time Alert & Event Feed:** A live feed of new incidents, dispatches, and other critical events.
  * **Resource Management Panel:** Dispatch and recall emergency units to and from incidents.
  * **Key Metrics Display:** Monitor crucial performance indicators such as total incidents, average response time, and resource utilization.
  * **AI Recommendations:** Receive intelligent suggestions for managing an incident, such as recommended units and response strategies.

-----

## 🛠️ Technology Stack

This project is built using a modern **MERN** stack variation, with a frontend focused on React and a backend built with Node.js and MongoDB.

### Frontend

  * **React:** A JavaScript library for building user interfaces.
  * **Vite:** A fast build tool for modern web development.
  * **Tailwind CSS:** A utility-first CSS framework for rapid styling.
  * **React-Leaflet:** A library to create interactive maps.
  * **React Router:** For handling client-side routing.
  * **Axios:** A promise-based HTTP client for making API requests.

### Backend

  * **Node.js & Express:** The runtime environment and framework for the API server.
  * **MongoDB & Mongoose:** A NoSQL database and an object data modeling library for data storage.
  * **CORS & Dotenv:** Middleware for handling cross-origin requests and environment variables.

-----

## 📦 Project Structure

### Frontend (`resqai/`)

```
resQAI/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── alerts/
│   │   ├── common/
│   │   ├── geospatial/
│   │   ├── metrics/
│   │   └── resources/
│   ├── pages/
│   │   └── Dashboard.jsx
│   ├── services/
│   │   └── api.js
│   ├── context/
│   ├── hooks/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
└── package.json
```

### Backend (`resqai-backend/`)

```
resqai-backend/
├── config/
│   └── db.js
├── controllers/
│   └── resqaiController.js
├── data/
├── models/
│   ├── event.js
│   ├── incident.js
│   └── resource.js
├── routes/
│   └── resqai.js
├── .env
├── package.json
└── server.js
```

-----

## ⚙️ Installation & Setup

### Frontend Setup

1.  **Create the project:**
    ```bash
    npm create vite@latest resqai -- --template react
    cd resqai
    ```
2.  **Install dependencies:**
    ```bash
    npm install react-router-dom leaflet react-leaflet axios
    ```
3.  **Install and configure Tailwind CSS:**
    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd resqai-backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create `.env` file:**
    Create a file named `.env` in the backend root and add your MongoDB connection string.
    ```
    PORT=5000
    MONGO_URI=<your_mongodb_connection_string>
    ```
4.  **Run the server:**
    ```bash
    npm run dev
    ```

-----

## 📈 Future Enhancements

  * **Automated Resource Suggestion:** Use AI to recommend the best units for dispatch based on the incident type and location.
  * **Predictive Hotspot Analysis:** Analyze historical data to predict where and when future incidents are likely to occur.
  * **Analytics Dashboard:** A dedicated page with data visualizations for key operational metrics.
  * **Historical Incident Playback:** Replay past incidents on the map to review and analyze response effectiveness.
  * **Multi-User Support:** Implement user roles (Dispatcher, Supervisor) and authentication for a professional command center environment.


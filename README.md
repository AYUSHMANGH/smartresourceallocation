# ResilienceNet: Smart Venue Governance & Resource Allocation

ResilienceNet is a modern, high-performance web application designed for intelligent disaster management, volunteer orchestration, and real-time governance. Built for speed and accessibility, the system leverages AI and geographic tracking to streamline crisis response.

## 🚀 Key Features

*   **Intelligent Needs Assessment**: Report crises using an interactive map centered on India. Instantly pull geolocation coordinates via the browser's Geolocation API.
*   **AI-Powered Area Analysis**: Integrated with Groq's Llama-3.3-70b AI model. Generate detailed, on-the-fly disaster preparedness and risk analysis reports for any selected region.
*   **Volunteer Network & Matchmaking**: 
    *   Authentic Google Sign-in integration—real profiles with actual profile images are synced dynamically.
    *   Algorithmically scores volunteers against mission requirements to find the best match.
*   **Real-Time Notifications**: Direct, real-time messaging alerts between admins and volunteers via Firestore. Instant UI updates with notification bells and dropdown histories.
*   **Governance Console**: A central command dashboard for administrators to view global statistics, monitor deployed field workers, and export aggregated analytics directly to Excel (`.xlsx`).
*   **Modern UI/UX**: Crafted with a premium aesthetic using Tailwind CSS. Features glassmorphism navigation, responsive design, and smooth micro-animations.

## 🛠️ Technology Stack

*   **Frontend**: React.js, Vite, Tailwind CSS, React Router
*   **Backend / Database**: Firebase Authentication (Google OAuth), Firebase Firestore (NoSQL Real-time database)
*   **AI Integration**: Groq Cloud API (`llama-3.3-70b-versatile`)
*   **Mapping**: Google Maps API (Geolocation & Geocoding)
*   **Utilities**: `react-hot-toast` (Notifications), `xlsx` (Excel Export)

## ⚙️ Getting Started

### Prerequisites
*   Node.js (v16+)
*   A Firebase Project with Authentication (Google) and Firestore Database enabled.
*   A Groq API Key.
*   A Google Maps Javascript API Key.

### Installation

1.  **Clone the repository**
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Environment Variables**
    Create a `.env` file in the root directory and add:
    ```env
    VITE_FIREBASE_API_KEY="your_api_key"
    VITE_FIREBASE_AUTH_DOMAIN="your_auth_domain"
    VITE_FIREBASE_PROJECT_ID="your_project_id"
    VITE_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
    VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
    VITE_FIREBASE_APP_ID="your_app_id"
    VITE_GROQ_API_KEY="your_groq_api_key"
    ```
4.  **Run the application**
    ```bash
    npm run dev
    ```

## 🔒 Security & Roles
*   **Volunteers**: Auto-assigned upon Google Sign-in. Can view tasks, network, and receive notifications.
*   **Admins**: Pre-configured via `admin@email.com` login. Has exclusive access to the Governance console, global maps, and data exports.

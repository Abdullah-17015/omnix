# Omnix 🌱

**Omnix** is a sustainability scanner that detects electronic devices, identifies key components and suppliers, and rates eco-friendliness using public sources, powered by Google's Gemini and Gemma AI models.

![Flutter](https://img.shields.io/badge/Flutter-3.x-blue)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-orange)
![Vertex AI](https://img.shields.io/badge/Vertex%20AI-Gemini%20%2B%20Gemma-green)

## Features

- **🔍 AI Product Detection** - Identify any tech product from a photo using Gemini Vision
- **🌍 Live Sustainability Research** - Real-time web search and analysis of sourcing data
- **🗺️ Interactive Origin Map** - 3D tilted map showing material origins with animated pins
- **📊 Eco Score** - Comprehensive sustainability score (0-100) with detailed breakdown
- **💬 AI Chatbot** - Ask questions about the product with cited sources
- **🎤 Voice Summary** - Listen to AI-generated voice summary via ElevenLabs
- **✨ Gemma Tips** - Personalized sustainability actions powered by Google Gemma
- **📱 Scan History** - Save and review past scans

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Flutter 3.x |
| Backend | Node.js + TypeScript on Cloud Run |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| AI/ML | Vertex AI (Gemini Pro Vision, Gemini Pro, Gemma) |
| Search | Google Custom Search API |
| Voice | ElevenLabs Text-to-Speech |
| Maps | Google Maps Flutter |

## Project Structure

```
omnix/
├── omnix_app/          # Flutter mobile app
│   └── lib/
│       ├── config/     # Theme, constants
│       ├── models/     # Data models
│       ├── providers/  # Riverpod state management
│       ├── screens/    # UI screens
│       ├── services/   # API & auth services
│       └── widgets/    # Reusable widgets
│
└── backend/            # Cloud Run backend
    └── src/
        ├── routes/     # API endpoint handlers
        ├── services/   # External API integrations
        └── utils/      # Helpers & middleware
```

## Setup Instructions

### Prerequisites

- Flutter 3.x SDK
- Node.js 18+
- Firebase project with Auth & Firestore enabled
- Google Cloud project with Vertex AI API enabled
- Google Custom Search Engine ID
- ElevenLabs API key

### 1. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** with Email/Password and Google Sign-In
3. Enable **Cloud Firestore**
4. Download Firebase config:
   - For Android: `google-services.json` → `omnix_app/android/app/`
   - For iOS: `GoogleService-Info.plist` → `omnix_app/ios/Runner/`
5. Generate service account key for backend: Project Settings → Service Accounts → Generate Key

### 2. Google Cloud Setup

1. Enable APIs in Google Cloud Console:
   - Vertex AI API
   - Custom Search API
2. Create a Custom Search Engine at [programmablesearchengine.google.com](https://programmablesearchengine.google.com)
3. Enable "Search the entire web" option
4. Note your Search Engine ID (cx)

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials:
# - GCP_PROJECT_ID
# - GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON)
# - GOOGLE_CSE_API_KEY
# - GOOGLE_CSE_CX
# - ELEVENLABS_API_KEY
# - ELEVENLABS_VOICE_ID

# Run locally
npm run dev

# Deploy to Cloud Run
gcloud run deploy omnix-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### 4. Flutter App Setup

```bash
cd omnix_app

# Get dependencies
flutter pub get

# Update API base URL in lib/config/constants.dart
# Set to your Cloud Run URL or localhost for development

# Run on device
flutter run
```

### 5. Google Maps Setup

1. Enable Maps SDK for Android/iOS in Google Cloud Console
2. Add API key to:
   - Android: `android/app/src/main/AndroidManifest.xml`
   - iOS: `ios/Runner/AppDelegate.swift`

See [google_maps_flutter documentation](https://pub.dev/packages/google_maps_flutter)

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze-image` | POST | Analyze product image with Gemini Vision |
| `/api/live-research` | POST | Perform live web research on product |
| `/api/eco-score` | POST | Calculate eco score with Gemma tips |
| `/api/chat` | POST | Chat with product context and citations |
| `/api/voice` | POST | Generate voice summary with ElevenLabs |

All endpoints require Firebase ID token in `Authorization: Bearer <token>` header.

## Environment Variables

Create `.env` file in the `backend/` directory:

```env
GCP_PROJECT_ID=your-project-id
GCP_REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
GOOGLE_CSE_API_KEY=your-custom-search-api-key
GOOGLE_CSE_CX=your-search-engine-id
ELEVENLABS_API_KEY=your-elevenlabs-api-key
ELEVENLABS_VOICE_ID=your-voice-id
```

## License

MIT License - See [LICENSE](LICENSE) for details.

---

Built for hackathon demonstration using Flutter, Firebase, Vertex AI, and ElevenLabs.

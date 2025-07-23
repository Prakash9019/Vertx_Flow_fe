# Vertx_Flow_fe

## Overview

Vertx_Flow_fe is a modern React web application designed to help early-stage startups validate ideas, build pitch decks, track investor interactions, and connect with relevant VCs. It combines AI-powered matchmaking, fundraising insights, and learning modules into one unified platform.

## Features

- **Authentication:** Google OAuth login and protected routes.
- **Profile Setup:** Guided onboarding for founders (stage, location, raise, revenue, industry, pitch).
- **Fundraising Management:** Track fundraising rounds, manage targets, and network with investors.
- **AI Mock Pitching:** Real-time video/audio calls with AI investors, speech recognition, and live feedback.
- **Investor Database:** Search and filter investors, listen to sample pitches, and view detailed profiles.
- **Pitch Deck Evaluation:** Upload and analyze pitch decks with AI-generated insights.
- **Email Outbounding:** Generate and send outreach emails to investors.
- **Payment & Subscription:** Razorpay integration for plan selection, payment history, and subscription management.
- **Call Reports:** View detailed analysis and feedback after mock pitching sessions.
- **Notifications:** Permission-based notifications for important events.

## Technologies Used

- **Frontend:** React 19, Vite, TailwindCSS, React Router, React Toastify
- **State Management:** React Context API
- **AI & Audio:** socket.io-client, Web Speech API, custom audio streaming
- **Payments:** Razorpay Checkout, Axios for API calls
- **Other:** Google OAuth, PDF.js, Lucide Icons

## Project Structure

```
Vertx_Flow_fe/
  ├── public/                # Static assets
  ├── src/
  │   ├── assets/            # Images and SVGs
  │   ├── components/        # Reusable React components (Sidebar, MockPitching, etc.)
  │   ├── context/           # Context providers
  │   ├── data/              # Static data (countries.json)
  │   ├── hooks/             # Custom React hooks
  │   ├── screens/           # Main pages (Payment_Page, Matchflow, etc.)
  │   ├── utils/             # Utility functions (api.js)
  │   ├── App.jsx            # Main app component and routing
  │   ├── main.jsx           # App entry point
  │   ├── App.css, index.css # Global styles
  ├── package.json           # Project dependencies and scripts
  ├── vite.config.js         # Vite configuration
  ├── vercel.json            # Vercel deployment config
  ├── key.js                 # API endpoint configuration
  └── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```sh
npm install
```

### Development

```sh
npm run dev
```

### Build

```sh
npm run build
```

### Lint

```sh
npm run lint
```

## Environment Variables

- API endpoints are configured in `key.js`.
- Razorpay test key is used for payment integration.

## Deployment

- Vercel is recommended for deployment (`vercel.json` included).
- Static assets are served from the `public/` directory.

## Usage Notes

- **AI Mock Pitching:** Requires microphone and camera permissions. Uses socket.io to connect to a remote AI server.
- **Payment:** All payment flows use Razorpay; ensure API keys and endpoints are correctly set.
- **Speech Recognition:** Uses Web Speech API; best supported in Chrome, Edge, and Safari.

## Contributing

Pull requests and issues are welcome! Please follow best practices and ensure code is linted before submitting.

## License

This project is private and not licensed for public use.
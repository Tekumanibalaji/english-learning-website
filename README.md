# Boost English App — Full MVP

A full-stack MVP for practicing spoken English with matched conversation partners.

## Features included
- Registration/login API structure
- Email + mobile fields
- Password hashing with bcrypt
- JWT authentication
- Beginner / fluent speaker roles
- Gender and partner-preference fields
- Automatic compatible-partner matching
- Socket.IO signaling for WebRTC
- Browser voice/video call UI
- End-call flow
- 1–5 star ratings + feedback
- Call history
- Report/block endpoints and UI
- English-only community rule UI
- Safety reminders
- Responsive frontend

## Important production setup
Real email OTP/SMS OTP requires a provider such as Firebase/Auth0/Twilio and credentials.
The included app uses a password + JWT flow for the local MVP and keeps OTP provider configuration in environment variables.

For a public launch, also add:
- verified email/mobile
- age/guardian policy and age gating
- moderation and abuse detection
- rate limiting
- HTTPS
- persistent production database
- TURN server for WebRTC reliability
- secure secret storage
- privacy policy / terms / consent
- stronger identity and abuse prevention

## Run backend
cd backend
copy .env.example .env
npm install
npm run dev

## Run frontend
cd frontend
npm install
npm run dev

Open http://localhost:5173

The frontend expects the API at http://localhost:5000.
Set VITE_API_URL and VITE_SOCKET_URL if using another host.

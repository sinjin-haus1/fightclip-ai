# FightClip AI

A full-stack AI-powered application for fight clip analysis and management.

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Material UI, GraphQL
- **Backend:** NestJS, GraphQL, MongoDB (MongoDB Atlas)
- **Database:** MongoDB with Mongoose ODM

## Project Structure

```
fightclip-ai/
├── frontend/          # Next.js 14 frontend application
│   ├── src/
│   │   ├── app/       # Next.js app router pages
│   │   ├── components/# React components
│   │   └── lib/       # Utilities and GraphQL client
│   └── package.json
│
├── backend/           # NestJS API server
│   ├── src/
│   │   ├── modules/   # NestJS modules
│   │   └── main.ts    # Application entry point
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
# Configure MongoDB connection in environment
npm run start:dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=4000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
```

## License

MIT

# Duke Free Food Finder - Frontend

A TypeScript + React frontend that powers Duke Free Food Finder, a website for Duke students to find and give away free food, reducing food insecurity and waste.

## Features

- **Passwordless auth** — Email a 6-digit verification code via [Resend](https://resend.com) restricted to `@duke.edu` addresses.
- **Food postings** — Title, description, location (lat/lon), location details, expiration time, and an image. User can look through a food list or a map. 
- **Forums** — Comment section attached to each food post.


## Tech Stack

- React + React Router 
- Vite for development server and builds
- Tailwind CSS for styling
- React Leaflet for the map
- jwt-decode for reading the auth token
- Deployed on Vercel

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- A running instance of the backend API

### Install

```bash
npm install
```

### Configure

The frontend reads the backend URL from `VITE_API_BASE_URL`. Create a `.env.local` file:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

If unset, it falls back to the deployed backend URL defined in [src/config.js](src/config.js).

### Run

```bash
npm run dev      # starts the dev server
npm run build    # production build to dist/
```

The dev server runs at default `http://localhost:5173`.

## Project Structure

```
src/
  api/client.js        
  auth/               
  components/
    Login.jsx         
    FindFood.jsx       
    FoodList.jsx      
    FoodMap.jsx      
    FoodDetail.jsx     
    PostFood.jsx      
    Account.jsx        
    Nav.jsx         
  config.js            API base URL, Duke coordinates, image URL helper
  foodUtils.js         display helpers 
  leafletSetup.js      
  App.jsx              
  main.jsx            
```

## Deployment

Configured for Vercel. 

Set up `vercel.json`. Set `VITE_API_BASE_URL` as an environment variable in your Vercel project settings.

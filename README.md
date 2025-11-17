  # ProU Employee Task Management

  This is a code bundle for ProU Employee Task Management. The original project is available at https://www.figma.com/design/v4OGySx3bdaLNZRUxGazAC/ProU-Employee-Task-Management.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Environment Setup

  1. Copy `.env.example` to `.env`
  2. Fill in your Supabase credentials in `.env`:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

  Get these values from your Supabase dashboard: https://app.supabase.com/project/_/settings/api

  ## Deployment

  For production deployment, set these environment variables in your hosting platform:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  

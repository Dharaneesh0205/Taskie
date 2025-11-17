# ProU Employee Task Management

This is a code bundle for ProU Employee Task Management.  

## 🌐 Live Demo

Check out the deployed project at: [https://taskie-xi.vercel.app/](https://taskie-xi.vercel.app/)

## 🛠️ Tech Stack Used

- **TypeScript** (Frontend logic and type safety)
- **CSS** (Styling)
- **Supabase** (Database and authentication)
- **Vite** (Build tool)
- **React** (Assumed – if the template uses React for frontend structure)
- **PLpgSQL** (Database functions; via Supabase)
- **JavaScript, HTML, Nix** (Ancillary files/configs)

## 🚀 Setup Steps

1. **Clone this repository:**  
   `git clone https://github.com/Dharaneesh0205/Taskie.git`
2. **Install dependencies:**  
   `npm i`
3. **Environment setup:**  
   - Copy `.env.example` to `.env`.
   - Fill in your Supabase credentials in `.env`:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - Get these values from your Supabase dashboard: https://app.supabase.com/project/_/settings/api
4. **Run the development server:**  
   `npm run dev`
5. **Deployment:**  
   For production, set these environment variables on your hosting platform:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## 🖼️ Screenshots / Demo Recording

Add screenshots or a short screen recording (GIF/video link) showing main features/flow. Some placeholders:

- Task dashboard view  
  ![Dashboard Screenshot](screenshots/dashboard.png)
- Task creation screen  
  ![Create Task Screenshot](screenshots/create-task.png)

*If you have a video/gif, you can embed it like:*  
[![Screen Recording](screenshots/recording_thumb.png)](screenshots/demo.mp4)

## 💡 Assumptions & Bonus Features

- Users are authenticated via Supabase.
- Each user can create, assign, update, and complete tasks.
- Basic role separation exists (Admin vs Employee).
- Responsive UI for desktop and mobile.
- **Bonus:** Real-time task updates using Supabase's subscription.
- **Bonus:** Dark mode support (if implemented).

## 📬 Submission

Project is hosted publicly on GitHub and deployed to Vercel.  
For project access and demo, please refer to:

- GitHub: [https://github.com/Dharaneesh0205/Taskie](https://github.com/Dharaneesh0205/Taskie)
- Website: [https://taskie-xi.vercel.app/](https://taskie-xi.vercel.app/)

---

Feel free to reach out if you need further assistance!

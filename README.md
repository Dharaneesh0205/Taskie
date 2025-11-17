# ProU Employee Task Management ( Taskie )

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
  ![Dashboard Screenshot]<img width="1897" height="962" alt="image" src="https://github.com/user-attachments/assets/465d728c-4998-4454-9204-7ab19b26cc3e" />

- Task creation screen  
  ![Create Task Screenshot]<img width="1917" height="970" alt="image" src="https://github.com/user-attachments/assets/c8a078cd-7c23-4d2c-a3f4-3f9cdc11d4c9" />


- Employee Creation screen
- ![Create Employee Screenshot]<img width="1900" height="974" alt="image" src="https://github.com/user-attachments/assets/5193ae93-d88a-4212-9357-9f51ade970d6" />


## 💡 Assumptions

- Users are authenticated via Supabase.
- Each user can create, assign, update, and complete tasks.
- Basic role separation exists (Admin vs Employee).
- Responsive UI for desktop and mobile.


## 📬 Submission

Project is hosted publicly on GitHub and deployed to Vercel.  
For project access and demo, please refer to:

- GitHub: [https://github.com/Dharaneesh0205/Taskie](https://github.com/Dharaneesh0205/Taskie)
- Website: [https://taskie-xi.vercel.app/](https://taskie-xi.vercel.app/)

---

Feel free to reach out if you need further assistance!

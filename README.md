# 📝 NoteSphere

**NoteSphere** is a smart notes and documentation management system that helps users create, organize, and manage their notes in one place.  
It offers a clean interface with secure login, categorization, and cloud sync.

---

## ⚙️ Tech Stack
- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **Authentication:** JWT & bcrypt  
- **Hosting:** Vercel (Frontend), Render (Backend), MongoDB Atlas (Database)

---

## 🚀 Features
- User login & signup  
- Create, edit, delete notes  
- Search & filter notes  
- Categorize by tags or folders  
- Dark / Light mode  
- Cloud-synced storage  

---

## 🔗 API Routes
- `POST /api/auth/signup` – Register  
- `POST /api/auth/login` – Login  
- `GET /api/notes` – Get all notes  
- `POST /api/notes` – Create note  
- `PUT /api/notes/:id` – Update note  
- `DELETE /api/notes/:id` – Delete note  

---

## 🧰 Setup
```bash
git clone https://github.com/your-username/notesphere.git
cd notesphere
npm install
npm run dev

🏥 MERN Appointment Booking System
Complete step-by-step setup guide — from zero to fully running app on your laptop

MongoDB · Express · React · Node.js
📋 Table of Contents
Install Required Software
Create Project Folder Structure
Set Up the Backend (Node + Express)
Configure MongoDB Database
Run the Backend Server
Seed Sample Data
Set Up the Frontend (React)
Run the Full Application
Test All API Routes
Project Features Summary
1
Install Required Software
Set up your development environment from scratch
1.1 — Install Node.js (includes npm)

Download and install Node.js v18 LTS or v20 LTS from nodejs.org. This also installs npm automatically.

Verify installation after installing
node --version    # should print v18.x.x or v20.x.x
npm --version     # should print 9.x or 10.x
1.2 — Install MongoDB Community Edition

Option A (Local): Download from mongodb.com/try/download/community and install. Enable it as a service so it auto-starts.

Option B (Cloud — Recommended for beginners): Create a free cluster at mongodb.com/atlas. Get your connection string from Atlas → Connect → Drivers.

💡
Tip: MongoDB Atlas free tier (M0) is completely free and requires no local installation. For beginners, use Atlas to avoid configuration headaches.

1.3 — Install VS Code

Download from code.visualstudio.com. Then install these extensions inside VS Code (Ctrl+Shift+X):

ES7+ React/Redux/React-Native snippets
Prettier – Code formatter
MongoDB for VS Code
Thunder Client (for API testing, free Postman alternative)
GitLens
1.4 — Install Postman (optional)

Download from postman.com to test your API endpoints visually.

⚠️
Windows users: After installing Node.js, restart your terminal (Command Prompt or PowerShell) for the PATH changes to take effect.

2
Create Project Folder Structure
Organize your codebase the professional way
Open your terminal and run these commands to create the entire project structure:

Terminal — create project folders
# Navigate to where you want your project
cd Desktop

# Create root folder
mkdir appointment-booking
cd appointment-booking

# Create backend structure
mkdir backend
cd backend
mkdir models routes middleware controllers
cd ..

# Create frontend
mkdir frontend
cd frontend
mkdir -p src/components src/pages src/context src/utils public
cd ..
Your final folder structure should look like this:

appointment-booking/
├── backend/
│   ├── models/          # User.js, Doctor.js, Appointment.js
│   ├── routes/          # authRoutes.js, doctorRoutes.js, etc.
│   ├── controllers/     # authController.js, appointmentController.js, etc.
│   ├── middleware/      # authMiddleware.js
│   ├── server.js
│   ├── seed.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/  # Navbar.js
    │   ├── pages/       # Home, Login, Register, Doctors, etc.
    │   ├── context/     # AuthContext.js
    │   ├── App.js
    │   └── index.js
    └── package.json
3
Set Up the Backend
Install dependencies and copy all backend files
Copy all the provided backend files into your backend/ folder, then install dependencies:

Terminal — backend setup
cd appointment-booking/backend

# Install all backend dependencies at once
npm install express mongoose dotenv cors bcryptjs jsonwebtoken express-validator nodemailer

# Install nodemon as dev dependency (auto-restarts server on file changes)
npm install --save-dev nodemon
Files to create in backend/ folder:

server.js — main Express server entry point
.env — environment variables (MongoDB URI, JWT secret)
models/User.js — user schema with password hashing
models/Doctor.js — doctor profile schema
models/Appointment.js — appointment booking schema
middleware/authMiddleware.js — JWT protect + admin guard
controllers/authController.js — register, login, getMe
controllers/doctorController.js — CRUD for doctors
controllers/appointmentController.js — book, cancel, list
routes/authRoutes.js, doctorRoutes.js, appointmentRoutes.js, adminRoutes.js
seed.js — sample data seeder
📁
All these files have been provided above in the code blocks. Copy each file's content exactly into the correct path.

4
Configure MongoDB & Environment Variables
Set up your .env file with the right credentials
Open the backend/.env file and update it with your actual values:

backend/.env — update these values
PORT=5000

# LOCAL MongoDB (if you installed MongoDB locally):
MONGO_URI=mongodb://localhost:27017/appointment_booking

# OR ATLAS MongoDB (replace with your actual Atlas connection string):
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/appointment_booking

# Change this to a long random string in production!
JWT_SECRET=my_super_secret_key_abc123xyz
JWT_EXPIRE=7d

# Email (optional — for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

NODE_ENV=development
💡
Using MongoDB Atlas? Go to your cluster → Connect → Connect your application → Copy the connection string. Replace <password> with your actual DB user password.

🔒
Security: Never commit your .env file to GitHub. Add .env to your .gitignore file.

5
Run the Backend Server
Start your Node.js + Express API
Terminal — start backend
cd appointment-booking/backend

# Development mode (auto-restarts on file changes)
npm run dev

# You should see:
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
Test the server is working by opening your browser and visiting:

Test in browser
http://localhost:5000

# Should show:
{ "message": "Appointment Booking API is running", "status": "OK" }
⚠️
MongoDB not connecting? If you installed MongoDB locally, make sure the MongoDB service is running. On Windows: search "Services" → find MongoDB → Start. On Mac/Linux: sudo systemctl start mongod

6
Seed Sample Data
Add doctors and admin user to your database
Open a new terminal window (keep the server running in the first one), then run:

New terminal window — seed database
cd appointment-booking/backend

node seed.js

# Expected output:
✅ Connected to MongoDB
✅ 6 doctors seeded
✅ Admin user created: admin@medibook.com / admin123
✅ Seeding complete! Database connection closed.
💡
Admin Login Credentials (created by seed.js):
Email: admin@medibook.com
Password: admin123
Use these to access the Admin Dashboard at /admin

You can verify the data was inserted using MongoDB Compass (GUI) or the MongoDB VS Code extension.

7
Set Up the Frontend (React)
Install React dependencies and copy all frontend files
New terminal — frontend setup
cd appointment-booking/frontend

# Install all frontend dependencies
npm install axios react-router-dom react-toastify react-datepicker

# If you don't have react-scripts installed (fresh setup), run:
npm install
Files to create in frontend/src/ folder:

📄 Pages (src/pages/)
Home.js · Login.js · Register.js · Doctors.js · BookAppointment.js · MyAppointments.js · AdminDashboard.js

🧩 Components & Context
src/components/Navbar.js · src/context/AuthContext.js · src/App.js · src/index.js · public/index.html

🔗
The "proxy": "http://localhost:5000" line in frontend/package.json automatically routes all /api/... calls to your backend. No need to hardcode the backend URL in your React code.

8
Run the Full Application
Start both backend and frontend simultaneously
You need two terminal windows open at the same time:

Terminal 1 — backend (keep this running)
cd appointment-booking/backend
npm run dev
# Runs on: http://localhost:5000
Terminal 2 — frontend (keep this running)
cd appointment-booking/frontend
npm start
# Opens browser automatically at: http://localhost:3000
Your app is now live at: http://localhost:3000

🌐 Frontend URLs
/ → Home
/doctors → Browse doctors
/login → User login
/register → New account
/book/:id → Book appointment
/appointments → My bookings
/admin → Admin dashboard

⚙️ Backend API Base
http://localhost:5000/api/auth
http://localhost:5000/api/doctors
http://localhost:5000/api/appointments
http://localhost:5000/api/admin

9
Test All API Routes
Use Postman or Thunder Client to verify each endpoint
Test each of these routes using Postman. Set the base URL to http://localhost:5000

Method	Route	Auth	Description
POST	/api/auth/register	None	Register a new user
POST	/api/auth/login	None	Login and get JWT token
GET	/api/auth/me	Bearer Token	Get current user profile
GET	/api/doctors	None	List all doctors
GET	/api/doctors?specialization=Cardiologist	None	Filter by specialization
GET	/api/doctors/:id	None	Single doctor details
POST	/api/appointments	Bearer Token	Book an appointment
GET	/api/appointments/my	Bearer Token	My appointments list
PUT	/api/appointments/:id/cancel	Bearer Token	Cancel appointment
GET	/api/appointments/slots/:doctorId?date=2024-12-25	None	Get booked slots
GET	/api/admin/stats	Admin Token	Dashboard statistics
GET	/api/admin/appointments	Admin Token	All appointments (admin)
PUT	/api/admin/appointments/:id	Admin Token	Update appointment status
💡
How to use Bearer Token in Postman: After login, copy the token from the response. In your next request → Headers → Add: Authorization: Bearer <your_token_here>

10
Project Features Summary
Everything that's built into this system
✅ What's already working:

User registration with validation (name, email, phone, password)
Secure login with JWT authentication (7-day token)
Browse all doctors with filter by specialization
Book appointments — select date, time slot, and reason
Real-time slot availability — booked slots are greyed out
Only available days shown in the date picker (per doctor schedule)
View all my appointments with status badges
Cancel pending or confirmed appointments
Admin dashboard — view all appointments, update status
Admin stats — total users, appointments, pending, confirmed counts
Protected routes — unauthenticated users redirected to login
Admin-only routes — regular users cannot access /admin
Duplicate booking prevention (unique index on doctor + date + slot)
Password hashing with bcryptjs
Toast notifications for all actions
🚀 Future features to add:

Email confirmation using Nodemailer (infrastructure is ready in .env)
Doctor registration and self-manage availability
Payment integration (Razorpay for India)
Search doctors by name
Doctor reviews and rating system
SMS notifications via Twilio
Mobile-responsive CSS improvements
Deploy to Render (backend) + Vercel (frontend)
🎉 Your App is Ready!
Frontend: http://localhost:3000  |  Backend API: http://localhost:5000

Admin login: admin@medibook.com / admin123

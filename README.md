# 🌱 SHUDDHUDARA

**Plant-Based Clean Air Solutions for a Sustainable Future**

SHUDDHUDARA is a full-stack web platform dedicated to promoting and deploying innovative plant-based clean-air technologies. Through collaboration with Vidaverde International and the Youth Development for Climate Tech (YDfCT) program powered by Meta AI, we're creating sustainable solutions for air purification and environmental restoration.

---

## 🌿 About the Project

SHUDDHUDARA showcases cutting-edge climate technology solutions focused on:

- **Plant-Based Air Purification**: Natural, sustainable air quality improvement systems
- **AI-Powered Monitoring**: Intelligent air quality analysis and optimization platforms  
- **Mobile Solutions**: Revolutionary moving botanical air purification (BioBloom)
- **Youth-Led Innovation**: Empowering young climate tech innovators across borders

### Key Solutions

1. **Plantify** - Intelligent plant-based air purification systems for urban environments
2. **AirthMind** - AI-powered air quality monitoring and optimization platform
3. **AeroSense** - Advanced sensors for real-time air quality detection
4. **BioBloom** - The Moving Tree: Revolutionary mobile botanical air purification
5. **Oxygenz** - Natural oxygen generation systems powered by plants
6. **Future Innovations** - Upcoming climate tech solutions in development

---

## 🚀 Technology Stack

### Frontend
- **HTML5** - Semantic markup for structure
- **CSS3** - Custom pastel green design system with animations
- **Vanilla JavaScript (ES6+)** - Interactive functionality
- **Google Fonts** - Poppins & Inter typography

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Database for user management
- **Mongoose** - MongoDB object modeling

### Authentication
- **bcryptjs** - Password hashing
- **JSON Web Tokens (JWT)** - Secure authentication
- **localStorage** - Client-side token storage

---

## 📁 Project Structure

```
shuddhudara/
├── frontend/
│   ├── home/
│   │   └── index.html                  # Main landing page
│   ├── solutions/
│   │   ├── bioBloom.html               # BioBloom product page (fully implemented)
│   │   ├── plantify.html               # Plantify placeholder
│   │   ├── airthMind.html              # AirthMind placeholder
│   │   ├── aeroSense.html              # AeroSense placeholder
│   │   ├── oxygenz.html                # Oxygenz placeholder
│   │   └── expansion.html              # Future innovation placeholder
│   ├── login/
│   │   ├── loginPage.html              # User authentication page
│   │   └── dashboard.html              # Post-login dashboard
│   └── assets/
│       ├── css/
│       │   ├── main.css                # Global styles & design system
│       │   ├── login.css               # Login page styles
│       │   └── bioBloom.css            # BioBloom page styles
│       ├── js/
│       │   ├── navigation.js           # Menu & scroll functionality
│       │   ├── animations.js           # Scroll animations & effects
│       │   └── loginHandler.js         # Authentication logic
│       └── images/
│           ├── logos/                  # Organization logos
│           ├── team/                   # Team member photos
│           └── products/               # Product images
├── backend/
│   ├── server.js                       # Main Express server
│   ├── config/
│   │   └── database.js                 # MongoDB connection
│   ├── models/
│   │   └── userModel.js                # User schema with bcrypt
│   ├── controllers/
│   │   └── authController.js           # Authentication logic
│   ├── routes/
│   │   └── authRoutes.js               # API endpoints
│   ├── middleware/
│   │   └── authMiddleware.js           # JWT verification
│   ├── package.json                    # Dependencies
│   └── .env                            # Environment variables
├── .gitignore
└── README.md
```

---

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

### Step 1: Clone or Download Project

```bash
# Navigate to the project directory
cd C:\Users\HP\.gemini\antigravity\scratch\shuddhudara
```

### Step 2: Install Backend Dependencies

```bash
# Navigate to backend folder
cd backend

# Install all required packages
npm install
```

This will install:
- express (web framework)
- mongoose (MongoDB ODM)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- dotenv (environment variables)
- cors (cross-origin support)
- nodemon (development auto-restart)

### Step 3: Configure Environment Variables

The `.env` file is already created in the `backend` folder. Update it if needed:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/shuddhudara
JWT_SECRET=shuddhudara_secret_key_change_in_production_2024
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important**: Change `JWT_SECRET` to a secure random string in production!

### Step 4: Start MongoDB

```bash
# Windows: Start MongoDB service
mongod

# Or if installed as Windows service:
net start MongoDB
```

### Step 5: Start Backend Server

```bash
# From the backend directory
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port: 3000
```

### Step 6: Open Frontend

Open `frontend/home/index.html` in your web browser:

**Option 1**: Double-click the file
**Option 2**: Right-click → Open with → Your Browser
**Option 3**: Use a live server extension if using VS Code

---

## 🎯 Usage Guide

### For Users

1. **Browse Solutions**:
   - Visit the homepage to explore all air purification solutions
   - Click on any solution card to learn more
   - BioBloom has full details, others are placeholders for now

2. **Create Account**:
   - Click "Login" in navigation
   - Currently no registration page (contact admin)
   - Admin can create accounts via API

3. **Login**:
   - Enter email and password
   - Click "Sign In"
   - You'll be redirected to the dashboard
   - Access all solution categories from dashboard

4. **Navigate**:
   - Use hamburger menu (mobile) or top navigation (desktop)
   - Smooth scroll to sections on homepage
   - "Go Back" buttons on all solutions pages

### For Developers

#### Creating a Test User

Use an API tool like **Postman** or **curl**:

```bash
# Register a new user
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@shuddhudara.org",
  "password": "password123"
}
```

#### API Endpoints

**Public Routes**:
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/forgot-password` - Request password reset

**Protected Routes** (require JWT token):
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout user

#### Authentication Flow

1. User submits login form
2. Frontend sends credentials to `/api/auth/login`
3. Backend verifies password using bcrypt
4. Backend generates JWT token
5. Frontend stores token in localStorage
6. Frontend includes token in Authorization header for protected requests

---

## 🎨 Design System

### Color Palette (Pastel Green Theme)

```css
--color-primary: #66BB6A          /* Medium green */
--color-primary-light: #81C784    /* Light green */
--color-primary-lighter: #A5D6A7  /* Lighter green */
--color-primary-lightest: #C8E6C9 /* Lightest green */
--color-primary-dark: #4CAF50     /* Darker green */
--color-accent: #8BC34A           /* Lime green */
```

### Typography

- **Headings**: Poppins (600-700 weight)
- **Body**: Inter (400-600 weight)
- **Base Size**: 16px
- **Scale**: Modular scale from 0.75rem to 3rem

### Components

- Responsive grid layouts
- Smooth scroll animations
- Hover effects on interactive elements
- Mobile-first responsive design
- Glassmorphism effects on login page
- FAQ accordion with expand/collapse

---

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

All pages are fully responsive and tested across devices.

---

## 🔐 Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Tokens**: Secure, stateless authentication
3. **Input Validation**: Server-side validation
4. **Protected Routes**: Middleware authentication checks
5. **CORS**: Configured for security
6. **Environment Variables**: Sensitive data protection

---

## 🤝 Team

Our diverse international team includes:

1. **Aarushi Chatterjee** (India) - Environmental tech professional
2. **Pooja Gunturu** (India) - Climate tech specialist
3. **Setyorini Okiviana** (Indonesia) - Sustainability expert
4. **Clarissa Tomponu** (Indonesia) - Environmental engineer
5. **Vaisakh** (India) - Climate technology innovator
6. **Varel** (Indonesia) - Environmental tech specialist

---

## 🌍 Partnerships
PORT=3001
```

### CORS Errors

Update `backend/server.js` with your frontend URL:
```javascript
app.use(cors({
  origin: 'http://localhost:5500', // Your frontend URL
  credentials: true
}));
```

### Login Not Working

1. Check if backend server is running
2. Check browser console for errors
3. Verify MongoDB is connected
4. Ensure user exists in database
5. Check network tab in DevTools

---

## 📧 Contact

- **Email**: info@shuddhudara.org
- **GitHub**: [github.com/shuddhudara](https://github.com/shuddhudara)
- **LinkedIn**: [linkedin.com/company/shuddhudara](https://linkedin.com/company/shuddhudara)

---

## 🎯 Future Enhancements

- [ ] Complete Plantify solution page
- [ ] Complete AirthMind solution page
- [ ] Complete AeroSense solution page
- [ ] Complete Oxygenz solution page
- [ ] Add user registration page
- [ ] Implement password reset functionality
- [ ] Add email verification
- [ ] Create admin dashboard
- [ ] Add real-time air quality data visualization
- [ ] Integrate IoT device monitoring
- [ ] Multilingual support (English, Indonesian, Hindi)
- [ ] Blog section for updates
- [ ] Newsletter subscription
- [ ] E-commerce integration for product sales

---

Made with 💚 by the SHUDDHUDARA Team

**Building a cleaner, greener future through plant-based innovation**

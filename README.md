# Mini LinkedIn - Professional Networking Platform

A full-stack LinkedIn-like community platform built with React, Node.js, and MongoDB. This application provides a professional networking experience with user authentication, post creation, profile management, and social interactions.

## 🚀 Features

### Core Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Profile Management**: Create and edit user profiles with bio, location, and website
- **Post Creation**: Share text-based posts with the community
- **Social Interactions**: Like and comment on posts
- **User Profiles**: View other users' profiles and their posts
- **Responsive Design**: Modern, mobile-friendly UI

### Technical Features

- **Real-time Updates**: Instant UI updates for likes, comments, and posts
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Security**: Password hashing, JWT authentication, and input sanitization
- **Performance**: Pagination for posts and optimized database queries

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks and functional components
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications
- **Date-fns** - Date formatting utilities

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **helmet** - Security middleware
- **morgan** - HTTP request logger

### Development Tools

- **Concurrently** - Run frontend and backend simultaneously
- **Nodemon** - Auto-restart server during development

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MiniLinkedIn
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mini-linkedin
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**Note**: Replace `your-super-secret-jwt-key-change-this-in-production` with a strong secret key.

### 4. Database Setup

#### Option A: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. The application will automatically create the database

#### Option B: MongoDB Atlas (Cloud)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in the `.env` file with your Atlas connection string

### 5. Run the Application

#### Development Mode

```bash
# From the root directory
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 3000).

#### Production Mode

```bash
# Build the frontend
npm run build

# Start the production server
npm start
```

## 📱 Usage

### Demo Accounts

You can create your own account or use these demo credentials:

**Demo User 1:**

- Email: demo1@example.com
- Password: password123

**Demo User 2:**

- Email: demo2@example.com
- Password: password123

### Features Walkthrough

1. **Registration/Login**: Create a new account or sign in with existing credentials
2. **Create Posts**: Share your thoughts with the community (max 1000 characters)
3. **Interact**: Like and comment on posts from other users
4. **Profile Management**: Edit your profile information and view your posts
5. **User Discovery**: Click on user names to view their profiles and posts

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Posts

- `GET /api/posts` - Get all posts (with pagination)
- `POST /api/posts` - Create a new post
- `GET /api/posts/:id` - Get a specific post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post
- `PUT /api/posts/:id/like` - Like/unlike a post
- `POST /api/posts/:id/comments` - Add a comment to a post

### Users

- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/posts` - Get user's posts
- `GET /api/users/search/:query` - Search users by name

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the application**:

   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Vercel**:

   - Connect your GitHub repository to Vercel
   - Set build command: `npm run build`
   - Set output directory: `build`
   - Set root directory: `client`

3. **Deploy to Netlify**:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Set base directory: `client`

### Backend Deployment (Render/Railway)

1. **Deploy to Render**:

   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Set root directory: `server`
   - Add environment variables

2. **Deploy to Railway**:
   - Connect your GitHub repository
   - Set root directory: `server`
   - Add environment variables

### Environment Variables for Production

Update your frontend API calls to point to your deployed backend URL:

```javascript
// In client/src/contexts/AuthContext.js and other API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
```

## 🔧 Configuration

### Database Configuration

The application uses MongoDB with Mongoose ODM. Configure your database connection in the `.env` file.

### JWT Configuration

JWT tokens are used for authentication. Configure the secret key in the `.env` file.

### CORS Configuration

CORS is enabled for development. Update the configuration in `server/index.js` for production.

## 🧪 Testing

The application includes basic error handling and validation. For comprehensive testing:

1. **API Testing**: Use tools like Postman or Insomnia
2. **Frontend Testing**: Use React Testing Library
3. **Database Testing**: Test with different MongoDB configurations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- LinkedIn for inspiration
- React and Node.js communities
- MongoDB for the database solution
- All the open-source libraries used in this project

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/MiniLinkedIn/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Note**: This is a demonstration project. For production use, implement additional security measures, error handling, and performance optimizations.

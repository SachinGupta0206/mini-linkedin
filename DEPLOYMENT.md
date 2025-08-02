# Deployment Guide - Mini LinkedIn

This guide will help you deploy the Mini LinkedIn application to various hosting platforms.

## 🚀 Quick Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend) - Recommended

#### Frontend Deployment (Vercel)

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project:
     - **Framework Preset**: Create React App
     - **Root Directory**: `client`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`
   - Click "Deploy"

3. **Environment Variables** (Optional)
   - Add `REACT_APP_API_URL` pointing to your backend URL

#### Backend Deployment (Render)

1. **Deploy to Render**

   - Go to [render.com](https://render.com)
   - Sign up/Login with GitHub
   - Click "New Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: `mini-linkedin-backend`
     - **Root Directory**: `server`
     - **Runtime**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Add environment variables:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_super_secret_jwt_key
     NODE_ENV=production
     ```
   - Click "Create Web Service"

2. **Update Frontend API URL**
   - Copy the Render service URL
   - Update your Vercel environment variables with `REACT_APP_API_URL`

### Option 2: Netlify (Frontend) + Railway (Backend)

#### Frontend Deployment (Netlify)

1. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login with GitHub
   - Click "New site from Git"
   - Choose your repository
   - Configure build settings:
     - **Base directory**: `client`
     - **Build command**: `npm run build`
     - **Publish directory**: `build`
   - Click "Deploy site"

#### Backend Deployment (Railway)

1. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository
   - Set root directory to `server`
   - Add environment variables in the Railway dashboard

## 🗄️ Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create MongoDB Atlas Account**

   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**

   - Choose the free tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create"

3. **Configure Database Access**

   - Go to "Database Access"
   - Click "Add New Database User"
   - Create a username and password
   - Select "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**

   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `mini-linkedin`

## 🔧 Environment Variables

### Backend Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mini-linkedin?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
```

### Frontend Environment Variables

For Vercel/Netlify, add these environment variables:

```env
REACT_APP_API_URL=https://your-backend-url.com
```

## 📱 Domain Configuration

### Custom Domain (Optional)

1. **Vercel Custom Domain**

   - Go to your Vercel project dashboard
   - Click "Settings" → "Domains"
   - Add your custom domain
   - Configure DNS records as instructed

2. **Netlify Custom Domain**
   - Go to your Netlify site dashboard
   - Click "Domain settings"
   - Add your custom domain
   - Configure DNS records

## 🔒 Security Considerations

### Production Security Checklist

- [ ] Change default JWT secret
- [ ] Use HTTPS for all connections
- [ ] Configure CORS properly for production
- [ ] Set up proper MongoDB user permissions
- [ ] Enable MongoDB Atlas security features
- [ ] Use environment variables for all secrets
- [ ] Set up proper error logging
- [ ] Configure rate limiting (optional)

### CORS Configuration

Update the CORS configuration in `server/index.js` for production:

```javascript
// Replace the current CORS configuration with:
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://your-frontend-domain.com"]
        : ["http://localhost:3000"],
    credentials: true,
  })
);
```

## 📊 Monitoring and Analytics

### Basic Monitoring Setup

1. **Application Logs**

   - Vercel: Built-in logging in dashboard
   - Netlify: Function logs in dashboard
   - Render: Application logs in dashboard
   - Railway: Logs in dashboard

2. **Error Tracking**
   - Consider adding Sentry for error tracking
   - Set up email notifications for critical errors

## 🚀 Performance Optimization

### Frontend Optimization

1. **Build Optimization**

   ```bash
   # In client directory
   npm run build
   ```

2. **Image Optimization**

   - Use WebP format for images
   - Implement lazy loading
   - Optimize image sizes

3. **Code Splitting**
   - React Router automatically handles code splitting
   - Consider implementing React.lazy() for larger components

### Backend Optimization

1. **Database Indexing**

   - Ensure proper indexes on frequently queried fields
   - Monitor query performance

2. **Caching**
   - Consider implementing Redis for caching
   - Cache frequently accessed data

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./client
```

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**

   - Check CORS configuration
   - Verify frontend URL is in allowed origins

2. **Database Connection Issues**

   - Verify MongoDB Atlas connection string
   - Check network access settings
   - Ensure database user has proper permissions

3. **Build Failures**

   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for syntax errors in code

4. **Environment Variables**
   - Ensure all required environment variables are set
   - Check variable names and values
   - Restart services after changing environment variables

### Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)

## 📈 Scaling Considerations

### When to Scale

- **Database**: When you reach 512MB storage limit (free tier)
- **Backend**: When you need more than 750 hours/month (free tier)
- **Frontend**: Usually scales automatically

### Scaling Options

1. **Database Scaling**

   - Upgrade MongoDB Atlas plan
   - Implement read replicas
   - Add database caching

2. **Backend Scaling**

   - Upgrade hosting plan
   - Implement load balancing
   - Add CDN for static assets

3. **Application Scaling**
   - Implement pagination (already done)
   - Add caching layers
   - Optimize database queries

---

**Note**: This deployment guide covers the most common scenarios. For enterprise deployments, consider additional security, monitoring, and scaling requirements.

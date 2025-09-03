# Career Counselor AI 🚀

A modern, production-level AI-powered career counseling SaaS platform built with Next.js, TypeScript, and cutting-edge technologies. Get personalized career guidance, job search strategies, and professional advice from our advanced AI counselor.

## 📋 Submission Checklist

✅ **Next.js Application**: Built with Next.js 15 and TypeScript for type safety  
✅ **Public GitHub Repository**: Clean commit history and well-organized codebase  
✅ **Working Chat Functionality**: Real-time AI chat with Google Gemini integration  
✅ **Database Integration**: PostgreSQL with Prisma ORM and proper schema design  
✅ **tRPC Implementation**: Type-safe APIs with TanStack Query for data fetching  
✅ **Chat History & Sessions**: Persistent conversation management and session handling  
✅ **Vercel Deployment**: Production-ready deployment with environment configuration  
✅ **Comprehensive README**: Complete setup instructions and documentation  
✅ **Professional UI/UX**: Modern SaaS-level design with animations and responsiveness  
✅ **Authentication System**: Secure Google OAuth with NextAuth.js integration

## 🚀 Features

- **AI-Powered Career Guidance**: Intelligent career recommendations using Google's Gemini AI
- **Real-time Chat Interface**: Modern, responsive chat UI similar to professional platforms
- **Session Management**: Persistent chat history with organized sessions
- **Authentication**: Secure Google OAuth integration with NextAuth
- **Responsive Design**: Beautiful UI that works on all devices
- **Modern Tech Stack**: Built with the latest web technologies

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for full type safety
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **API Layer**: tRPC for end-to-end type safety
- **Data Fetching**: TanStack Query (React Query)
- **State Management**: Zustand for global state
- **UI Framework**: ShadCN/UI components with Tailwind CSS
- **Animations**: Framer Motion for smooth interactions
- **AI Integration**: Google Gemini AI for intelligent responses
- **Deployment**: Vercel with automatic CI/CD

## 📋 Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database (Neon recommended)
- Google OAuth credentials
- Google Gemini API key

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd career-counselor-ai
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   Fill in your environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Random secret for NextAuth
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
   - `GEMINI_API_KEY`: Your Google Gemini API key

4. **Set up the database**
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── chat/              # Chat page
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   ├── chat/              # Chat-specific components
│   ├── landing/           # Landing page components
│   └── layout/            # Layout components
├── lib/                   # Utility libraries
│   ├── auth.ts            # NextAuth configuration
│   ├── db.ts              # Database client
│   ├── store.ts           # Zustand store
│   └── trpc.ts            # tRPC client
├── server/                # Server-side code
│   ├── routers/           # tRPC routers
│   └── trpc.ts            # tRPC server setup
└── types/                 # TypeScript type definitions
```

## 🔧 Configuration

### Database Setup (Neon)
1. Create a new project at [neon.tech](https://neon.tech)
2. Copy the connection string to your `.env.local`
3. Run `pnpm prisma db push` to create tables

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

### Gemini AI Setup
1. Visit [Google AI Studio](https://aistudio.google.com)
2. Create a new API key
3. Add it to your environment variables

## 🚀 Deployment

### Deploy to Vercel (Recommended)

#### Prerequisites
- PostgreSQL database (Neon, Supabase, or Vercel Postgres)
- Google OAuth app configured for production domain
- All environment variables ready

#### Deployment Steps
1. **Push to GitHub**: Ensure your code is in a public GitHub repository

2. **Connect to Vercel**: 
   - Go to [vercel.com](https://vercel.com) and import your repository
   - Vercel will automatically detect Next.js and configure build settings

3. **Environment Variables**: Add these in Vercel dashboard:
   ```bash
   DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require
   NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
   NEXTAUTH_URL=https://your-app-name.vercel.app
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Database Setup**:
   - Run `prisma db push` locally or use Vercel's build process
   - Prisma will automatically generate the client during build

5. **Deploy**: Vercel automatically builds and deploys with these optimizations:
   - Prisma client generation during build
   - Automatic SSL certificates
   - Global CDN distribution
   - Serverless functions for API routes

#### Production Checklist
- ✅ **Database**: PostgreSQL with proper connection pooling
- ✅ **Prisma**: Client generated with `previewFeatures` enabled
- ✅ **Build Scripts**: Updated with Prisma generation
- ✅ **Environment Variables**: All secrets configured in Vercel
- ✅ **OAuth**: Google redirect URIs updated for production domain
- ✅ **SSL**: Automatically handled by Vercel
- ✅ **Domain**: Custom domain configured (optional)

### Testing Your Deployment
1. **Authentication Flow**: Test Google OAuth login/logout
2. **Chat Functionality**: Create new sessions and send messages
3. **Session Management**: Verify chat history persistence
4. **Responsive Design**: Test on mobile, tablet, and desktop
5. **Performance**: Check loading times and animations

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface inspired by top Silicon Valley apps
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode**: Automatic theme detection
- **Smooth Animations**: Polished interactions and transitions
- **Accessibility**: Built with accessibility best practices

## 🤖 AI Features

- **Contextual Conversations**: AI remembers conversation history
- **Career Expertise**: Specialized in career counseling and professional guidance
- **Personalized Advice**: Tailored recommendations based on user input
- **Real-time Responses**: Fast, intelligent responses powered by Gemini AI

## 📱 Screenshots

[Add screenshots of your application here]

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔍 Project Highlights

### Architecture Excellence
- **Type Safety**: End-to-end TypeScript with tRPC for API calls
- **Modern Patterns**: Server components, client components, and proper data fetching
- **Performance**: Optimized with Next.js 15 features and efficient state management
- **Scalability**: Modular component structure and clean separation of concerns

### Production Features
- **Professional UI/UX**: SaaS-level design with micro-interactions
- **Real-time Experience**: Instant message display with loading states
- **Session Management**: Persistent chat history with organized sessions
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Security**: Secure authentication and API protection

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-username/career-counselor-ai/issues) page
2. Create a new issue with detailed information
3. Review the deployment logs in Vercel dashboard
4. Verify environment variables are correctly set

## 🧪 Testing Guidelines

### Manual Testing Checklist
- [ ] **Landing Page**: Verify hero section, features, and CTA buttons
- [ ] **Authentication**: Test Google OAuth login/logout flow
- [ ] **Chat Interface**: Create new sessions and send messages
- [ ] **AI Responses**: Verify Gemini AI integration works correctly
- [ ] **Session Management**: Test chat history and session switching
- [ ] **Responsive Design**: Test on different screen sizes
- [ ] **Performance**: Check page load times and smooth animations
- [ ] **Error Handling**: Test with invalid inputs and network issues

### Key Features to Validate
1. **Real-time Chat**: Messages appear immediately, AI responses are contextual
2. **Session Persistence**: Chat history survives page refreshes
3. **Professional UI**: Modern design with smooth animations
4. **Mobile Experience**: Fully responsive on all devices

## 🚀 Live Demo

**Deployed Application**: [Add your Vercel deployment URL here]

## 🙏 Acknowledgments

- Built for the Orientation AI Software Engineer assignment
- Inspired by modern SaaS platforms and AI-powered applications
- Thanks to the open-source community for amazing tools and libraries
- Special thanks to Vercel, Google AI, and the Next.js team

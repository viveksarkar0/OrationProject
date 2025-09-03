# Career Counselor AI

A modern, AI-powered career counseling platform built with Next.js, TypeScript, and cutting-edge technologies. Get personalized career guidance, job search strategies, and professional advice from our advanced AI counselor.

## 🚀 Features

- **AI-Powered Career Guidance**: Intelligent career recommendations using Google's Gemini AI
- **Real-time Chat Interface**: Modern, responsive chat UI similar to professional platforms
- **Session Management**: Persistent chat history with organized sessions
- **Authentication**: Secure Google OAuth integration with NextAuth
- **Responsive Design**: Beautiful UI that works on all devices
- **Modern Tech Stack**: Built with the latest web technologies

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google Provider
- **API**: tRPC for type-safe APIs
- **State Management**: Zustand
- **UI Components**: ShadCN/UI with Tailwind CSS
- **AI Integration**: Google Gemini AI
- **Deployment**: Vercel

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

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
- Set `NEXTAUTH_URL` to your production domain
- Use production database URL
- Keep all API keys secure

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

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-username/career-counselor-ai/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- Built for the Oration AI Software Engineer assignment
- Inspired by modern chat interfaces and AI-powered applications
- Thanks to the open-source community for amazing tools and libraries

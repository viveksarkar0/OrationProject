# Career Counselor AI - Technical Documentation

**Live Demo**: https://oration-project.vercel.app/chat  
**GitHub Repository**: https://github.com/viveksarkar0/OrationProject

## Quick Tech Stack

**Frontend**: Next.js 15 + TypeScript + TailwindCSS + ShadCN/UI + Framer Motion  
**Backend**: tRPC + TanStack Query + NextAuth.js + Prisma ORM  
**Database**: PostgreSQL (Neon) with proper relationships and indexing  
**AI**: Google Gemini 1.5 Flash for intelligent career counseling responses  
**Deployment**: Vercel with automatic CI/CD, SSL, and global CDN  

## Project Overview

A production-ready AI-powered career counseling platform built with modern web technologies, featuring real-time chat, session management, and intelligent career guidance powered by Google's Gemini AI.

## Key Features

✅ **AI Career Counselor**: Intelligent responses using Google Gemini 1.5 Flash  
✅ **Session Management**: Persistent chat history with automatic session creation  
✅ **Authentication**: Secure Google OAuth with NextAuth.js  
✅ **Real-time Chat**: Professional UI with loading states and animations  
✅ **Responsive Design**: Mobile-first approach with desktop enhancements  
✅ **Production Ready**: Deployed on Vercel with PostgreSQL database  

## Architecture Overview

### Frontend Stack
- **Next.js 15** with App Router and TypeScript
- **React 19** with Server/Client Components  
- **TailwindCSS 4** + ShadCN/UI for modern design
- **Framer Motion** for smooth animations

### Backend Stack
- **tRPC** for end-to-end type-safe APIs
- **TanStack Query** for efficient data fetching
- **NextAuth.js** with Google OAuth authentication
- **Prisma ORM** with PostgreSQL database

### AI Integration
- **Google Gemini 1.5 Flash** for intelligent career counseling
- **Context-aware conversations** with message history
- **Specialized system prompts** for career guidance expertise

### Database Schema
```sql
User {
  id: String (Primary Key)
  name: String
  email: String
  chatSessions: ChatSession[]
}

ChatSession {
  id: String (Primary Key)
  title: String
  userId: String (Foreign Key)
  messages: Message[]
  createdAt: DateTime
  updatedAt: DateTime
}

Message {
  id: String (Primary Key)
  content: String
  role: Enum (user | assistant)
  chatSessionId: String (Foreign Key)
  createdAt: DateTime
}
```

## Key Features Implementation

### 1. AI Chat Interface
- **Real-time messaging** with typing indicators and loading states
- **Session-based conversations** with persistent history
- **Contextual AI responses** using conversation history
- **Professional UI/UX** with message bubbles and timestamps

### 2. Session Management
- **Automatic session creation** when users send their first message
- **Session persistence** across page refreshes and browser sessions
- **Chat history sidebar** with search and organization
- **Session switching** without losing context

### 3. Authentication System
- **Google OAuth integration** via NextAuth.js
- **Secure session management** with JWT tokens
- **Protected routes** and user-specific data
- **Seamless login/logout flow**

### 4. Production Optimizations
- **Database connection pooling** for scalability
- **Prisma client generation** during build process
- **Environment variable management** for different deployment stages
- **Error handling** and loading states throughout the application

## Deployment Architecture

### Vercel Deployment
- **Automatic CI/CD** from GitHub repository
- **Serverless functions** for API routes and tRPC endpoints
- **Edge runtime** optimization for global performance
- **Environment variables** securely managed in Vercel dashboard

### Database (PostgreSQL)
- **Production database** hosted on Neon
- **Connection pooling** for high availability
- **Automatic migrations** via Prisma
- **SSL-enabled connections** for security

## Performance Features

### Frontend Optimizations
- **Server-side rendering** for initial page loads
- **Client-side navigation** for smooth user experience
- **Optimistic updates** for immediate UI feedback
- **Lazy loading** and code splitting

### Backend Optimizations
- **tRPC batching** for efficient API calls
- **Database query optimization** with proper indexing
- **Caching strategies** via TanStack Query
- **Type-safe API layer** preventing runtime errors

## Security Implementation

### Authentication & Authorization
- **OAuth 2.0** with Google provider
- **JWT token management** via NextAuth.js
- **Session validation** on protected routes
- **CSRF protection** built into Next.js

### Data Protection
- **Environment variable encryption** in production
- **Database connection security** with SSL
- **Input validation** using Zod schemas
- **XSS protection** via React's built-in sanitization

## Development Workflow

### Code Quality
- **TypeScript strict mode** for type safety
- **ESLint configuration** for code consistency
- **Prisma type generation** for database operations
- **Component-based architecture** for maintainability

### Testing Strategy
- **Manual testing checklist** for core functionality
- **Cross-browser compatibility** testing
- **Mobile responsiveness** validation
- **Performance monitoring** in production

## Scalability Considerations

### Database Design
- **Normalized schema** with proper relationships
- **Indexed queries** for fast lookups
- **Connection pooling** for concurrent users
- **Migration strategy** for schema updates

### Application Architecture
- **Modular component structure** for easy maintenance
- **Separation of concerns** between client and server
- **API versioning** through tRPC routers
- **State management** with Zustand for global state

## Monitoring & Maintenance

### Production Monitoring
- **Vercel Analytics** for performance insights
- **Error tracking** via console logging
- **Database monitoring** through provider dashboards
- **User session tracking** for usage analytics

### Maintenance Strategy
- **Regular dependency updates** for security
- **Database backup procedures** via cloud providers
- **Environment synchronization** between dev/prod
- **Performance optimization** based on metrics

---

**Built with modern web technologies and best practices for a production-ready AI-powered career counseling platform.**

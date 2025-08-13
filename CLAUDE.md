# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Starts Vite dev server on localhost:5173
- **Build**: `npm run build` - Creates production build using Vite
- **Lint**: `npm run lint` - Runs ESLint on the codebase
- **Preview**: `npm run preview` - Preview production build locally
- **Visual tests**: `npm run test:visual` - Runs Playwright visual regression tests for specific viewport
- **All tests**: `npm run test` - Runs complete Playwright test suite across all viewports
- **Update test baselines**: `npm run update-baseline` - Updates Playwright visual test baseline images

## Project Architecture

This is a React portfolio website built with Vite, featuring:

### Tech Stack
- **Frontend**: React 19 + Vite for development
- **Styling**: Tailwind CSS 4.1.4 with dark mode support
- **Icons**: FontAwesome React components
- **HTTP Client**: Axios for API requests
- **Animation**: Framer Motion for animations
- **Testing**: Playwright for visual regression testing across multiple viewports

### Core Structure
- **App.jsx**: Main application component with ThemeProvider, sidebar navigation, and page routing
- **profile.jsx**: Central data source containing all portfolio content (personal info, experience, skills, projects, contact)
- **ThemeContext**: React context for dark/light mode theming
- **Component Architecture**: 
  - Single-page application with component-based sections (Home, About, Portfolio, Skills)
  - Sidebar navigation with hamburger menu for mobile
  - Responsive design patterns throughout

### Key Features
- Dark/light theme switching via ThemeContext
- Responsive sidebar navigation with mobile hamburger menu
- Visual regression testing with Playwright across 7 different viewport sizes
- Project showcase with dynamic data from profile.jsx
- Skills categorization and display system
- Timeline component for experience display

### Configuration Notes
- Vite configured with path aliases (`@` → `./src`)
- Tailwind CSS with custom font families (Poppins, Quicksand)
- ESLint with React hooks and React refresh plugins
- Playwright configured for cross-viewport visual testing with animation reduction
- Build optimized for GitHub Pages deployment

### Data Management
All portfolio content is centralized in `src/profile.jsx` including:
- Personal information and hero content
- Work experience with company details
- Skills organized by categories
- Project details with technologies and images (fallback data)
- Contact information and social links

### API Integration
The portfolio features hybrid data loading for projects:

#### External API Configuration
- **Axios Instance**: Configured in `src/api/axios.js` with environment-based URL selection
- **Environment Variables**: Uses `VITE_API_URL` for production API endpoint
- **Development Fallback**: Defaults to `http://localhost:8080` when `VITE_API_URL` is not set
- **Request/Response Interceptors**: Includes authentication token handling and global error management

#### Project Data Loading Strategy (`src/components/Portfolio.jsx`)
1. **Primary**: Attempts API call to `/api/projects` endpoint using axios instance
2. **Fallback**: Uses static project data from `profile.jsx` if API call fails
3. **Error Handling**: Graceful degradation with console logging for debugging
4. **Data Structure**: API response expected to match the structure defined in `profile.jsx`

#### API Endpoint Requirements
- **Route**: `/api/projects`
- **Method**: GET
- **Response Format**: Array of project objects with fields:
  - `id`, `title`, `shortDescription`, `description` (HTML)
  - `githubUrl`, `liveDemoUrl`, `projectType` (FRONTEND/BACKEND/FULLSTACK)
  - `technologies[]` (with id, name, createdAt)
  - `images[]` (with imageKey, role, orderIndex)
  - `createdAt`, `updatedAt` timestamps

#### Authentication & Security
- Bearer token authentication supported via request interceptors
- CORS handling with `withCredentials: false` configuration
- 30-second request timeout for API calls
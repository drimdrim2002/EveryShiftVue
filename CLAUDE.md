# EveryShift - Vue & Supabase Boilerplate

## Project Overview
An opinionated Vue 3 and Supabase boilerplate application built with TypeScript, Vite, and modern tooling.

## Tech Stack
- **Frontend**: Vue 3, Vue Router, Pinia, VeeValidate, VueUse
- **Backend**: Supabase
- **Styling**: TailwindCSS, Radix Vue components
- **Build Tool**: Vite
- **Language**: TypeScript
- **UI Component**: PrimeVue

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (includes type-check)
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

## Project Structure
- Uses unplugin-vue-router for file-based routing
- Pinia for state management
- VeeValidate for form validation
- hCaptcha integration for security
- Supabase integration for backend services

## Environment Setup
- Copy `.env.prod` to `.env` and configure Supabase and hCaptcha variables
- Requires Supabase account for backend services
- See README.md for detailed environment variable setup

## Current Branch
- Main branch: `develop`
- Current status: Modified files include `.env.prod`, `package.json`, `package-lock.json`

## Claude Rules & Guidelines
**Primary Rules**: See `CLAUDE_RULES.md` for essential development patterns and version requirements.

**Critical Versions**:
- Vue 3.5.13, TailwindCSS 4.1.3 (NOT v3!), TypeScript 5.7.3, Vite 6.3.5

**Key Requirements**: 
- ALL tables must use Supabase RLS policies
- TailwindCSS v4 syntax only (@config, CSS custom properties)
- Cache-first store pattern (15min expiration)
- TypeScript interfaces for all components
- Error handling for all async operations

**Detailed Rules** (token-heavy): `claude-rules/` contains comprehensive guides for complex scenarios.
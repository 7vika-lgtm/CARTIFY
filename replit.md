# Overview

This is a Smart Checkout mobile web application that simulates a self-checkout system using barcode scanning. The application allows users to scan product barcodes using their device camera, add items to a shopping cart, and complete purchases through a streamlined checkout process. Built with React and Express, it features a modern mobile-first design with real-time cart management and order tracking capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Mobile-First Design**: Responsive layout optimized for mobile devices with bottom navigation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Development Setup**: tsx for TypeScript execution in development
- **Error Handling**: Centralized error middleware with structured error responses

## Data Layer
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL with Neon Database serverless driver
- **Schema Management**: Type-safe schema definitions in shared directory
- **In-Memory Storage**: MemStorage class for development/demo purposes with sample product data
- **Data Models**: Products, cart items, and orders with proper relationships

## Key Features Implementation
- **Barcode Scanner**: Custom hook using device camera API with video stream management
- **Cart Management**: Real-time cart operations with optimistic updates
- **Checkout Process**: Multi-step checkout with payment method selection
- **Order History**: Complete order tracking with QR code generation
- **Product Catalog**: Barcode-based product lookup system

## Component Architecture
- **Atomic Design**: Reusable UI components in components/ui directory
- **Custom Components**: Business logic components (BarcodeScanner, ProductCard, CartItem)
- **Layout Components**: AppHeader and BottomNavigation for consistent mobile experience
- **Page Components**: Dedicated components for each route (Scanner, Cart, Checkout, Orders)

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18 with TypeScript support, React DOM
- **Build Tools**: Vite with React plugin, esbuild for production builds
- **Development**: tsx for TypeScript execution, Replit-specific plugins

## UI and Styling
- **Component Library**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with PostCSS, class-variance-authority for component variants
- **Icons**: Lucide React for consistent iconography
- **Utilities**: clsx and tailwind-merge for conditional styling

## Data Management
- **HTTP Client**: Native fetch API with custom wrapper
- **State Management**: TanStack React Query for server state
- **Form Handling**: React Hook Form with Hookform Resolvers
- **Validation**: Zod for runtime type validation

## Database and ORM
- **Database**: PostgreSQL via Neon Database serverless driver
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Schema Validation**: Integration between Drizzle schema and Zod validation

## Additional Features
- **Date Handling**: date-fns for date manipulation
- **Routing**: Wouter for lightweight client-side routing
- **Payment Integration**: Stripe React and Stripe.js (configured but not implemented)
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
# ALICE-Capstones Frontend

ALICE is a smart financial management application designed to help users track their spending, analyze their financial habits, and optimize their budget through an AI-powered assistant.

## 🚀 Features

- **AI Financial Assistant (Alice)**: An interactive chatbot that provides budget optimization tips and answers financial queries.
- **Spending Tracking**: Easy-to-use interface for adding and managing daily expenditures.
- **Advanced Analytics**: Visual data representations of spending patterns using Recharts, including category-based breakdowns.
- **Budget Configuration**: Customizable budget limits and user-defined financial goals.
- **Secure Authentication**: Comprehensive auth system including Login, Registration, and Google OAuth integration.
- **Responsive Design**: A modern, mobile-first UI built with Tailwind CSS, featuring a clean aesthetic and dark mode support.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management & Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Routing**: [React Router Dom v7](https://reactrouter.com/)
- **Visualizations**: [Recharts](https://recharts.org/)
- **Validation**: [Zod](https://zod.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📦 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your backend API URL and Google Client ID:
   ```env
   VITE_API_URL=your_api_url_here
   VITE_ALICE_API_BASE_URL=your_alice_ai_api_url_here
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the project for production.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run format`: Formats the code using Prettier.
- `npm run preview`: Previews the production build locally.

## 📂 Project Structure

```text
src/
├── api/            # API service definitions (axios instances)
├── components/     # Reusable UI components
│   ├── alice/      # AI Assistant components
│   ├── analytics/  # Data visualization components
│   ├── profile/    # User settings components
│   ├── spending/   # Transaction management components
│   └── tutorial/   # Onboarding and modals
├── hooks/          # Custom React hooks
├── pages/          # Page-level components (Routes)
├── validator/      # Zod schemas for request/response validation
├── App.tsx         # Main application routing and layout
└── main.tsx        # Entry point
```


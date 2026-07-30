# Numerical Differentiation Calculator

A production-ready full-stack web application for computing numerical derivatives using **Newton Forward** and **Newton Backward Difference Methods**, with automatically generated Difference Tables, step-by-step solutions, and interactive graphs.

![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![NestJS](https://img.shields.io/badge/NestJS-11-red)

---

## ✨ Features

- **Newton Forward Difference Method** — First derivative computation
- **Newton Backward Difference Method** — First derivative computation
- **Automatic Difference Tables** — Generates Δy, Δ²y, Δ³y, Δ⁴y, ...
- **Step-by-Step Solutions** — 6-step walkthrough with KaTeX-rendered formulas
- **Interactive Graphs** — Recharts visualization with interpolation curves
- **Export Everything** — PNG, SVG, PDF, CSV, clipboard, print
- **6 Worked Examples** — One-click solve with full solutions
- **Apple-Inspired UI** — Glassmorphism, animations, dark/light mode
- **REST API** — Full backend with Swagger documentation

---

## 🛠 Prerequisites

- **Node.js** 18.x or later
- **npm** 9.x or later

### Installing Node.js

Download and install from [https://nodejs.org](https://nodejs.org) (LTS recommended).

Or use a version manager:
```bash
# Windows (using winget)
winget install OpenJS.NodeJS.LTS

# Or using fnm
winget install Schniz.fnm
fnm install --lts
```

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend runs on **http://localhost:3001**

Swagger docs at **http://localhost:3001/api/docs**

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:3000**

### 3. Run Tests

```bash
cd backend
npm test
```

---

## 📁 Project Structure

```
├── backend/                  # NestJS API Server
│   ├── src/
│   │   ├── main.ts           # Bootstrap + Swagger
│   │   ├── app.module.ts     # Root module
│   │   └── calculator/
│   │       ├── controllers/  # REST endpoints
│   │       ├── services/     # Math engine + examples
│   │       ├── dto/          # Validated DTOs
│   │       └── interfaces/   # TypeScript interfaces
│   └── test/                 # Jest tests
│
├── frontend/                 # Next.js 15 Application
│   ├── app/                  # Pages (App Router)
│   │   ├── page.tsx          # Home
│   │   ├── calculator/       # Calculator
│   │   ├── theory/           # Theory
│   │   ├── examples/         # Worked Examples
│   │   ├── about/            # About
│   │   └── docs/             # API Documentation
│   ├── components/           # UI Components
│   │   ├── layout/           # Navbar, Footer, Theme
│   │   ├── ui/               # Glass Card, Magnetic Button, etc.
│   │   ├── calculator/       # Calculator-specific components
│   │   └── animations/       # Scroll Reveal, Animated Counter
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Math engine, export, utilities
│   └── types/                # TypeScript types
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/newton-forward` | Compute forward difference derivative |
| `POST` | `/api/newton-backward` | Compute backward difference derivative |
| `POST` | `/api/difference-table` | Generate difference table only |
| `GET`  | `/api/examples` | Get pre-built worked examples |
| `GET`  | `/api/health` | Health check |

---

## 🎨 Design

- Apple Human Interface Guidelines
- 8-point grid system
- Glassmorphism with backdrop blur
- Animated gradient background
- Dark/Light mode with system detection
- Framer Motion animations
- Maximum width: 1440px

---

## 📊 Mathematical Methods

### Newton Forward Difference (First Derivative)

$$f'(x) = \frac{1}{h}\left[\Delta y_0 + \frac{2u-1}{2!}\Delta^2 y_0 + \frac{3u^2-6u+2}{3!}\Delta^3 y_0 + \cdots\right]$$

where $u = (x - x_0) / h$

### Newton Backward Difference (First Derivative)

$$f'(x) = \frac{1}{h}\left[\nabla y_n + \frac{2u+1}{2!}\nabla^2 y_n + \frac{3u^2+6u+2}{3!}\nabla^3 y_n + \cdots\right]$$

where $u = (x - x_n) / h$

---

## 🧪 Testing

The backend includes comprehensive Jest tests covering:
- Mathematical accuracy (verified against analytical derivatives)
- Difference table generation
- Input validation (spacing, duplicates, lengths, non-numeric)
- Edge cases (linear data, negative values, decimal spacing)

---

## 📦 Deployment

### Frontend → Vercel

```bash
cd frontend
npx vercel
```

Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`

### Backend → Render

1. Create a new Web Service on Render
2. Build command: `npm install && npm run build`
3. Start command: `npm run start:prod`
4. Set `PORT` environment variable

---

## 📄 License

MIT

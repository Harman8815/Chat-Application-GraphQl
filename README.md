
<div align="center">

# 💬 Chat Application   
**Next.js + Apollo Client + GraphQL Subscriptions**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Apollo Client](https://img.shields.io/badge/Apollo_Client-311C87?style=for-the-badge&logo=apollographql&logoColor=white)](https://www.apollographql.com/docs/react/)
[![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)](https://graphql.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**A responsive, theme-aware, real-time chat application frontend powered by Next.js and Apollo Client.**  

</div>

---

## 📌 Overview
This repository contains the **client-side** code for a real-time chat application.  
It uses **Next.js** for the frontend framework, **Apollo Client** for GraphQL queries/mutations, and **GraphQL Subscriptions** over WebSockets for real-time chat updates.

The backend (GraphQL server + WebSocket server) is hosted separately.

---

## ✨ Features

- 📱 **Responsive UI** – Optimized for mobile, tablet, and desktop.
- 🎨 **Theme Support** – Light, dark, and system themes with persistence.
- 🔔 **Global Toast Notifications** – Show feedback messages anywhere in the app.
- ⚡ **Real-time Messaging** – GraphQL subscriptions for instant updates.
- ♻ **Reusable Hooks & Utilities** – Clean, modular, and type-safe.
- 🛡 **TypeScript Support** – Strongly typed for better DX.

---

## 🛠 Tech Stack

| Technology           | Purpose |
|----------------------|---------|
| **Next.js**          | React framework for SSR & routing |
| **Apollo Client**    | GraphQL client for queries, mutations, and subscriptions |
| **GraphQL**          | API query language |
| **graphql-ws**       | WebSocket GraphQL transport |
| **Tailwind CSS**     | Utility-first CSS framework |
| **Framer Motion**    | Animations |
| **Radix UI**         | Accessible UI components |
| **TypeScript**       | Type safety |

---

## 📂 Project Structure

```
client/      # Next.js frontend
  app/       # App pages and routes
  components/# Reusable UI components
  contexts/  # React context providers
  graphql/   # Apollo GraphQL setup & queries
  hooks/     # Custom React hooks
  lib/       # Utilities and query client
  public/    # Static assets
  schema/    # TypeScript types
  docs.md    # Client documentation

server/      # Node.js/Express GraphQL backend
  config/    # Database config
  models/    # Mongoose models
  schema/    # GraphQL schema
  utils/     # Auth utilities
  docs.md    # Server documentation
  server.js  # Main server entry
````

---

## 🚀 Getting Started

**1️⃣ Clone the Repository**
```bash
git clone https://github.com/yourusername/chat-client.git
cd chat-client
````

**2️⃣ Install Dependencies**

```bash
npm install
# or
yarn install
```

**3️⃣ Configure Environment Variables**
Create a `.env.local` file:

```env
NEXT_PUBLIC_GRAPHQL_HTTP_URL=http://localhost:4000/graphql
NEXT_PUBLIC_GRAPHQL_WS_URL=ws://localhost:4000/graphql
```

**4️⃣ Run the Development Server**

```bash
npm run dev
# or
yarn dev
```

**5️⃣ Open in Browser**
Visit: [http://localhost:3000](http://localhost:3000)

---


---

## 📸 Screenshots

<div align="center">
  <img src="public/screenshots/home.png" alt="Chat App Home" width="600"/>
  <img src="public/screenshots/chat.png" alt="Chat Window" width="600"/>
</div>

---

## 📦 Deployment

Deploy the client instantly with **Vercel**:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 📜 License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**💡 Pro Tip:**
Run the backend first, then start the client for a fully functional chat experience.

📬 Contributions, feedback, and PRs are welcome!

</div>
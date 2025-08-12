
# Chat Application – Client Documentation (Next.js + GraphQL)

This is the **client-side** codebase of the Chat Application, built using [Next.js](https://nextjs.org) and bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

---

## 🚀 Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

Edit any page (e.g., `app/page.tsx`) and the changes will update instantly in the browser.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to load the [Geist](https://vercel.com/font) font family efficiently.

---

## 📂 Hooks

### **1. `useIsMobile`**

**File:** `hooks/use-mobile.tsx`
Detects if the user’s device is mobile based on a breakpoint (default: `768px`).

* **Returns:** `true` if viewport width < 768px, otherwise `false`.
* **Usage:**

  ```tsx
  const isMobile = useIsMobile();
  ```
* **Purpose:** Enables responsive logic for mobile UI adjustments.

---

### **2. `useTheme` & `ThemeProvider`**

**File:** `hooks/use-theme.tsx`
Provides and manages the application theme (`light`, `dark`, `system`).

* **ThemeProvider:** Wrap your app in this provider to enable theme context.
* **useTheme:** Get and update the current theme.
* **Usage:**

  ```tsx
  <ThemeProvider>
    <App />
  </ThemeProvider>

  const { theme, setTheme } = useTheme();
  ```
* **Features:**

  * Persists theme in `localStorage`
  * Applies theme to `<html>` element
  * Supports system theme detection

---

### **3. `useToast` & `toast`**

**File:** `hooks/use-toast.ts`
Implements a global toast notification system.

* **useToast:** Get the current toast list and helper functions.
* **toast:** Trigger toasts from anywhere in the app.
* **Usage:**

  ```tsx
  const { toast } = useToast();
  toast({ title: "Success!", description: "Message sent." });
  ```
* **Features:**

  * One active toast at a time
  * Auto-dismiss & custom actions
  * Accessible across the application

---

## 🛠 Utilities

### **1. `cn`**

**File:** `lib/utils.ts`
Merges and conditionally applies CSS classes using `clsx` + `tailwind-merge`.

* **Usage:**

  ```tsx
  <div className={cn("p-4", isActive && "bg-blue-500")} />
  ```

---

### **2. `queryClient` & `apiRequest`**

**File:** `lib/queryClient.ts`
Manages API calls and data caching using React Query.

* **apiRequest:** Standardized API request function with error handling.
* **queryClient:** Pre-configured React Query client.
* **getQueryFn:** Custom query function with 401 handling.
* **Usage:**

  ```typescript
  import { queryClient, apiRequest } from "../lib/queryClient";
  ```
* **Features:**

  * Centralized API logic
  * Handles authentication errors
  * Default query/mutation configurations

---

## 📜 Types

**File:** `schema/schema.ts`
Defines TypeScript types for core chat entities:

* **User** – Profile info and status
* **Room** – Chat room/group metadata
* **Message** – Message content, sender, status
* **AuthPayload** – Authentication response data
# 🌞 Daily Motivation Dashboard

A modern React + Vite web app that displays inspirational quotes and lets users save their favorite quotes using local storage.

---

## 📌 Project Overview

The **Daily Motivation Dashboard** is a single-page React application that:

* Fetches motivational quotes from an external API
* Allows users to save (like) quotes
* Stores saved quotes in the browser using **localStorage**
* Persists saved quotes even after page refresh
* Provides a clean, responsive UI

This project demonstrates practical use of:

* React Hooks (`useState`, `useEffect`)
* API integration
* Local storage persistence
* Component state management

---

## ✨ Features

✅ Fetch random motivational quotes
✅ Save & remove quotes from collection
✅ Persistent storage using `localStorage`
✅ Responsive layout with sidebar
✅ Toast notifications for actions
✅ Loading states & fallback quotes

---

## 🛠️ Tech Stack

* **Frontend:** React (Vite)
* **Language:** JavaScript (ES6+)
* **Styling:** CSS
* **Build Tool:** Vite
* **API Used:** Quotable API

---

## 🌐 API Used

### Quotable API

**Endpoint:**

```
https://api.quotable.io/random
```

**Purpose:**
Fetches a random motivational quote.

**Sample Response:**

```json
{
  "_id": "abc123",
  "content": "Success is not final, failure is not fatal.",
  "author": "Winston Churchill"
}
```

**Usage in Project:**

* Fetch quote using `fetch()`
* Display quote content and author
* Store quote ID for saving/removing

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/daily-motivation-dashboard.git
cd daily-motivation-dashboard
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run Development Server

```bash
npm run dev
```

Open in browser:

```
http://localhost:5173
```

---

## 📂 Project Structure

```
daily-motivation-dashboard
├── public
├── src
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 💾 Local Storage Implementation

Saved quotes are stored using:

```js
localStorage.setItem('dailyMotivationLiked_v2', JSON.stringify(likedQuotes));
```

This ensures:

* Quotes persist after refresh
* Data is loaded on app start

---

## 🎓 Learning Outcomes

This project helped demonstrate:

* React state & lifecycle management
* API integration in frontend apps
* Data persistence using localStorage
* Modern frontend tooling with Vite
* UI/UX best practices

---

## 📸 Screenshots (Optional)

*Add screenshots here before submission.*

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Author

**Dhairya Maru**
College Submission Project — 2026

---

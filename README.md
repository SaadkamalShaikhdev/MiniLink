# 🔗 MiniLink – Smart URL Shortener

MiniLink is a modern URL shortener built with Next.js that allows users to shorten long URLs and track link analytics.  
If a user is signed in, they can view total click counts for their shortened links through a personal dashboard.

---

## 🌍 Live Demo

👉 https://mini-link-five.vercel.app/

---

## 🚀 Features

- 🔗 Instantly shorten long URLs
- 👤 Secure authentication with NextAuth
- 📊 Track total clicks (for logged-in users)
- 📈 User dashboard for managing links
- 🔔 Beautiful alerts using SweetAlert2
- ⚡ Fast performance with Next.js 16 & React 19
- 📊 Integrated Vercel Analytics
- 🗄️ MongoDB database with Mongoose

---

## 🛠️ Tech Stack

- **Next.js 16**
- **React 19**
- **NextAuth.js**
- **MongoDB + Mongoose**
- **Vercel Analytics**
- **Lucide React**
- **React Hot Toast**
- **SweetAlert2**

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/SaadkamalShaikhdev//MiniLink.git
cd minilink
```

Install dependencies:

```bash
npm install
```

---

## 🧪 Run Locally

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🔐 How It Works

### 🔗 URL Shortening
1. User enters a long URL.
2. MiniLink generates a unique short slug.
3. The short link redirects to the original URL.

### 📊 Click Tracking (Signed-in Users Only)
- Each click is stored in the database.
- Logged-in users can see total clicks in their dashboard.
- Non-logged-in users can still use shortened links, but analytics are not saved.

---

## 📁 Project Structure

```
app/
 ├── page.js
 ├── dashboard/
 ├── api/
components/
models/
lib/
```

---

## 🚀 Deployment

MiniLink is deployed on **Vercel**:

👉 https://mini-link-five.vercel.app/

---

## 🎯 Future Improvements

- Custom short URLs
- QR code generation
- Advanced analytics (device, country, IP)
- Link expiration
- Public API support

---

## 👨‍💻 Author

**SaadKamal**

Full Stack Developer passionate about building scalable and modern web applications.

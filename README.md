# 🚀 ByteVault API

**ByteVault** is a secure file storage API built with Node.js, Express, Prisma, PostgreSQL, and Cloudinary. It provides authenticated users with the ability to upload, store, and securely download files from the cloud, with full API documentation and testing support.

---

## 🧠 Overview

ByteVault is designed as a backend service that mimics core functionality of cloud storage systems. It focuses on:

* Secure file handling
* Scalable cloud storage
* Clean API architecture
* Strong authentication & authorization

---

## ✨ Features

* 🔐 User Authentication (JWT + Refresh Tokens)
* 📤 File Upload (Cloudinary integration)
* 📥 Secure File Download (authorized access only)
* 📄 File Metadata Storage (PostgreSQL via Prisma)
* 🛡️ Authorization (users can only access their own files)
* 📚 API Documentation (Swagger UI)
* 🧪 Testing (Jest + Supertest)
* 🪵 Logging (Winston)
* ✅ Request Validation (Zod)

---

## 🏗️ Tech Stack

* **Backend:** Node.js, Express
* **Database:** PostgreSQL (Neon)
* **ORM:** Prisma
* **Authentication:** JWT + Refresh Tokens
* **Cloud Storage:** Cloudinary
* **Testing:** Jest, Supertest
* **Documentation:** Swagger

---

## 🌐 Live API

Base URL:

```
https://bytevault-8033.onrender.com
```

---

## 📡 API Routes

### 🔐 Auth Routes

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
```

---

### 📁 File Routes

```
POST   /file/v1/upload
GET    /file/v1/:fileId/download
```

---

### 📚 API Docs

```
GET /api-docs
```

Swagger UI available for exploring endpoints interactively.

---

## 🔐 Authentication

Protected routes require:

```
Authorization: Bearer <access_token>
```

---

## 📥 File Download Flow

1. User sends request to download endpoint
2. Server verifies JWT
3. Server checks file ownership
4. Signed URL is generated via Cloudinary
5. User is redirected to securely download the file

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/bytevault-api.git
cd bytevault-api
```

---

### 2. Install dependencies

```
npm install
```

---

### 3. Setup environment variables

Create a `.env` file:

```
DATABASE_URL=your_postgres_url

JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### 4. Run migrations

```
npx prisma migrate dev
npx prisma generate
```

---

### 5. Start the server

```
node server.js
```

---

## 🧪 Testing

Run unit and integration tests:

```
npm test
```

---

## 📂 Project Structure

```
src/
 ├── modules/
 │    ├── auth/
 │    └── file/
 ├── config/
 ├── middleware/
 ├── utils/
 └── app.js
```

---

## 📸 Suggested Screenshots (for your GitHub)

Add these to improve your repo:

* Swagger API Docs (`/api-docs`)
* Successful file upload response
* Database (Prisma Studio showing stored files)
* Cloudinary dashboard (uploaded files)
* Download request working

---

## 🚀 Future Improvements

* 🔗 File sharing with expiring links
* 🗑️ File deletion endpoint
* 📂 File listing per user
* 🔐 Private file storage with strict access control
* 📊 Rate limiting & monitoring

---

## 🎯 Purpose

This project was built as a **portfolio project** to demonstrate:

* Backend architecture design
* Secure file handling
* Cloud integration
* API development best practices

---

## 📬 Contact

Feel free to connect or reach out for collaboration.

---

## ⭐ If you found this useful

Give it a star ⭐ on GitHub

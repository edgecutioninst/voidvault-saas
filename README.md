**An AI-powered media processing SaaS that enables creators to securely upload, compress, transform, and share images and videos through a modern cloud-native workflow.**

<p align="center">
  <a href="https://voidvault-saas.vercel.app/"><strong>🚀 Live Demo</strong></a>
</p>

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,postgres,prisma,vercel&theme=dark" />
</p>

---

# Overview

VoidVault is a cloud-based media management platform built for creators who frequently work with images and videos.

The application combines AI-powered media transformations with secure cloud storage, allowing users to upload files, compress videos, resize media for social platforms, and generate shareable public links—all from a single dashboard.

Rather than processing large media files on the application server, VoidVault utilizes a serverless cloud processing pipeline powered by Cloudinary, resulting in faster uploads, lower server costs, and significantly improved scalability.

---

# ✨ Features

## 📂 Secure Personal Vault

Every authenticated user receives a private media vault protected through Clerk Authentication and Prisma-based ownership validation.

Features include:

- Secure authentication
- User-isolated media storage
- Protected dashboard
- Personal upload history

---

## 🖼️ AI Image Transformation

Automatically optimize images for multiple social media platforms using Cloudinary's AI-powered gravity detection.

Supported formats include:

- Instagram
- Facebook
- LinkedIn
- Square (1:1)
- Landscape (16:9)
- Portrait

AI automatically preserves the most important subject during cropping.

---

## 🎥 AI Video Processing

Process uploaded videos directly from the browser.

Capabilities include:

- Video compression
- AI-powered video cropping
- Multiple aspect ratios
- Cloud-based processing
- High-quality output

Since processing occurs on Cloudinary's infrastructure, large videos never pass through the application server.

---

## 🔗 Public Video Sharing

Generate public viewing links for uploaded videos with a single click.

Recipients can watch shared videos directly in the browser without requiring an account or authentication, making media distribution quick and frictionless.

---

## ⚡ Serverless Media Pipeline

Large media files are uploaded directly to Cloudinary rather than passing through a traditional backend server.

Benefits include:

- Faster uploads
- Lower server memory usage
- Reduced infrastructure costs
- Improved scalability

---

## 🔐 Secure Access Control

Security is enforced throughout the application.

Includes:

- Clerk Authentication
- Route middleware protection
- User ownership validation
- Protected media access

---

# 📸 Screenshots

## Dashboard

<img width="1919" height="878" alt="Screenshot 2026-07-18 232716" src="https://github.com/user-attachments/assets/b3ec3ae7-ccd6-41be-aa79-22c44a6f36a6" />


Personal media dashboard displaying uploaded images and videos.

---

## AI Image Cropper

<img width="1919" height="877" alt="Screenshot 2026-07-18 232931" src="https://github.com/user-attachments/assets/b7418e6a-4ceb-411d-a080-3ecc3ae25bd4" />

Automatically resize media into multiple social media formats while preserving the primary subject.

---

## Video Compression

<img width="1919" height="884" alt="Screenshot 2026-07-18 232800" src="https://github.com/user-attachments/assets/06f43933-fbca-40e0-97c5-7b7e69138635" />

Cloud-based video compression with minimal quality loss.


## Video Cropper:

<img width="1919" height="865" alt="Screenshot 2026-07-18 232906" src="https://github.com/user-attachments/assets/f51b12f9-ba55-4334-bdb8-a656822e50d5" />


Resize Videos into multiple social media formats while preserving the primary subject.

---

# 🛠 Tech Stack

### Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- DaisyUI

### Backend

- Next.js API Routes
- Prisma ORM
- PostgreSQL

### Authentication

- Clerk

### Cloud Services

- Cloudinary AI
- Cloudinary Video Processing

### Deployment

- Vercel

---

# 🏗️ Architecture

```text
            User
              │
              ▼
       Next.js Frontend
              │
      Authentication (Clerk)
              │
       Protected Dashboard
              │
     ┌────────┴────────┐
     ▼                 ▼
PostgreSQL         Cloudinary
     │                 │
     │         AI Processing
     │                 │
     └────────┬────────┘
              ▼
      Processed Media
              │
      Public Sharing
```

---

# 💡 Engineering Highlights

## Privacy-First Architecture

Unlike many media applications, every query is scoped directly to the authenticated user's Clerk ID.

This prevents horizontal privilege escalation and guarantees complete separation between user vaults.

---

## Direct-to-Cloud Upload Pipeline

Instead of routing uploads through the application server, media is uploaded directly to Cloudinary.

This architecture minimizes server load while dramatically improving upload speed and scalability.

---

## AI Media Transformation

Cloudinary's AI gravity detection automatically identifies important subjects—such as faces or objects—and intelligently crops media for different aspect ratios without manual adjustment.

---

## Shareable Public Media

Uploaded videos can be shared through dynamically generated public URLs.

The application validates media ownership during creation while allowing anonymous users to access only explicitly shared content.

---

# 🚀 Running Locally

## Clone Repository

```bash
git clone https://github.com/edgecutioninst/SAAS.git

cd voidvault-saas
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

```env
DATABASE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/home
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/home
```

---

## Initialize Database

```bash
npx prisma generate

npx prisma db push
```

---

## Start Development Server

```bash
npm run dev
```

---

# 🎯 Design Goals

VoidVault explores how modern cloud infrastructure can simplify media management by combining secure authentication, AI-powered transformations, and serverless media processing into a single application.

The project focuses on:

- scalable media workflows
- cloud-native architecture
- secure user isolation
- AI-assisted media processing
- modern SaaS design

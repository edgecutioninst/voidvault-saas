
# VoidVault

**VoidVault** is a high-performance, minimalist media processing SaaS designed for content creators. It leverages AI for automated social media image resizing and provides secure, user-isolated video storage and compression.

---

### Key Features

* **Secure Private Vaults**: Complete user data isolation using Clerk Auth and Prisma relational mapping, ensuring users can only access their own uploads.
* **AI-Powered Social Resizing**: Automated image cropping for Instagram, LinkedIn, and Facebook using Cloudinary’s AI-gravity engine to maintain focus on the subject.
* **Smart Video Compression**: Reduces video file sizes by up to 80% using server-side processing while maintaining visual quality.
* **Minimalist Interface**: A premium, pitch-black UI built with Tailwind CSS and DaisyUI for a focused, high-contrast experience.
* **Middleware Protection**: Robust authentication guards on all processing routes to prevent unauthorized API access.

---

### Tech Stack

* **Frontend**: Next.js 15 (App Router), Tailwind CSS, DaisyUI
* **Authentication**: Clerk Auth
* **Database**: PostgreSQL via Prisma ORM
* **Media Processing**: Cloudinary AI
* **Backend Logic**: Next.js API Routes and Middleware

---

### Engineering Highlights

#### Privacy-First Architecture
Unlike standard tutorial projects, VoidVault implements a strict **User Isolation Layer**. Database queries are scoped directly to the Clerk `userId`, preventing horizontal privilege escalation and ensuring that every user's "Vault" remains mathematically private.

#### AI-Gravity Integration
The Social Media Creator tool utilizes Cloudinary’s `g_auto` (gravity auto) parameter. This allows the application to intelligently detect the most interesting area of an image—such as a face or object—and center the crop perfectly for different aspect ratios without manual adjustment.

---

### Getting Started

#### Prerequisites
* Node.js 18+
* PostgreSQL Database (e.g., Supabase or local instance)
* Clerk and Cloudinary API Credentials

#### Installation

1. **Clone the repository**
   ```bash
         git clone [https://github.com/edgecutioninst/SAAS.git](https://github.com/edgecutioninst/SAAS.git)
         cd SAAS
   ```

2. **Install dependencies**
  ```bash
       npm install
  ```


3. **Configure environment variables Create a .env file in the root directory: **
  ```bash
      DATABASE_URL="your_postgresql_url"
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_key"
      CLERK_SECRET_KEY="your_clerk_secret"
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
      CLOUDINARY_API_KEY="your_api_key"
      CLOUDINARY_API_SECRET="your_api_secret"
      NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/home
      NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/home
  ```

4. **Initialize Database**
    ```bash
        npx prisma generate
        npx prisma db push
    ```

    
5. **Run development server**
```bash 
     npm run dev
```

<div align="center">
  <img src="public/logo/CVCraft_logo.png" alt="CVCraft Logo" width="200" />

  <h1>CVCraft</h1>

  <p><strong>A Free, Open-Source Resume Builder Built with Passion</strong></p>

  <p>Create professional resumes in minutes. No ads, no tracking, no hidden costs—just a powerful tool that works for you.</p>

  <p>
    <a href="https://cvcraft.app"><strong>Try CVCraft</strong></a>
    ·
    <a href="#features"><strong>Features</strong></a>
    ·
    <a href="#quick-start"><strong>Quick Start</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/version-1.0.0.0-blue?style=flat-square" alt="Version">
    <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
    <img src="https://img.shields.io/badge/made%20with-❤️-red?style=flat-square" alt="Made with Love" />
  </p>
</div>

---

## 🎯 Why CVCraft?

CVCraft was built from the ground up with one mission: **to provide a powerful, free, and privacy-focused resume builder for everyone**. 

Unlike other resume builders that bombard you with ads, track your every move, or lock features behind paywalls, CVCraft is:

- ✅ **100% Free Forever** — No premium tiers, no subscriptions, no hidden costs
- ✅ **Privacy-First** — Your data is yours. No tracking, no selling, no compromises
- ✅ **Open Source** — Transparent code you can inspect, modify, and self-host
- ✅ **No Ads** — Clean, distraction-free experience
- ✅ **Feature-Complete** — Everything you need, nothing you don't

## ✨ Features

### 🎨 **Beautiful Templates**
Choose from **12+ professionally designed templates** that look great on any device. Each template is fully customizable with:
- Custom colors, fonts, and spacing
- A4 and Letter page formats
- Advanced CSS customization support
- Real-time preview as you type

### 🚀 **Powerful Editor**
- **Drag-and-drop** section ordering
- **Rich text editor** with formatting support
- **AI-powered content generation** (OpenAI, Google Gemini, Anthropic Claude)
- **Custom sections** for any content type
- **Real-time preview** — see changes instantly

### 🔒 **Privacy & Security**
- **Self-hosting ready** — Deploy on your own infrastructure with Docker
- **Email 2FA** — Secure your account with two-factor authentication
- **No tracking** — We don't collect analytics or sell your data
- **Data ownership** — Export or delete your data anytime

### 🌍 **Global & Accessible**
- **50+ languages** supported
- **Dark mode** for comfortable editing
- **Responsive design** — works on desktop, tablet, and mobile
- **Keyboard shortcuts** for power users

### 📤 **Export & Share**
- **High-quality PDF export** — Perfect for printing or digital submission
- **JSON export** — Compatible with JSON Resume format
- **Public sharing** — Share your resume with a unique URL
- **Password protection** — Secure your shared resumes

### 🛠️ **Developer-Friendly**
- **REST API** — Programmatic access to your resumes
- **Self-hosting** — Full control over your deployment
- **Open source** — Contribute, customize, or learn from the code

## 📸 Templates Showcase

<table>
  <tr>
    <td align="center">
      <img src="public/templates/jpg/azurill.jpg" alt="Azurill" width="150" />
      <br /><sub><b>Azurill</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/jpg/bronzor.jpg" alt="Bronzor" width="150" />
      <br /><sub><b>Bronzor</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/jpg/chikorita.jpg" alt="Chikorita" width="150" />
      <br /><sub><b>Chikorita</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/jpg/ditto.jpg" alt="Ditto" width="150" />
      <br /><sub><b>Ditto</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="public/templates/jpg/gengar.jpg" alt="Gengar" width="150" />
      <br /><sub><b>Gengar</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/jpg/glalie.jpg" alt="Glalie" width="150" />
      <br /><sub><b>Glalie</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/jpg/kakuna.jpg" alt="Kakuna" width="150" />
      <br /><sub><b>Kakuna</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/jpg/lapras.jpg" alt="Lapras" width="150" />
      <br /><sub><b>Lapras</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="public/templates/jpg/leafish.jpg" alt="Leafish" width="150" />
      <br /><sub><b>Leafish</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/jpg/onyx.jpg" alt="Onyx" width="150" />
      <br /><sub><b>Onyx</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/jpg/pikachu.jpg" alt="Pikachu" width="150" />
      <br /><sub><b>Pikachu</b></sub>
    </td>
    <td align="center">
      <img src="public/templates/jpg/rhyhorn.jpg" alt="Rhyhorn" width="150" />
      <br /><sub><b>Rhyhorn</b></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="public/templates/jpg/ditgar.jpg" alt="Ditgar" width="150" />
      <br /><sub><b>Ditgar</b></sub>
    </td>
  </tr>
</table>

## 🚀 Quick Start

### Option 1: Use the Hosted Version
Simply visit [cvcraft.app](https://cvcraft.app) and start building your resume immediately. No installation required!

### Option 2: Run Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/cvcraft.git
cd cvcraft

# Install dependencies
npm install
# or
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase and database configuration

# Run database migrations
npm run db:migrate
# or
pnpm run db:migrate

# Start development server
npm run dev
# or
pnpm run dev

# Open your browser
# Navigate to http://localhost:3000
```

### Option 3: Self-Host with Docker

```bash
# Clone the repository
git clone https://github.com/yourusername/cvcraft.git
cd cvcraft

# Configure environment
cp .env.example .env
# Edit .env with your production settings

# Start with Docker Compose
docker-compose up -d

# Access your instance
# Navigate to http://your-domain.com
```

For detailed self-hosting instructions, see the [Self-Hosting Guide](#self-hosting).

## 🔐 Authentication System

CVCraft uses a robust authentication system powered by **Supabase Auth** with custom integration:

### Features
- **Email/Password Authentication** — Secure user registration and login
- **Password Reset Flow** — Email-based password recovery
- **Session Management** — Secure JWT-based sessions
- **Two-Factor Authentication (2FA)** — Optional email-based 2FA for enhanced security
- **Passkey Support** — Modern passwordless authentication
- **Social Login** — Link GitHub, Google, and other OAuth providers

### Architecture
- **Supabase Auth** — Handles authentication and session management
- **Custom Adapter** — Integrates Supabase with Drizzle ORM for seamless database operations
- **Row-Level Security (RLS)** — PostgreSQL policies ensure users can only access their own data
- **Secure Password Hashing** — Industry-standard bcrypt with salt rounds

### Environment Setup
To enable authentication, configure these environment variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_postgresql_connection_string
```

## 🏗️ Tech Stack

CVCraft is built with modern, cutting-edge technologies:

| Category         | Technology                           |
| ---------------- | ------------------------------------ |
| **Framework**    | TanStack Start (React 19, Vite)      |
| **Runtime**      | Node.js                              |
| **Language**     | TypeScript                           |
| **Database**     | PostgreSQL with Drizzle ORM          |
| **Auth**         | Supabase Auth + Custom Adapter       |
| **API**          | ORPC (Type-safe RPC)                 |
| **Styling**      | Tailwind CSS                         |
| **UI**           | Radix UI + Custom Components         |
| **State**        | Zustand + TanStack Query             |
| **PDF**          | Headless Chromium (Printer Service)  |

## 🐳 Self-Hosting

CVCraft is designed to be easily self-hosted. You'll need:

### Requirements
- **PostgreSQL** — Database for storing user data and resumes
- **Supabase** — Authentication and user management (or self-hosted Supabase)
- **Printer Service** — Headless Chromium for PDF generation
- **S3-compatible storage** (optional) — For file uploads (e.g., AWS S3, MinIO)

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cvcraft

# Supabase Auth
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: AI Integration
OPENAI_API_KEY=your_openai_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
ANTHROPIC_API_KEY=your_claude_key

# Optional: Storage
STORAGE_URL=your_s3_endpoint
STORAGE_ACCESS_KEY=your_access_key
STORAGE_SECRET_KEY=your_secret_key
```

### Docker Compose Setup

The easiest way to self-host is using Docker Compose:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: cvcraft
      POSTGRES_USER: cvcraft
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  cvcraft:
    image: cvcraft/cvcraft:latest
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://cvcraft:your_password@postgres:5432/cvcraft
      # Add other environment variables
    depends_on:
      - postgres

  printer:
    image: cvcraft/printer:latest
    environment:
      # Printer service configuration

volumes:
  postgres_data:
```

For complete self-hosting documentation, visit the [Self-Hosting Guide](docs/self-hosting).

## 📚 Documentation

| Topic                    | Description                                    |
| ------------------------ | ---------------------------------------------- |
| **Getting Started**      | First-time setup and basic usage               |
| **Templates Guide**      | How to choose and customize templates          |
| **AI Integration**       | Set up AI-powered content generation           |
| **Self-Hosting**         | Deploy CVCraft on your own infrastructure      |
| **API Documentation**    | Use the REST API for programmatic access       |
| **Development Guide**    | Contribute to CVCraft development              |

## 🤝 Contributing

CVCraft is open source, and contributions are welcome! Whether you're fixing a bug, adding a feature, or improving documentation, your help is appreciated.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Setup

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env

# Run database migrations
pnpm run db:migrate

# Start development server
pnpm run dev
```

## 💖 Support the Project

CVCraft is **100% free** and will always remain that way. If it has helped you land a job or saved you time, consider supporting its continued development:

- ⭐ **Star this repository** — It helps others discover CVCraft
- 🐛 **Report bugs** — Help improve the app for everyone
- 💡 **Suggest features** — Share your ideas for new functionality
- 📖 **Improve documentation** — Make it easier for others to use
- 🌍 **Help with translations** — Make CVCraft accessible to more people

## 📄 License

CVCraft is open source software licensed under the [MIT License](./LICENSE).

You are free to:
- ✅ Use it commercially
- ✅ Modify it
- ✅ Distribute it
- ✅ Use it privately

---

<div align="center">
  <p><strong>Made with ❤️ by Vincent Adam</strong></p>
  <p>CVCraft v1.0.0.0</p>
  <p>
    <a href="https://cvcraft.app">Website</a>
    ·
    <a href="https://github.com/yourusername/cvcraft/issues">Report Bug</a>
    ·
    <a href="https://github.com/yourusername/cvcraft/issues">Request Feature</a>
  </p>
</div>

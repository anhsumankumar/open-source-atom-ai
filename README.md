<div align="center">
  <h1>⚛️ ATOM v2.0 - Open Source Engineering AI Companion</h1>
  <p><i>Your personal, open-source AI assistant built for engineers, developers, and students.</i></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/NVIDIA_AI-Enabled-76B900?style=for-the-badge&logo=nvidia" alt="NVIDIA" />
  </p>
</div>

<br />

## 🌟 Overview
ATOM is a state-of-the-art, premium AI Engineering Companion. Designed with an incredibly aesthetic and responsive UI, ATOM helps you solve complex problems, explain tough concepts, summarize dense engineering notes, and generate intelligent code using the power of **NVIDIA's advanced LLMs (Nemotron, Llama 3, Mixtral)**.

## ✨ Features
- 🎨 **Premium Aesthetic UI:** A beautifully designed interface with glassmorphism, dynamic floating background effects, and a buttery-smooth dark/light mode toggle.
- 🧠 **NVIDIA AI Powered:** Integrated natively with NVIDIA's inference API for lightning-fast reasoning and problem-solving.
- 🌙 **Interactive Theme Rope:** Experience the most satisfying Dark Mode switch with a custom-built, physics-based draggable rope.
- 🔒 **Data Privacy Built-in:** Fully functional Privacy and Terms modals with clear data management rules.
- 📱 **Fully Responsive:** Flawless experience across desktop, tablet, and mobile devices.
- 🔐 **Supabase Authentication:** Secure, seamless Google OAuth login flow.

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine. You will also need API keys from Supabase and NVIDIA.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anhsumankumar/open-source-atom-ai.git
   cd open-source-atom-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   NVIDIA_API_KEY=your_nvidia_api_key
   ```

4. **Run the development server:**
   Because ATOM uses a serverless backend proxy (Netlify Functions) to hide the NVIDIA API key securely, you should run it using the Netlify CLI:
   ```bash
   npm run dev
   ```
   *Note: If you don't have Netlify CLI installed, run `npm install netlify-cli -g` first, then run `netlify dev`.*

## 🏗️ Architecture
- **Frontend:** React + TypeScript + Vite
- **Styling:** Vanilla CSS (Custom Design System with floating animations)
- **Backend Proxy:** Netlify Functions (`netlify/functions/chat.ts`)
- **Authentication:** Supabase
- **Icons:** Lucide React

## 👨‍💻 Developed By
Designed & Built with ❤️ by **Anshuman Kumar**
- [GitHub](https://github.com/anhsumankumar)
- [Portfolio](https://anshumansprotfolio.netlify.app/)
- [Instagram](https://www.instagram.com/anshumankumar0007/)

## 📝 License
This project is Open Source. Feel free to fork, modify, and use it for your engineering journey!
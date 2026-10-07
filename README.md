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

## 📸 App Gallery

<div align="center">
  <img src="./Sample%20Images/Login_screen.png" alt="ATOM Login Screen" width="100%" style="border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" />
  <p><i>The beautifully crafted, interactive Login Screen with dynamic floating backgrounds.</i></p>
</div>

<br/>

<div align="center">
  <table style="width: 100%;">
    <tr>
      <th align="center">☀️ Engineering Mode (Light)</th>
      <th align="center">🌙 Focus Mode (Dark)</th>
    </tr>
    <tr>
      <td><img src="./Sample%20Images/light_mode.png" alt="Light Mode" width="100%" style="border-radius: 8px;" /></td>
      <td><img src="./Sample%20Images/dark_mode.png" alt="Dark Mode" width="100%" style="border-radius: 8px;" /></td>
    </tr>
  </table>
  <p><i>Toggle seamlessly between themes using the custom physics-based mechanical rope switch!</i></p>
</div>

---

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
   💡 *Note: You can get your free NVIDIA API key by signing up at [build.nvidia.com](https://build.nvidia.com/).*  
   This free API key gives you instant access to run the world's most powerful open-source models, including:
   - **NVIDIA Nemotron 4 340B** (Top-tier reasoning & logic)
   - **Meta Llama 3.1 (405B, 70B, 8B)**
   - **Mistral (Large, Mixtral 8x22B)**
   - **Google Gemma 2**
   - **Microsoft Phi-3**

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

<br />

<div align="center">
  <sub>
    <b>Tags:</b> #React #TypeScript #AI #NVIDIA #Nemotron #Engineering #StudentCompanion #LLM #OpenSource #Vite #Supabase
  </sub>
</div>
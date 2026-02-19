# AirDraw Pro - Web Application

A beautiful, modern web-based air drawing application with glassmorphism UI, powered by AI hand tracking.

![AirDraw Pro](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![MediaPipe](https://img.shields.io/badge/MediaPipe-Hands-orange?style=flat-square)

## Features

- **Hand Tracking** - Real-time hand detection using MediaPipe
- **Multiple Colors** - Beautiful color palette to choose from
- **Drawing Tools** - Pen and eraser with adjustable brush size
- **Glassmorphism UI** - Modern, sleek iPhone-style design
- **Smooth Animations** - Framer Motion powered animations
- **Responsive** - Works on desktop and mobile devices
- **Save & Download** - Export your drawings as PNG

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Webcam

### Installation

```bash
# Navigate to web-app directory
cd web-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. **Allow Camera Access** - Grant permission when prompted
2. **Draw** - Use your RIGHT hand, point index finger to draw on canvas
3. **Erase** - Open your LEFT hand palm to erase (entire hand must be visible)
4. **Change Colors** - Select from the color palette in the side panel
5. **Adjust Size** - Use +/- buttons to change brush size
6. **Save Drawing** - Click download button to save as PNG

## Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/air-draw-web)

### Manual Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/air-draw-web.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Configure (Optional)**
   - Set environment variables if needed
   - Configure custom domain

### Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from web-app directory)
cd web-app
vercel

# Deploy to production
vercel --prod
```

## Project Structure

```
web-app/
├── src/
│   └── app/
│       ├── globals.css      # Global styles with glassmorphism
│       ├── layout.tsx       # Root layout
│       ├── page.tsx         # Landing page
│       └── draw/
│           └── page.tsx     # Drawing canvas page
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── vercel.json              # Vercel deployment config
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Hand Tracking**: MediaPipe Hands
- **Icons**: Lucide React

## Performance Tips

- Use good lighting for better hand detection
- Keep hands within camera frame
- Steady movements produce smoother lines
- Clear background helps with tracking accuracy

## Troubleshooting

### Camera not working?
- Ensure browser has camera permissions
- Try a different browser (Chrome recommended)
- Check if another app is using the camera

### Hand not detected?
- Improve lighting conditions
- Keep hand fully visible in frame
- Wait for model to fully load

### Laggy performance?
- Close other browser tabs
- Use Chrome for best performance
- Reduce video quality if needed

## License

MIT License - feel free to use for personal or commercial projects.

## Contributing

Contributions welcome! Please read our contributing guidelines.

---

Made for creativity

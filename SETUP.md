# Cricket Career RPG - Setup Guide

## 🚀 Quick Start (Local Development)

### 1. Clone and Install
```bash
git clone https://github.com/miguelhisbon-bit/Cricket-Career-.git
cd Cricket-Career-
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env.local
```

### 3. Add Your Gemini API Key
Edit `.env.local` and add your API key:
```
GEMINI_API_KEY=your-actual-api-key-here
APP_URL=http://localhost:3000
```

Get your Gemini API key from: https://ai.google.dev/

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser

### 5. Start Playing!
- Click "Create Player" to start
- Go to MATCH tab and click "Start Match Now"
- Play the cricket simulation

---

## 🌐 Play Online (GitHub Pages)

Visit: https://miguelhisbon-bit.github.io/Cricket-Career-/

> Note: Online version uses demo features only

---

## 📦 Build for Production
```bash
npm run build
npm run preview
```

---

## 🎮 Game Features

✅ Player Creation
✅ Match Simulation (T5, T10, T20, ODI)
✅ Tournament/League System
✅ Training Camp
✅ Equipment Shop
✅ Career Statistics
✅ Press Conferences
✅ Locker Room Events
✅ Multi-language Support (English/Bengali)
✅ Cloud Save/Restore

---

## 🔧 Troubleshooting

### Build fails with dependencies error
```bash
rm package-lock.json
npm install
npm run build
```

### .env variables not loading
- Make sure `.env.local` file exists in root
- Restart `npm run dev`
- Check variable names match exactly

### Game lag or performance issues
- Clear browser cache
- Try incognito mode
- Check Network tab for API delays

---

## 📝 Development Notes

- Built with React 19 + Vite
- Tailwind CSS for styling
- Gemini AI for dynamic storylines
- LocalStorage for save data
- Mobile-first responsive design

---

## 🎯 Next Steps

1. **Customize** - Modify teams, players in `src/utils/defaultData.ts`
2. **Extend** - Add new match formats in `src/types/cricket.ts`
3. **Deploy** - Push to GitHub, it auto-deploys to Pages

Enjoy! 🏏

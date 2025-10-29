# 🎨 FRONTEND SETUP GUIDE - 3 DASHBOARDS

## 📱 **CHỈ FRONTEND - KHÔNG CẦN BACKEND**

### **🎯 Những gì bạn nhận được:**
- ✅ 3 Dashboard hoàn chỉnh (Admin, Parent, Driver)
- ✅ Responsive design (mobile + desktop)  
- ✅ Modern UI với Tailwind CSS
- ✅ TypeScript + React 19
- ✅ Mock data sẵn có để test
- ✅ Hot reload development

---

## 🚀 **SETUP SIÊU ĐƠN GIẢN:**

### **Prerequisites (chỉ cần 2 cái):**
```bash
# Node.js 18+
https://nodejs.org/

# npm hoặc pnpm  
npm --version
```

### **Chạy Frontend:**
```bash
# Bước 1: Vào thư mục frontend
cd packages/frontend

# Bước 2: Install dependencies  
npm install
# hoặc: pnpm install

# Bước 3: Start dev server
npm run dev
# hoặc: pnpm dev

# ✅ Xong! Mở http://localhost:5173
```

---

## 🎨 **DEMO 3 DASHBOARDS:**

### **🔗 URLs để test:**
```
🏠 Main App:           http://localhost:5173
👑 Admin Dashboard:    Chọn role "Admin" 
👨‍👩‍👧‍👦 Parent Dashboard:   Chọn role "Phụ huynh"
🚗 Driver Dashboard:   Chọn role "Tài xế"
```

### **📱 Features có sẵn:**
- ✅ **Switch role** dễ dàng
- ✅ **Mock data** đầy đủ cho demo
- ✅ **Responsive** mọi màn hình  
- ✅ **Interactive components**
- ✅ **Charts & graphs**
- ✅ **Modern animations**

---

## 🔧 **CUSTOMIZATION:**

### **🎨 Thay đổi màu sắc:**
```javascript
// tailwind.config.js  
theme: {
  colors: {
    primary: '#your-color',
    secondary: '#your-color'
  }
}
```

### **📊 Thay đổi mock data:**
```javascript
// src/contexts/AppDataContext.tsx
// Sửa data mẫu theo ý muốn
```

### **🖼️ Thay đổi logo/images:**
```
// public/vite.svg - Logo
// src/assets/ - Other images
```

---

## 📦 **BUILD FOR PRODUCTION:**

```bash
# Build static files
npm run build

# Preview production build  
npm run preview

# Deploy folder: dist/
# Upload dist/ lên hosting (Vercel, Netlify, etc.)
```

---

## 🆘 **SUPPORT:**

### **Common Issues:**
```bash
# Port 5173 đã dùng
npx kill-port 5173

# Dependencies error
rm -rf node_modules
npm install

# Build error
npm run lint
```

### **File Structure:**
```
packages/frontend/
├── src/
│   ├── components/
│   │   ├── dashboard/        # 3 dashboards here!
│   │   ├── management/       # CRUD components  
│   │   ├── layout/          # Header, Sidebar
│   │   └── shared/          # Reusable components
│   ├── contexts/            # State management
│   └── services/            # API calls (mock mode)
└── dist/                    # Build output
```

**🎯 Focus vào `src/components/dashboard/` - đây là 3 dashboards chính!**

Happy coding! 🚀
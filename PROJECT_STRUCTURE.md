# 📂 Project Structure - Smart School Bus Tracking System

Dự án này gồm 2 phần chính: **Frontend (React)** và **Backend (Node.js/Express)**. Ngoài ra có thư mục tài liệu (`docs/`) và tùy chọn mobile app.

---

## 1. Thư mục gốc
```text
smart-school-bus-tracking/
├── docs/
├── frontend/
├── backend/
├── mobile/ (optional)
├── docker-compose.yml
├── README.md
└── .gitignore
```

- **docs/**: chứa tài liệu UML, yêu cầu, thiết kế, kiến trúc.  
- **frontend/**: ứng dụng giao diện người dùng (React + Vite).  
- **backend/**: API server (Node.js + Express + Socket.io).  
- **mobile/**: nếu triển khai app mobile bằng React Native (tùy chọn).  
- **docker-compose.yml**: cấu hình chạy DB + backend + frontend bằng Docker.  
- **README.md**: mô tả dự án, hướng dẫn cài đặt.  
- **.gitignore**: khai báo file/thư mục bỏ qua khi commit Git.  

---

## 2. Thư mục `docs/`
```text
docs/
├── requirements.md
└── design/
    ├── usecase-diagram.png
    ├── class-diagram.png
    └── deployment-diagram.png
```

- **requirements.md**: liệt kê yêu cầu chức năng & phi chức năng.  
- **design/**: lưu sơ đồ UML & thiết kế.  
  - `usecase-diagram.png`: sơ đồ Use Case tổng quan.  
  - `class-diagram.png`: sơ đồ lớp cho module Bus Schedule & Tracking.  
  - `deployment-diagram.png`: sơ đồ triển khai.  

---

## 3. Thư mục `frontend/` (React + Vite)
```text
frontend/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── context/
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

- **public/index.html**: file HTML gốc, React sẽ được mount vào đây.  
- **src/assets/**: ảnh, icon, CSS toàn cục.  
- **src/components/**: component dùng lại nhiều lần (Button, Navbar, Map...).  
- **src/pages/**: các trang chính (Login, Dashboard, ParentView, DriverView...).  
- **src/services/**: hàm gọi API tới backend (axios/fetch).  
- **src/hooks/**: custom hooks (vd: `useAuth`, `useFetch`).  
- **src/context/**: React Context để quản lý state toàn cục.  
- **src/App.jsx**: root component định nghĩa route/layout.  
- **src/main.jsx**: entry point để render `<App />` vào DOM.  
- **package.json**: dependencies cho frontend.  
- **vite.config.js**: cấu hình build/dev cho Vite.  

---

## 4. Thư mục `backend/` (Node.js + Express)
```text
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── package.json
└── .env.example
```

- **src/config/**: cấu hình DB, JWT secret, logger.  
- **src/controllers/**: hàm xử lý request (vd: `busController.js`, `authController.js`).  
- **src/models/**: định nghĩa dữ liệu (schema cho User, Driver, Bus, Schedule).  
- **src/routes/**: định nghĩa endpoint API (`/api/bus`, `/api/auth`).  
- **src/services/**: business logic (theo dõi xe, phân công lịch, gửi notification).  
- **src/utils/**: hàm tiện ích (validate input, format date...).  
- **src/app.js**: khởi tạo Express app, middleware, routes.  
- **src/server.js**: chạy server, lắng nghe cổng.  
- **package.json**: dependencies cho backend (express, socket.io...).  
- **.env.example**: file mẫu biến môi trường (`DB_URI`, `PORT`...).  

---

## 5. Thư mục `mobile/` (tuỳ chọn – React Native/Expo)
```text
mobile/
├── App.js
├── package.json
└── src/
    ├── screens/
    ├── components/
    └── services/
```

- **screens/**: màn hình (Login, ParentDashboard, DriverMap...).  
- **components/**: component tái sử dụng.  
- **services/**: gọi API backend.  

---

✅ File này giúp mọi thành viên trong nhóm hiểu rõ **ý nghĩa và cách sử dụng từng file/thư mục** trong dự án.

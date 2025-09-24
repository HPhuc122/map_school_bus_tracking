1. Thư mục gốc (root)

smart-school-bus-tracking/
├── docs/
├── frontend/
├── backend/
├── mobile/ (optional)
├── docker-compose.yml
├── README.md
└── .gitignore

docs/: chứa tài liệu yêu cầu, thiết kế UML, kiến trúc hệ thống.

frontend/: giao diện người dùng (React).

backend/: API server (Node.js + Express).

mobile/: nếu triển khai app mobile bằng React Native (tùy chọn).

docker-compose.yml: cấu hình chạy nhiều dịch vụ (DB, backend, frontend) bằng Docker.

README.md: hướng dẫn tổng quan dự án.

.gitignore: file cấu hình git bỏ qua các thư mục không cần commit (node_modules, build...).

2. Thư mục docs/

docs/
├── requirements.md
└── design/
    ├── usecase-diagram.png
    ├── class-diagram.png
    └── deployment-diagram.png

requirements.md: liệt kê yêu cầu chức năng & phi chức năng.

design/: chứa sơ đồ UML, kiến trúc.

    usecase-diagram.png: sơ đồ Use Case tổng quan.

    class-diagram.png: sơ đồ lớp cho module Bus Schedule & Tracking.

    deployment-diagram.png: sơ đồ triển khai hệ thống.

3. Thư mục frontend/ (React + Vite)

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

public/index.html: file HTML gốc, nơi React mount vào.

src/assets/: ảnh, icon, CSS toàn cục.

src/components/: các component dùng lại nhiều lần (Navbar, Button, Map…).

src/pages/: các trang chính (Login, Dashboard, ParentView, DriverView…).

src/services/: chứa hàm gọi API tới backend (axios/fetch).

src/hooks/: custom hooks (vd: useAuth, useFetch).

src/context/: React Context quản lý state toàn cục (auth, theme…).

src/App.jsx: root component định nghĩa route/layout.

src/main.jsx: entry point, render <App /> vào DOM.

package.json: khai báo dependencies (React, Vite, axios…).

vite.config.js: cấu hình build/dev cho Vite.

4. Thư mục backend/ (Node.js + Express)

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

src/config/: cấu hình hệ thống (DB, JWT secret, logger).

src/controllers/: hàm xử lý request (vd: busController.js, authController.js).

src/models/: định nghĩa dữ liệu (ORM schema cho User, Bus, Schedule).

src/routes/: định nghĩa endpoint API (/api/bus, /api/auth).

src/services/: business logic (tracking, phân công lịch, gửi notification).

src/utils/: hàm tiện ích (format date, validation…).

src/app.js: khởi tạo Express app, middleware, routes.

src/server.js: start server, lắng nghe cổng.

package.json: khai báo dependencies (express, cors, socket.io, mongoose…).

.env.example: ví dụ biến môi trường (DB_URI=..., PORT=5000).


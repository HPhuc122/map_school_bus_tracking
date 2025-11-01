# Smart School Bus Tracking

Smart School Bus Tracking là một ứng dụng quản lý và theo dõi xe buýt học đường (frontend React + backend Node.js/Express + MySQL) hỗ trợ CRUD, realtime (Socket.IO), và dashboard cho phụ huynh, tài xế và quản trị.

## Tính năng chính

- Quản lý học sinh, phụ huynh, tài xế, xe buýt, tuyến đường và lịch trình.
- Theo dõi vị trí xe theo realtime (Socket.IO).
- CRUD cho các thực thể (hocsinh, taixe, xebuyt, lichtrinh...).
- Báo cáo và thông báo (notifications, alerts).

## Kiến trúc

- Monorepo với hai package chính:
  - packages/backend — Node.js + Express + MySQL
  - packages/frontend — React 18 + TypeScript + Vite
- Realtime: socket.io (client nằm trong frontend tại packages/frontend/src/contexts/SocketContext.tsx)
- API client: axios wrapper tại packages/frontend/src/services/api/client.ts
- Cấu hình API/Socket tại packages/frontend/src/services/api/config.ts

## Yêu cầu

- Node.js >= 18
- npm hoặc yarn
- MySQL (hoặc MariaDB)

## Biến môi trường quan trọng

Frontend (ví dụ ở packages/frontend/.env):
- VITE_API_BASE_URL — ví dụ: http://localhost:5000/api
- VITE_SOCKET_URL — ví dụ: http://localhost:5000

Backend (ví dụ ở packages/backend/.env):
- PORT (mặc định 5000)
- DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

Lưu ý: trong repository hiện có hai biến env tương tự là VITE_API_BASE và VITE_API_BASE_URL; cần nhất quán sử dụng VITE_API_BASE_URL để tránh gọi sai server (frontend có chỗ đang default về 4000, trong khi backend docs dùng 5000).

## Chạy project (development)

1. Cài dependencies (từ root hoặc từng package):

- Từ root (nếu sử dụng workspace):
  npm install
  hoặc
  yarn install

- Hoặc vào từng package:
  cd packages/backend
  npm install

  cd packages/frontend
  npm install

2. Khởi động backend:
  cd packages/backend
  cp .env.example .env    # chỉnh biến môi trường nếu cần
  npm run dev

3. Khởi động frontend:
  cd packages/frontend
  cp .env.example .env    # chỉnh VITE_API_BASE_URL, VITE_SOCKET_URL
  npm run dev

- Frontend dev server mặc định chạy trên port 5173.
- Backend mặc định chạy trên port 5000 (kiểm tra packages/backend/server.js và docs/SYSTEM_CHECK_REPORT.md).

## Endpoint & cấu hình API

- BASE API: VITE_API_BASE_URL (ví dụ: http://localhost:5000/api)
- Một số endpoint mẫu (frontend map trong packages/frontend/src/services/api/config.ts):
  - /hocsinh  (students)
  - /taixe    (drivers)
  - /xebuyt   (buses)
  - /lichtrinh (schedules)
  - /vitrixe  (locations)

- Axios client: packages/frontend/src/services/api/client.ts — đảm bảo sử dụng apiClient thay vì axios trực tiếp để baseURL và interceptors được áp dụng.

## Realtime (Socket.IO)

- Socket URL: VITE_SOCKET_URL (ví dụ: http://localhost:5000)
- Client init: packages/frontend/src/contexts/SocketContext.tsx
  - Gửi auth token nếu backend yêu cầu: io(SOCKET_URL, { auth: { token } })
  - Sự kiện mẫu định nghĩa ở packages/frontend/src/services/api/config.ts (SOCKET_EVENTS), ví dụ `bus:location:update`, `bus:status:change`.
- Để debug realtime: mở DevTools → Network → WS để quan sát frames; hoặc dùng node/socket.io-client để kết nối test.

## Kiểm thử nhanh API (curl)

- Lấy danh sách lịch trình:
  curl -i http://localhost:5000/api/lichtrinh

- Lấy vị trí xe realtime (ví dụ):
  curl -i http://localhost:5000/api/vitrixe/live

(Thay host/port tương ứng với cấu hình env của bạn)

## Vấn đề thường gặp & cách khắc phục nhanh

- Không load được dữ liệu ở frontend:
  - Kiểm tra biến env VITE_API_BASE_URL có đúng không.
  - Kiểm tra Network tab trong DevTools để xem status code (401, 403, 404, CORS error).
  - Nếu thấy CORS error, bật CORS trên backend (hoặc cấu hình proxy dev trên Vite).

- Realtime không nhận event:
  - Kiểm tra SOCKET_URL và event names khớp backend.
  - Nếu backend cần auth, đảm bảo token được gửi khi tạo socket.
  - Kiểm tra logs backend (packages/backend/src/utils/logger.js) để xem kết nối websocket có bị từ chối hay không.

- Dữ liệu CRUD không hiện:
  - Sử dụng apiClient thay vì axios direct calls.
  - Sau POST/PUT/DELETE, refetch list hoặc cập nhật local state (contexts/hooks đang dùng fetchRoutes(), v.v.).

## Debug & monitoring

- Backend có logger tiện ích tại packages/backend/src/utils/logger.js — bật apiRequest/apiResponse để log traffic.
- Tạo Postman/Insomnia collection để lưu endpoints và responses.

## Contributing

1. Fork repo & tạo branch feature/my-change
2. Commit thay đổi rõ ràng, viết mô tả
3. Tạo PR vào main, miêu tả rõ thay đổi và steps để kiểm thử

## License

Tùy chỉnh theo dự án (mặc định chưa có license trong repo). Nếu muốn, thêm LICENSE (MIT/Apache-2.0...).

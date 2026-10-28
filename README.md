# Hệ thống quản lý sách trên nền tảng điện toán đám mây

Sinh viên:Phan Quốc Duy  
MSSV: 235019  
Học phần: Điện toán đám mây

## 1. Giới thiệu đề tài
Xây dựng hệ thống quản lý sách trên nền tảng điện toán đám mây, hỗ trợ quản lý, tìm kiếm và cập nhật thông tin sách.

## 2. Công nghệ sử dụng
- Frontend: React
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Quản lý mã nguồn: Git, GitHub
- Đóng gói ứng dụng: Docker, Docker Hub
- Triển khai: Render

## 3. Cấu trúc dự án
- `backend/`: Xây dựng REST API quản lý sách
- `frontend/`: Giao diện người dùng bằng React
- `README.md`: Hướng dẫn sử dụng dự án
- `.gitignore`: Loại trừ các file không cần quản lý trên GitHub

## 4. Chức năng hệ thống
- Hiển thị danh sách sách
- Xem chi tiết sách
- Thêm sách mới
- Cập nhật thông tin sách
- Xóa sách
- Tìm kiếm sách theo tên, tác giả hoặc thể loại

## 5. Hướng dẫn cài đặt và chạy ứng dụng

Yêu cầu: Node.js, npm và tài khoản MongoDB Atlas.

### Backend
```bash
cd backend
npm install
```

Tạo file `.env` với các biến môi trường cần thiết:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Chạy backend:
```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Cấu hình URL backend phù hợp với môi trường triển khai.

## 6. Triển khai
Ứng dụng được đóng gói bằng Docker, lưu image trên Docker Hub và triển khai công khai qua Render.

## 7. Bảo mật
Không công khai mật khẩu, access token hoặc chuỗi kết nối MongoDB có thông tin xác thực trên GitHub.
# HỆ THỐNG QUẢN LÝ SÁCH TRÊN NỀN TẢNG ĐIỆN TOÁN ĐÁM MÂY

**Sinh viên:** Phan Quốc Duy  
**Mã số sinh viên:** 235019  
**Học phần:** Điện toán đám mây  
**Repository:** `235019_PhanQuocDuy`

## 1. Giới thiệu đề tài

Dự án xây dựng một ứng dụng web quản lý sách theo mô hình **Frontend – REST API – Cơ sở dữ liệu**, triển khai trên nền tảng điện toán đám mây. Người dùng có thể xem danh sách, xem chi tiết, thêm, sửa, xóa và tìm kiếm sách. Dữ liệu được lưu trữ tập trung trên MongoDB Atlas và được truy cập thông qua Backend Node.js/Express.

**Website đã triển khai:** https://books-frontend-235019.onrender.com

### Kiến trúc hệ thống

```text
Người dùng / Trình duyệt
          |
          v
Frontend React + Vite (Nginx trên Render)
          | HTTPS / JSON
          v
Backend Node.js + Express (Render)
          |
          v
MongoDB Atlas
  Database: 235019_PhanQuocDuy
  Collection: books
```

## 2. Công nghệ sử dụng

| Thành phần | Công nghệ | Mục đích |
|---|---|---|
| Frontend | React, Vite, HTML, CSS, JavaScript | Xây dựng giao diện và gọi API |
| Backend | Node.js, Express | Xây dựng REST API |
| Kết nối và mô hình dữ liệu | Mongoose | Tương tác với MongoDB Atlas |
| Cơ sở dữ liệu | MongoDB Atlas | Lưu trữ dữ liệu sách trên đám mây |
| Quản lý mã nguồn | Git, GitHub | Quản lý phiên bản, commit và push |
| Đóng gói | Docker, Docker Hub | Build, lưu trữ và phân phối image |
| Phục vụ frontend | Nginx | Phục vụ bản React đã build |
| Triển khai | Render | Chạy Backend và Frontend công khai |

## 3. Cấu trúc thư mục

```text
235019_PhanQuocDuy/
├── backend/
│   ├── models/
│   │   └── Book.js             # Mongoose schema cho sách
│   ├── routes/
│   │   └── bookRoutes.js       # REST API quản lý sách
│   ├── server.js               # Express, CORS, MongoDB và /health
│   ├── testMongo.js            # Kiểm tra kết nối MongoDB Atlas
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile              # Image Node.js Backend
│   ├── .dockerignore
│   └── .env.example            # Cấu hình mẫu, không chứa mật khẩu
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx             # Giao diện và các thao tác CRUD
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile              # Build React và phục vụ bằng Nginx
│   ├── .dockerignore
│   └── .env.example
├── .gitignore
└── README.md
```

**Lưu ý:** Các thư mục `node_modules/`, `dist/` và tệp `.env` là dữ liệu được tạo hoặc cấu hình trên máy, không đưa lên GitHub.

## 4. Chức năng hệ thống

- Hiển thị danh sách sách và thống kê số đầu sách, tổng số lượng, số thể loại đang hiển thị.
- Xem thông tin chi tiết của một cuốn sách.
- Thêm sách với đầy đủ trường dữ liệu.
- Cập nhật thông tin sách.
- Xóa sách sau khi xác nhận.
- Tìm kiếm theo **tên sách, tác giả hoặc thể loại**, không phân biệt chữ hoa/chữ thường.
- Kiểm tra dữ liệu bắt buộc, năm xuất bản và số lượng trước khi lưu.
- Không cho phép trùng `bookId`.
- Hiển thị trạng thái tải dữ liệu, thông báo thành công và thông báo lỗi.

## 5. Thiết kế cơ sở dữ liệu MongoDB Atlas

- **Database:** `235019_PhanQuocDuy`
- **Collection:** `books`
- **Số dữ liệu mẫu ban đầu:** 3 cuốn sách (`BK001`, `BK002`, `BK003`)

| Trường | Kiểu dữ liệu | Ý nghĩa |
|---|---|---|
| `bookId` | String (unique) | Mã sách, không được trùng |
| `title` | String | Tên sách |
| `author` | String | Tác giả |
| `category` | String | Thể loại |
| `publisher` | String | Nhà xuất bản |
| `publishYear` | Number | Năm xuất bản |
| `isbn` | String | Mã ISBN |
| `quantity` | Number | Số lượng sách |
| `description` | String | Mô tả sách |

Mô hình `Book.js` sử dụng Mongoose, có các ràng buộc bắt buộc và trường `bookId` duy nhất. Trường `quantity` không được âm; năm xuất bản được giới hạn trong khoảng 0–2100 theo mã nguồn.

## 6. Danh sách REST API

**Backend local:** `http://localhost:5000`  
**Backend Render:** https://books-backend-235019.onrender.com

| Phương thức | Endpoint | Chức năng | HTTP thành công |
|---|---|---|---|
| GET | `/health` | Kiểm tra Backend và MongoDB | 200 |
| GET | `/api/books` | Lấy danh sách sách | 200 |
| GET | `/api/books/:id` | Xem sách theo `bookId` | 200 |
| POST | `/api/books` | Thêm sách mới | 201 |
| PUT | `/api/books/:id` | Cập nhật sách theo `bookId` | 200 |
| DELETE | `/api/books/:id` | Xóa sách theo `bookId` | 200 |
| GET | `/api/books?search=MongoDB` | Tìm theo tên, tác giả hoặc thể loại | 200 |

Một số mã lỗi được xử lý: **400** (dữ liệu không hợp lệ), **404** (không tìm thấy sách), **409** (trùng mã sách), **500** (lỗi máy chủ/cơ sở dữ liệu); `/health` trả **503** khi cơ sở dữ liệu ngắt kết nối.

### Ví dụ kiểm tra API

- Trạng thái: https://books-backend-235019.onrender.com/health
- Danh sách: https://books-backend-235019.onrender.com/api/books
- Chi tiết BK001: https://books-backend-235019.onrender.com/api/books/BK001
- Tìm MongoDB: https://books-backend-235019.onrender.com/api/books?search=MongoDB

API phản hồi theo định dạng JSON.

## 7. Hướng dẫn cài đặt và chạy trên máy

### 7.1. Yêu cầu

- Node.js và npm; khuyến nghị Node.js 22 như môi trường Docker.
- Git (nếu muốn clone repository).
- Có database MongoDB Atlas và tài khoản kết nối được cấp quyền phù hợp.

### 7.2. Tải mã nguồn

```bash
git clone https://github.com/Phanquocduy-23/235019_PhanQuocDuy.git
cd 235019_PhanQuocDuy
```

### 7.3. Chạy Backend

```bash
cd backend
npm install
```

Tạo tệp `backend/.env` từ `backend/.env.example`, rồi điền chuỗi kết nối **thật và riêng tư**:

```env
PORT=5000
MONGO_URI=mongodb+srv://<DB_USER>:<DB_PASSWORD>@<CLUSTER_HOST>/235019_PhanQuocDuy?retryWrites=true&w=majority
```

Thay các phần trong dấu ngoặc nhọn góc bằng thông tin MongoDB Atlas của chính bạn. Nếu mật khẩu có ký tự đặc biệt, cần mã hóa URL phù hợp. Đảm bảo IP/network access trên Atlas cho phép môi trường đang chạy kết nối.

Chạy Backend:

```bash
npm run dev
```

Hoặc chạy chế độ thông thường:

```bash
npm start
```

Kiểm tra: http://localhost:5000/health và http://localhost:5000/api/books.

### 7.4. Chạy Frontend

Mở terminal **khác**, từ thư mục gốc dự án:

```bash
cd frontend
npm install
```

Tạo `frontend/.env.development` từ cấu hình mẫu:

```env
VITE_API_URL=http://localhost:5000
```

Chạy giao diện:

```bash
npm run dev
```

Mở URL do Vite hiển thị (thông thường http://localhost:5173). Backend phải hoạt động để frontend tải dữ liệu. Khi thay đổi biến `VITE_API_URL`, cần khởi động lại Vite hoặc build lại frontend tương ứng.

## 8. Docker và Docker Hub

### 8.1. Build và chạy Backend Docker

Từ thư mục `backend/`:

```bash
docker build -t phanquocduy23/backend:1.0 .
docker run -d --name books-backend -p 5001:5000 --env-file .env phanquocduy23/backend:1.0
```

Kiểm thử: http://localhost:5001/health và http://localhost:5001/api/books.

`--env-file .env` chỉ truyền các biến cấu hình lúc chạy; **không** đóng gói tệp mật khẩu vào Docker image.

### 8.2. Build và chạy Frontend Docker trên máy

Từ thư mục `frontend/`:

```bash
docker build -t phanquocduy23/frontend:1.0 --build-arg VITE_API_URL=http://localhost:5001 .
docker run -d --name books-frontend -p 8080:80 phanquocduy23/frontend:1.0
```

Mở http://localhost:8080 và kiểm tra giao diện. Backend phải đang chạy trên cổng 5001.

### 8.3. Image Frontend dùng cho Render

Frontend dùng biến `VITE_API_URL` **tại lúc build**, vì vậy bản triển khai đám mây được build với URL Backend Render:

```bash
docker build -t phanquocduy23/frontend:2.0 --build-arg VITE_API_URL=https://books-backend-235019.onrender.com .
```

Image `frontend:1.0` dành cho kiểm thử local, còn `frontend:2.0` dành cho Render.

### 8.4. Đẩy image lên Docker Hub

```bash
docker login
docker push phanquocduy23/backend:1.0
docker push phanquocduy23/frontend:2.0
```

**Docker Hub:**

- Backend: https://hub.docker.com/r/phanquocduy23/backend
- Frontend: https://hub.docker.com/r/phanquocduy23/frontend

## 9. Triển khai trên Render

Hai dịch vụ được tạo bằng **Web Service → Existing Image** và chọn gói Free khi khả dụng.

### Backend

- Service: `books-backend-235019`
- Docker image: `docker.io/phanquocduy23/backend:1.0`
- Biến môi trường Render: `PORT=5000`, `MONGO_URI=<chuỗi kết nối riêng tư>`
- Health Check Path: `/health`
- URL: https://books-backend-235019.onrender.com

### Frontend

- Service: `books-frontend-235019`
- Docker image: `docker.io/phanquocduy23/frontend:2.0`
- Nginx phục vụ website trên cổng 80 trong container.
- Health Check Path: `/`
- URL: https://books-frontend-235019.onrender.com

**Lưu ý:** Với gói Render Free, service có thể tạm dừng khi không có truy cập; yêu cầu đầu tiên sau thời gian không hoạt động có thể phản hồi chậm. Truy cập thử lại nếu đang trong quá trình khởi động.

## 10. Kiểm thử và kết quả

Ứng dụng đã được kiểm tra trên máy và trên các URL Render công khai:

| Nội dung | Kết quả quan sát |
|---|---|
| `/health` Backend Render | JSON `status: OK`, `database: connected` |
| `/api/books` Backend Render | Trả về danh sách 3 sách mẫu sau kiểm thử |
| Xem chi tiết BK001 | Hiển thị đầy đủ thông tin |
| Tìm kiếm theo tên/tác giả/thể loại | Hoạt động |
| Tìm từ khóa không có kết quả | Hiển thị trạng thái không tìm thấy |
| Thêm sách BK004 | Thành công |
| Cập nhật BK004 | Thành công |
| Xóa BK004 | Thành công; dữ liệu trở lại 3 sách |
| Thêm trùng `BK001` | Bị từ chối và hiển thị thông báo lỗi |

### Đường dẫn bài nộp

| Thành phần | Đường dẫn |
|---|---|
| GitHub | https://github.com/Phanquocduy-23/235019_PhanQuocDuy |
| Docker Hub Backend | https://hub.docker.com/r/phanquocduy23/backend |
| Docker Hub Frontend | https://hub.docker.com/r/phanquocduy23/frontend |
| Render Backend | https://books-backend-235019.onrender.com |
| Render Frontend | https://books-frontend-235019.onrender.com |

## 11. Bảo mật và lưu ý

- Không đưa `.env`, mật khẩu, access token hay chuỗi kết nối có thông tin xác thực lên GitHub.
- Chỉ commit các file `.env.example` không chứa bí mật.
- Dùng `.gitignore` và `.dockerignore` để bỏ qua tệp cấu hình nhạy cảm và thư mục không cần thiết.
- Mật khẩu MongoDB chỉ được cấu hình tại môi trường chạy (ví dụ Environment Variables trên Render hoặc `--env-file` khi chạy Docker).
- Nếu thông tin xác thực từng bị lộ, phải đổi mật khẩu và cập nhật lại môi trường triển khai.

---

**Sinh viên thực hiện: Phan Quốc Duy – MSSV: 235019**

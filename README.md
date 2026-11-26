# Toán Đồng Hành Lớp 4, 5
Ứng dụng web học tập và rèn luyện môn Toán tiểu học chuẩn Chương trình Giáo dục phổ thông 2018 (Lớp 4 & Lớp 5).

**Chủ nhiệm & Tác giả xây dựng:** Nguyễn Thị Minh Hiền và Nguyễn Thị Thủy Tiên

## 🌟 Tính Năng Nổi Bật
1. **Luyện tập theo chuẩn Chương trình GDPT 2018:**
   - **Lớp 4:** Số tự nhiên & 4 phép tính, Phân số kỳ diệu, Hình học (Hình bình hành, hình thoi), Toán có lời văn (Tổng - Tỉ, Tổng - Hiệu).
   - **Lớp 5:** Số thập phân, Tỉ số phần trăm & Giảm giá thực tế, Hình học phẳng & không gian (Hình thang, hình tròn, hình hộp chữ nhật), Toán chuyển động đều (`s = v × t`).
2. **Trợ Lý Cú Vàng & Giọng Đọc Thuần Tiếng Việt Chuẩn Xác:**
   - Tự động chuẩn hóa các đơn vị đo và ký hiệu toán học (`cm²`, `dm³`, `km/giờ`, phân số, phép tính) sang tiếng Việt tự nhiên.
   - Đọc to đề bài và lời giải bằng giọng nói thuần tiếng Việt qua máy chủ âm thanh `/api/tts`, không bị đọc nhầm sang tiếng Anh.
3. **Tự Quản Lý & Chỉnh Sửa Câu Hỏi — Đáp Án Trực Tiếp:**
   - Người dùng, giáo viên và phụ huynh có thể tự sửa đề bài, 4 phương án trả lời, đáp án đúng, gợi ý, lời giải chi tiết cho cả Luyện tập lẫn Bản đồ Thám hiểm.
   - Hỗ trợ thêm mới, xóa, nghe thử giọng đọc, xuất/nhập tệp sao lưu và khôi phục mặc định.
4. **Bảng Nháp Thông Minh:**
   - Bảng vẽ đa màu sắc, bút chì, tẩy và xóa nháp giúp học sinh vẽ sơ đồ đoạn thẳng và đặt tính tự do.
5. **Đấu Trường Tính Nhẩm Siêu Tốc 60 Giây:**
   - Sinh đề ngẫu nhiên theo khối lớp, tính điểm theo chuỗi trả lời đúng liên tiếp, lưu điểm kỷ lục và thưởng Sao.
6. **Bản Đồ Thám Hiểm Đảo Toán Học:**
   - 6 ải thử thách mở khóa theo số Sao tích lũy, sưu tập huy hiệu danh dự (có thể tùy chỉnh nội dung từng ải).
7. **Tài Liệu Tích Hợp & Phiếu Vinh Danh:**
   - Tích hợp sẵn Slide hướng dẫn sử dụng (`.pptx`) và Bản mô tả ứng dụng (`.docx`) để xem trực tiếp và tải về ngay trong ứng dụng.
   - Đánh giá kỹ năng, xếp hạng danh hiệu và hỗ trợ in trực tiếp phiếu khen thưởng.

## 🚀 Khởi Chạy Ứng Dụng
- **Tạo lại tệp Slide (`.pptx`) và Bản mô tả Word (`.docx`):** `node scripts/generate-docs.mjs`
- **Tự động dò cổng trống:** Chạy `start-app.bat` (Windows) hoặc `node start-server.js` (Linux).
- **Cổng mặc định ưu tiên:** `4350` (tự động chuyển dải `4350 - 4399` nếu cổng bận).
- **Đóng gói phát hành:** `npm run build` -> thư mục `dist/`.

# Design Patterns — Tổng Hợp

Tổng hợp 10 design pattern backend trong dự án này, bằng tiếng Việt, có thể xem trực tiếp trên trình duyệt.

Xem trang trực quan: [`patterns-overview.html`](./patterns-overview.html)

## Danh sách Pattern

| # | Pattern | File tài liệu | Mục đích chính |
|---|---------|---------------|----------------|
| 01 | Repository | `01-repository.md` | Trung gian giữa domain và truy cập dữ liệu |
| 02 | Factory | `02-factory.md` | Tạo đối tượng tập trung, ẩn đi logic `new` |
| 03 | Singleton | `03-singleton.md` | Đảm bảo một lớp chỉ có duy nhất một thể |
| 04 | Strategy | `04-strategy.md` | Đóng gói và thay thế thuật toán runtime |
| 05 | Observer | `05-observer.md` | Thông báo một-nhiều khi đối tượng thay đổi |
| 06 | Builder | `06-builder.md` | Xây dựng đối tượng phức tạp từng bước |
| 07 | Adapter | `07-adapter.md` | Chuyển đổi giao diện tương thích |
| 08 | Decorator | `08-decorator.md` | Thêm chức năng động mà không sửa lớp gốc |
| 09 | CQRS | `09-cqrs.md` | Phân tách lệnh (ghi) và truy vấn (đọc) |
| 10 | Circuit Breaker | `10-circuit-breaker.md` | Ngăn thất bại lan truyền trong hệ thống phân tán |

## Nhóm theo mục đích

- **Tạo đối tượng**: Factory, Singleton, Builder
- **Truy cập dữ liệu**: Repository, Decorator
- **Truyền thông / sự kiện**: Observer, Strategy, Adapter
- **Kiến trúc hệ thống**: CQRS, Circuit Breaker

## Cách sử dụng

Mỗi file markdown chi tiết bao gồm: định nghĩa, bài toán giải quyết, cấu trúc, mã nguồn minh họa, API endpoint, lợi ích, và file liên quan.
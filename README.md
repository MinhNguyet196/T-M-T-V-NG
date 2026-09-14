# Tím Từ Vựng

Website ôn từ vựng tiếng Anh và tiếng Trung, xây dựng thuần HTML/CSS/JavaScript. Dữ liệu bộ từ được đồng bộ theo tài khoản bằng Supabase.

## Chạy trên máy

Mở trực tiếp file `index.html` bằng trình duyệt.

## Đưa lên GitHub Pages

1. Tạo một repository mới trên GitHub.
2. Upload toàn bộ 3 file ở thư mục này: `index.html`, `style.css`, `app.js`.
3. Vào **Settings** → **Pages** của repository.
4. Ở mục **Build and deployment**, chọn **Deploy from a branch**.
5. Chọn branch `main` và thư mục `/(root)`, sau đó bấm **Save**.
6. Sau vài phút, GitHub sẽ hiển thị đường dẫn website của bạn.

## Thiết lập Supabase (bắt buộc, chỉ làm một lần)

1. Trong Supabase Dashboard, vào **SQL Editor** → **New query**.
2. Mở file `supabase-setup.sql` trong thư mục này, copy toàn bộ nội dung và dán vào SQL Editor.
3. Bấm **Run**. File này tạo hai bảng dữ liệu và Row Level Security, để mỗi tài khoản chỉ xem/chỉnh sửa được các bộ từ của mình.

Sau khi website được deploy, người dùng có thể tự tạo tài khoản bằng email và dùng cùng tài khoản trên mọi thiết bị.

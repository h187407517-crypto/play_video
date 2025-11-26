# Demo: Video Center with Product Sidebars

Mục tiêu: giao diện web có khung xem video ở giữa, hai bên là danh sách sản phẩm (ví dụ Shopee, TikTok).

Files:
- `index.html` — layout chính (iframe video ở giữa, 2 sidebar)
- `styles.css` — kiểu dáng responsive
- `script.js` — dữ liệu mẫu và renderer cho danh sách sản phẩm

Chạy thử:
1. Mở `index.html` trực tiếp trong trình duyệt hoặc dùng server tĩnh.
2. Nếu cần server (để tránh CORS với iframe), chạy từ PowerShell:

```powershell
cd d:\play_video; python -m http.server 8000;
```

Sau đó mở `http://localhost:8000`.

Gợi ý tùy chỉnh:
- Thay URL iframe trong `index.html` bằng video của bạn.
- Thay dữ liệu `shopeeProducts` và `tiktokProducts` trong `script.js` bằng dữ liệu thực từ API.
- Bổ sung pagination hoặc load-more nếu danh sách dài.

Publishing to GitHub Pages
1. Initialize a git repo (if you haven't):

```powershell
cd D:\play_video
git init
git add .
git commit -m "Initial site"
```

2. Push to GitHub (create a repository on GitHub first), replace `<your-remote-url>`:

```powershell
git remote add origin <your-remote-url>
git branch -M main
git push -u origin main
```

3. The included GitHub Actions workflow (`.github/workflows/gh-pages.yml`) will run on push to `main` and publish the repository root to the `gh-pages` branch. After the workflow completes, enable GitHub Pages in your repository settings:

- Settings → Pages → Source: `gh-pages` branch → Save.

Notes:
- The workflow deploys the repository root; ensure files referenced by `index.html` use relative paths (they already do, e.g. `css/styles.css`, `js/script.js`).
- If your default branch is `master` the workflow also triggers on `master` pushes.

Note: the repository now uses a `src/` folder for the website source. The workflow is configured to deploy the `src/` folder (recommended for maintainability).

Quick local dev (serve files from `src/`):

```powershell
cd D:\play_video
npx http-server src -p 8000
# open http://localhost:8000
```

If you prefer to keep deploying the repository root instead, I can revert the workflow.

If you want I can also:
- (A) add a small `package.json` + `start` script for local dev, or
- (B) switch the workflow to publish only `src/` instead of repository root.


HLS / m3u8
- Giao diện hiện nay sử dụng `hls.js` để phát stream HLS (m3u8). File `index.html` đã nhúng `hls.js` từ CDN và `script.js` sẽ attach nguồn m3u8 vào thẻ `<video id="mainVideo">`.
- Mẫu URL m3u8 được dùng trong `script.js`: `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`.
- Lưu ý: một số trình duyệt (Chrome/Firefox/Edge) cần `hls.js`, trong khi Safari hỗ trợ HLS nguyên gốc. Autoplay có thể bị chặn; hãy click vào video nếu không tự động phát.

Encode / Viewer (mã hóa link)
- `encode.html`: trang nhỏ để mã hóa URL (base64 URL-safe). Nhập URL m3u8 vào ô và nhấn "Mã hóa" để lấy chuỗi đã mã hóa. Copy link viewer sẽ là `viewer.html?u=ENCODED_STRING`.
- `viewer.html`: trang nhận param `u` (chuỗi mã hóa) — sẽ giải mã và phát stream HLS bằng `hls.js`.
- LƯU Ý: Cách mã hóa hiện tại dùng Base64 URL-safe => không phải mã hóa an toàn (bất kỳ ai có chuỗi đều có thể giải mã). Nếu cần bảo mật thực sự, hãy dùng encryption trên server và/hoặc token đã ký.

Nếu bạn muốn, tôi có thể:
- Kết nối đến API thực tế và hiển thị sản phẩm động.
- Thêm chức năng tương tác (hover, add-to-cart, open preview).
- Thiết kế UI theo màu sắc/brand cụ thể.

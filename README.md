# ⚔️ Code Adventure RPG (DauTruong_Code)

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**Code Adventure RPG** là một nền tảng học lập trình được game hóa (gamified learning platform) dưới dạng một trò chơi nhập vai (RPG). Người chơi sẽ vượt qua các thử thách lập trình để thăng cấp, thu thập vật phẩm, nuôi thú cưng và đánh bại trùm (boss) trong một thế giới ảo đầy kịch tính.

---

## 🚀 Tính năng chính

- **🗺️ Chế độ Phiêu lưu (Adventure Mode):** Khám phá bản đồ thế giới với nhiều vùng đất khác nhau, mỗi nơi chứa đựng những thử thách lập trình riêng biệt.
- **🛡️ Hệ thống Nhân vật & Chỉ số:** Tùy chỉnh nhân vật, quản lý chỉ số (HP, Mana, Level, Exp) và thăng tiến sức mạnh.
- **🎒 Kho đồ & Trang bị (Inventory System):** Thu thập và sử dụng các vật phẩm hỗ trợ trong quá trình giải đố.
- **🐾 Hệ thống Thú cưng (Pet System):** Thu phục và nuôi dưỡng những người bạn đồng hành trung thành.
- **👹 Trận chiến với Boss:** Thử thách kỹ năng lập trình tối thượng với các trận đánh Boss quy mô lớn.
- **📅 Nhiệm vụ hàng ngày (Daily Quests):** Duy trì thói quen học tập với các nhiệm vụ mới mỗi ngày.
- **🔥 Hệ thống Streak & Hoạt động:** Theo dõi sự tiến bộ và duy trì ngọn lửa học tập liên tục.
- **🏆 Bảng xếp hạng (Leaderboard):** Cạnh tranh công bằng với cộng đồng lập trình viên trên khắp thế giới.

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/).
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) (Animations), [Shadcn UI](https://ui.shadcn.com/).
- **Backend/Database:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Realtime).
- **State Management:** [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction).
- **Data Fetching:** [TanStack Query v5](https://tanstack.com/query/latest).
- **Testing:** [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).
- **Code Quality:** [ESLint](https://eslint.org/), [Prettier](https://prettier.io/).

---

## 📂 Cấu trúc thư mục

```text
DauTruong_Code/
├── public/              # Tài nguyên tĩnh (images, icons, fonts)
├── src/
│   ├── app/             # Next.js App Router (Pages, Layouts, APIs)
│   ├── assets/          # Assets dùng trong code (SVG, Images)
│   ├── components/      # React Components (UI, Shared, Layouts, Features)
│   ├── constants/       # Hằng số và cấu hình
│   ├── hooks/           # Custom React Hooks
│   ├── lib/             # Cấu hình thư viện bên thứ ba (Supabase, QueryClient)
│   ├── services/        # Tầng xử lý logic nghiệp vụ (API calls, DB interactions)
│   ├── store/           # Quản lý trạng thái (Zustand stores)
│   ├── test/            # Unit & Integration tests
│   ├── types/           # TypeScript interfaces & types
│   └── utils/           # Hàm tiện ích (helpers)
├── supabase/
│   ├── migrations/      # SQL migrations cho database schema
│   └── seed.sql         # Dữ liệu mẫu ban đầu
└── ...                  # Các tệp cấu hình (next.config.ts, tailwind.config.ts...)
```

---

## ⚙️ Hướng dẫn cài đặt

### Yêu cầu hệ thống
- **Node.js:** 20.x trở lên
- **NPM/PNPM/Bun**

### Các bước thực hiện
1. **Clone repository:**
   ```bash
   git clone https://github.com/your-username/dautruong-code.git
   cd dautruong-code
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường:**
   Sao chép tệp `.env.example` thành `.env.local` và điền các thông tin từ Supabase Project của bạn.
   ```bash
   cp .env.example .env.local
   ```

4. **Khởi chạy môi trường phát triển:**
   ```bash
   npm run dev
   ```
   Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt của bạn.

---

## 🚀 Triển khai (Deployment)

Dự án được tối ưu hóa để triển khai trên **Vercel**.

1. Đẩy mã nguồn lên một repository trên GitHub/GitLab.
2. Kết nối repository với dự án mới trên Vercel Dashboard.
3. Thêm các biến môi trường từ `.env.local` vào mục **Environment Variables** trong Vercel.
4. Nhấn **Deploy**.

---

## 🤝 Đóng góp

Mọi sự đóng góp đều được trân trọng! Vui lòng đọc tệp `CONTRIBUTING.md` (nếu có) hoặc mở một `Issue` để thảo luận về những thay đổi bạn muốn thực hiện.

---

## 📄 Giấy phép

Dự án này được cấp phép theo giấy phép **MIT**. Xem tệp `LICENSE` để biết thêm chi tiết.

[![RedHope Unit Testing CI](https://github.com/phamngophat/redhope-testing/actions/workflows/ci.yml/badge.svg)](https://github.com/phamngophat/redhope-testing/actions/workflows/ci.yml)
# 🩸 RedHope - Smart Blood Donation Management System

[![RedHope Unit Testing CI](https://github.com/phamngophat/redhope-testing/actions/workflows/ci.yml/badge.svg)](https://github.com/phamngophat/redhope-testing/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-14.x-black?logo=next.js)
![Jest](https://img.shields.io/badge/Tested%20with-Jest-C21325?logo=jest)
![Coverage](https://img.shields.io/badge/Coverage-85%25%2B-brightgreen)

> Hệ thống quản lý, kết nối và hỗ trợ hiến máu thông minh phục vụ đồ án môn học **SWP391**. Dự án tích hợp quy trình kiểm thử tự động (Automated Unit Testing) với **Jest** và hệ thống tích hợp liên tục **CI/CD (GitHub Actions)**.

---

## 👥 Thành viên nhóm & Đóng góp (Team Members)

| STT | Họ và Tên | Vai trò | Trách nhiệm chính |
| :---: | :--- | :--- | :--- |
| 1 | **Phát** | Core Developer / Tester | Thiết kế kiến trúc, cài đặt CI GitHub Actions, xây dựng bộ Unit Test cho `ScreeningService` & `DonationService` |
| 2 | **Hoàng** | Core Developer / Tester | Xây dựng bộ Unit Test cho `UserService`, hoàn thiện báo cáo kiểm thử `report 5.xls` và slide |

---

## 🏗️ Kiến trúc & Công nghệ (Tech Stack)

* **Frontend & Backend**: Next.js (App Router), React, Tailwind CSS, TypeScript.
* **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Auth Services).
* **Testing Framework**: Jest v29, ts-jest, ts-node.
* **Continuous Integration**: GitHub Actions (Ubuntu runner, Node.js 20).

---

## 📂 Cấu trúc thư mục dự án (Project Directory Structure)

```text
redhope_v1/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Pipeline CI tự động chạy Jest & đo Code Coverage
│       └── playwright.yml         # Pipeline chạy End-to-End Tests
├── services/                      # Tầng xử lý logic nghiệp vụ cốt lõi (Business Logic)
│   ├── screening.service.ts       # Kiểm tra điều kiện sàng lọc & giãn cách 84 ngày
│   ├── donation.service.ts        # Tiếp nhận, ghi nhận túi máu & cập nhật lịch sử
│   └── user.service.ts            # Quản lý hồ sơ người dùng & phân quyền hệ thống
├── tests/
│   ├── unit/                      # Toàn bộ mã nguồn kiểm thử đơn vị (Unit Tests)
│   │   ├── services/
│   │   │   ├── donation-cooldown.test.ts  # Test suite cho quy định giãn cách 84 ngày
│   │   │   ├── donation.service.test.ts   # Test suite cho logic tiếp nhận hiến máu
│   │   │   └── user.service.test.ts       # Test suite cho truy xuất hồ sơ & phân quyền
│   │   └── __mocks__/             # Mock data và giả lập Supabase Client trong RAM
│   └── e2e/                       # Kịch bản kiểm thử giao diện người dùng
├── jest.config.ts                 # Cấu hình môi trường chạy Jest cho TypeScript
└── package.json                   # Quản lý dependencies và kịch bản thực thi lệnh

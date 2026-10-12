# RedHope Testing Suite Architecture by Ngo Phat
# RedHope - Smart Blood Donation Management System

![RedHope Unit Testing CI](https://github.com/phamngophat/redhope-testing/actions/workflows/ci.yml/badge.svg)

> Hệ thống Quản lý và Điều phối Hiến máu Thông minh (SWP391 - Exercise 3)

---

## 📌 Tổng quan dự án & Unit Testing Suite
Hệ thống kiểm thử tự động cho 3 dịch vụ cốt lõi sử dụng **Jest v29** kết hợp pipeline **GitHub Actions (CI/CD)**:
- **ScreeningService**: Kiểm tra quy chuẩn giãn cách hiến máu 84 ngày (`checkDonationCooldown`).
- **DonationService**: Tiếp nhận và xác thực thể tích đơn vị máu hiến (`createDonation`).
- **UserService**: Quản lý hồ sơ và phân quyền tài khoản (`getUserProfile`).

## 📊 Kết quả kiểm thử (Report 5)
- **Tổng số Test Cases**: 49 ca kiểm thử (100% Passed)
- **Line Coverage**: Đạt trên 91.5% - 94.9% (Vượt mức chuẩn 80%)
- **Môi trường CI**: Ubuntu-latest | Node.js 20 | ts-node | Supabase in-memory mock

## 🚀 Lệnh thực thi kiểm thử
```bash
# Chạy toàn bộ 3 test suites và đo Code Coverage
npx jest tests/unit/services/donation-cooldown.test.ts tests/unit/services/donation.service.test.ts tests/unit/services/user.service.test.ts --coverage
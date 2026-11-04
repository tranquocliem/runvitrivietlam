import "./globals.css";

export const metadata = {
  title: "Hệ Thống Số Hóa Rà Soát Vị Trí Việc Làm | Trần Quốc Liêm - TT DVTH xã Trường Long",
  description:
    "Ứng dụng số hóa rà soát Vị trí việc làm, xác định nhu cầu nhân lực và xây dựng phương án biên chế 2027-2031. Phát triển bởi Trần Quốc Liêm - Chuyên viên Trung tâm Dịch vụ tổng hợp xã Trường Long.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-100/80 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}

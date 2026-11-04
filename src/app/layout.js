import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title:
    "Rà Soát Vị Trí Việc Làm & Biên Chế 2027–2031 | Trần Quốc Liêm – TT DVTH xã Trường Long",
  description:
    "Công cụ hướng dẫn chi tiết từng công việc, nhập liệu thử, tự động tính giờ lao động (FTE) và xuất biểu mẫu 03_DVSN_XA.xlsx. Phát triển bởi Trần Quốc Liêm – Chuyên viên Trung tâm Dịch vụ tổng hợp xã Trường Long.",
  applicationName: "Rà Soát VTVL & Biên Chế 2027–2031 (Xã Trường Long)",
  authors: [
    {
      name: "Trần Quốc Liêm – Chuyên viên Trung tâm Dịch vụ tổng hợp xã Trường Long",
    },
  ],
  keywords: [
    "Vị trí việc làm",
    "Phương án biên chế 2027-2031",
    "03_DVSN_XA",
    "Hướng dẫn 13-HD/BTCTU",
    "Trần Quốc Liêm",
    "Trung tâm Dịch vụ tổng hợp xã Trường Long",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Trần Quốc Liêm • TT Dịch vụ tổng hợp xã Trường Long",
    title:
      "Phần mềm Hỗ trợ Rà soát Vị trí việc làm & Phương án Biên chế 2027–2031",
    description:
      "Giải thích cách tính từng công việc, hỗ trợ nhập thử theo Đơn vị hoặc Cá nhân, tự động tính giờ lao động, chấm ĐẠT và xuất file Excel chuẩn 9 biểu (03_DVSN_XA). Tác giả: Trần Quốc Liêm – CV TT DVTH xã Trường Long.",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Phần mềm Hỗ trợ Rà soát Vị trí việc làm & Phương án Biên chế 2027–2031",
    description:
      "Công cụ hướng dẫn cách tính từng việc, nhập thử & tự động tính giờ lao động (Biểu 03_DVSN_XA). Tác giả: Trần Quốc Liêm – CV TT DVTH xã Trường Long.",
  },
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

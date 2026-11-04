"use client";

import React, { useState } from "react";
import { PHU_LUC_3_NORMS } from "@/data/phuLuc3Data";
import { Search, X, Clock, CheckCircle2, BookOpen, HelpCircle } from "lucide-react";

const FAQ_HIGHLIGHTS = [
  {
    q: "1. Kỳ số liệu thống kê được tính như thế nào?",
    a: "Tính đủ 12 tháng, từ ngày 01/10/2025 đến hết ngày 30/9/2026 (bằng quý IV/2025 cộng 9 tháng đầu năm 2026). Không lấy số liệu 9 tháng rồi nhân 12/9. Nhân lực hiện có chốt tại ngày 30/9/2026.",
  },
  {
    q: "2. Quỹ giờ 1.904 giờ/người/năm được tính từ đâu?",
    a: "Tính theo chế độ làm việc phổ biến 40 giờ/tuần: (261 ngày làm việc trong năm − 11 ngày lễ, Tết − 12 ngày nghỉ phép) × 8 giờ = 1.904 giờ/năm. Đối với giáo viên, cán bộ quản lý giáo dục áp dụng chế độ đặc thù theo quy định của Bộ GD&ĐT.",
  },
  {
    q: "3. Khi nào chọn PP1, PP2, PP3 tại Biểu C3?",
    a: "• PP1 (Theo cơ cấu, chức danh, định mức): Áp dụng cho Lãnh đạo quản lý, Giáo viên theo định mức lớp/trường, Bảo vệ/Phục vụ theo ca trực.\n• PP2 (Theo giờ lao động quy đổi): Áp dụng cho công việc nghiệp vụ lặp lại, đếm được sản phẩm (Kế toán, Văn thư, Thủ quỹ, Y tế, Thư viện, Viên chức chuyên môn...).\n• PP3 (Chuyên gia/đặc thù): Áp dụng cho công việc nghiên cứu, tham mưu đề án phức tạp khó đo bằng giờ.",
  },
  {
    q: "4. Làm sao để Biểu B1 báo 'ĐẠT'?",
    a: "Mỗi dòng công việc tại B1 cần có: (1) Mã VTVL đã gắn ở A2; (2) Nguồn số lượng tại cột H; (3) Kỳ thống nhất '01/10/2025–30/9/2026' tại cột K; (4) Số sản phẩm/năm (cột C) và Phút/SP (cột D) kèm Nguồn thời gian (cột I) và Căn cứ thời gian (cột J). Nếu công việc chỉ đo được tổng giờ thì để trống C, D và nhập Giờ bổ sung (E > 0) kèm nguồn tại cột I.",
  },
  {
    q: "5. Vì sao Biểu B2_CT báo 'THAM KHẢO – KHÔNG TÍNH'?",
    a: "Đó không phải là lỗi. Khi cột M chọn 'Ước lượng tham khảo', Excel giữ dòng đó để theo dõi và không trừ/cộng vào giờ lao động ở C3. Chỉ khi đơn vị thực tế có chuyển đổi số/thuê dịch vụ đã kiểm chứng mới chuyển cột M sang 'Đã kiểm chứng' và cột S sang 'Đã đối chiếu'.",
  },
  {
    q: "6. Biểu D1 có được ghi họ tên và số CCCD của viên chức không?",
    a: "KHÔNG. Theo Hướng dẫn 13-HD/BTCTU, cột A (Mã nguồn lực) chỉ ghi theo cấu trúc [Mã cơ quan].[Số thứ tự] (ví dụ: DVTH.001, DVTH.002), tuyệt đối không ghi họ tên, số định danh cá nhân vào tệp Excel.",
  },
];

export default function ReferenceModal({ isOpen, onClose, onSelectNorm }) {
  const [tab, setTab] = useState("norms");
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("ALL");

  if (!isOpen) return null;

  const groups = ["ALL", ...Array.from(new Set(PHU_LUC_3_NORMS.map((n) => n.group)))];

  const filteredNorms = PHU_LUC_3_NORMS.filter((item) => {
    const matchGroup = selectedGroup === "ALL" || item.group === selectedGroup;
    const matchSearch =
      !search.trim() ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.unit.toLowerCase().includes(search.toLowerCase()) ||
      item.group.toLowerCase().includes(search.toLowerCase());
    return matchGroup && matchSearch;
  });

  const handlePick = (item, hours, level) => {
    if (onSelectNorm) {
      onSelectNorm({
        minutes: Math.round(hours * 60),
        hours,
        level,
        item,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <h2 className="text-sm sm:text-base font-bold leading-snug">
                Phụ lục 3: Định Mức Giờ Chuẩn & Cẩm Nang Nghiệp Vụ
              </h2>
              <p className="text-[11px] text-slate-300 hidden sm:block">
                Hướng dẫn số 13-HD/BTCTU • Tích hợp bởi Trần Quốc Liêm (TT DVTH xã Trường Long)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-3 sm:px-6 pt-2.5 gap-1.5 overflow-x-auto shrink-0">
          <button
            onClick={() => setTab("norms")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-t-xl border-b-2 whitespace-nowrap transition cursor-pointer ${
              tab === "norms"
                ? "border-blue-600 text-blue-700 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-4 h-4 shrink-0" />
            <span>45 Định mức giờ chuẩn (Phụ lục 3)</span>
          </button>
          <button
            onClick={() => setTab("faq")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-t-xl border-b-2 whitespace-nowrap transition cursor-pointer ${
              tab === "faq"
                ? "border-blue-600 text-blue-700 bg-white"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>Giải đáp lỗi thường gặp</span>
          </button>
        </div>

        {/* Content */}
        {tab === "norms" ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-2.5 bg-white shrink-0">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm sản phẩm (báo cáo, kế hoạch, hồ sơ, chứng từ...)"
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Tất cả 08 nhóm sản phẩm (45 mục)</option>
                {groups
                  .filter((g) => g !== "ALL")
                  .map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              <div className="mb-3 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                💡 <strong>Chạm vào mức giờ</strong> để áp dụng tự động sang <strong>Phút/SP (Cột D - Biểu B1)</strong>: <em>Đơn giản</em> (theo mẫu sẵn) • <em>Thông thường</em> (mức mặc định) • <em>Phức tạp</em> (liên ngành, nhiều vòng thẩm định).
              </div>

              {/* Giao diện Thẻ trên Mobile (< md) */}
              <div className="grid grid-cols-1 gap-3 md:hidden">
                {filteredNorms.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold text-blue-600 uppercase">
                          Mục {item.id} • {item.group}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                          {item.name}
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold shrink-0">
                        {item.unit}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <button
                        onClick={() => handlePick(item, item.simple, "Đơn giản")}
                        className="p-2 rounded-xl border border-slate-300 bg-slate-50 active:bg-blue-50 text-center"
                      >
                        <div className="text-[10px] text-slate-500">Đơn giản</div>
                        <div className="font-bold text-xs text-slate-800">
                          {item.simple}h ({Math.round(item.simple * 60)}p)
                        </div>
                      </button>
                      <button
                        onClick={() => handlePick(item, item.normal, "Thông thường")}
                        className="p-2 rounded-xl bg-blue-600 text-white text-center shadow-xs"
                      >
                        <div className="text-[10px] text-blue-100">Thông thường</div>
                        <div className="font-bold text-xs">
                          {item.normal}h ({Math.round(item.normal * 60)}p)
                        </div>
                      </button>
                      <button
                        onClick={() => handlePick(item, item.complex, "Phức tạp")}
                        className="p-2 rounded-xl border border-slate-300 bg-slate-50 active:bg-blue-50 text-center"
                      >
                        <div className="text-[10px] text-slate-500">Phức tạp</div>
                        <div className="font-bold text-xs text-slate-800">
                          {item.complex}h ({Math.round(item.complex * 60)}p)
                        </div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Giao diện Bảng trên Desktop (>= md) */}
              <table className="hidden md:table w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-xs uppercase">
                    <th className="py-2.5 px-3 w-12 text-center">TT</th>
                    <th className="py-2.5 px-3">Sản phẩm công việc</th>
                    <th className="py-2.5 px-3 w-24 text-center">ĐVT</th>
                    <th className="py-2.5 px-3 w-36 text-center">Đơn giản</th>
                    <th className="py-2.5 px-3 w-36 text-center bg-blue-50/60">
                      Thông thường (Chuẩn)
                    </th>
                    <th className="py-2.5 px-3 w-36 text-center">Phức tạp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredNorms.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 text-center font-medium text-slate-500">
                        {item.id}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-500">{item.group}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                          {item.unit}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handlePick(item, item.simple, "Đơn giản")}
                          className="px-2.5 py-1 rounded-lg border border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-700 transition cursor-pointer"
                        >
                          {item.simple}h ({Math.round(item.simple * 60)}p)
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-center bg-blue-50/30">
                        <button
                          onClick={() => handlePick(item, item.normal, "Thông thường")}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                        >
                          {item.normal}h ({Math.round(item.normal * 60)}p)
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handlePick(item, item.complex, "Phức tạp")}
                          className="px-2.5 py-1 rounded-lg border border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-700 transition cursor-pointer"
                        >
                          {item.complex}h ({Math.round(item.complex * 60)}p)
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
            {FAQ_HIGHLIGHTS.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5"
              >
                <h3 className="font-bold text-slate-900 text-sm flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="px-4 sm:px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Trần Quốc Liêm – Chuyên viên TT DVTH xã Trường Long
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs sm:text-sm font-bold hover:bg-slate-700 transition cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}

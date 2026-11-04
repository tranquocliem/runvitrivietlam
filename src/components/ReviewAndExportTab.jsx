"use client";

import React, { useState } from "react";
import { SELF_CHECKLIST } from "@/data/phuLuc3Data";
import {
  CheckCircle2,
  AlertTriangle,
  Download,
  Upload,
  Sparkles,
  ClipboardCheck,
  FileSpreadsheet,
  ShieldCheck,
  ArrowRight,
  Award,
  Target,
} from "lucide-react";

export default function ReviewAndExportTab({
  b1EvaluatedRows,
  b2EvaluatedRows,
  c1EvaluatedRows,
  c3EvaluatedRows,
  d1EvaluatedRows,
  d2EvaluatedRows,
  unitMeta,
  scopeMode = "UNIT",
  selectedVtvl = "",
  selectedJobCodes = [],
  onResetScopeToUnit,
  onExportExcel,
  onImportExcel,
  onQuickFillAllCurrentUnit,
  onGoToStep,
  isExporting,
}) {
  const [checkedItems, setCheckedItems] = useState(() =>
    SELF_CHECKLIST.map(() => true)
  );
  const [replacePrefix, setReplacePrefix] = useState(false);

  const b1Dat = b1EvaluatedRows.filter((r) => r.R === "ĐẠT").length;
  const b2Valid = b2EvaluatedRows.filter(
    (r) => r.P === "THAM KHẢO – KHÔNG TÍNH" || r.P === "ĐẠT"
  ).length;
  const c1Dat = c1EvaluatedRows.filter((r) => r.K === "ĐẠT").length;
  const c3Dat = c3EvaluatedRows.filter((r) => r.M === "ĐẠT").length;
  const d1Dat = d1EvaluatedRows.filter((r) => r.J === "Đạt").length;
  const d2Valid = d2EvaluatedRows.filter(
    (r) =>
      r.M === "CẦN THẨM ĐỊNH" ||
      r.M === "KHÁC NĂM CƠ SỞ – GIẢI TRÌNH" ||
      r.M === "ĐẠT"
  ).length;

  const summaryCards = [
    {
      title: "Biểu B1 (Khối lượng & Giờ)",
      done: b1Dat,
      total: b1EvaluatedRows.length,
      step: "A1_A2_B1",
      ok: b1Dat === b1EvaluatedRows.length && b1EvaluatedRows.length > 0,
    },
    {
      title: "Biểu B2 (Tác động CĐS)",
      done: b2Valid,
      total: b2EvaluatedRows.length,
      step: "B2",
      ok: b2Valid === b2EvaluatedRows.length && b2EvaluatedRows.length > 0,
    },
    {
      title: "Biểu C1 (Danh mục VTVL & Quỹ giờ)",
      done: c1Dat,
      total: c1EvaluatedRows.length,
      step: "C1_C2_C3",
      ok: c1Dat === c1EvaluatedRows.length && c1EvaluatedRows.length > 0,
    },
    {
      title: "Biểu C3 (Nhu cầu nhân lực)",
      done: c3Dat,
      total: c3EvaluatedRows.length,
      step: "C1_C2_C3",
      ok: c3Dat === c3EvaluatedRows.length && c3EvaluatedRows.length > 0,
    },
    {
      title: "Biểu D1 (Nhân lực tại 30/9/2026)",
      done: d1Dat,
      total: d1EvaluatedRows.length,
      step: "D1_D2",
      ok: d1EvaluatedRows.length > 0 && d1Dat === d1EvaluatedRows.length,
    },
    {
      title: "Biểu D2 (Phương án 2027–2031)",
      done: d2Valid,
      total: d2EvaluatedRows.length,
      step: "D1_D2",
      ok: d2EvaluatedRows.length > 0 && d2Valid === d2EvaluatedRows.length,
    },
  ];

  const allTechnicalOk = summaryCards.every((c) => c.ok);
  const fileName = `${unitMeta.unitCode || "DVTH_TRUONGLONG"}_K2526_${unitMeta.version || "v1"
    }_${unitMeta.sendDate || "06112026"}.xlsx`;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Thông báo Phạm vi đang kiểm tra (nếu đang ở chế độ Cá nhân / VTVL / Công việc) */}
      {scopeMode !== "UNIT" && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Target className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-950">
              <div className="font-bold text-sm">
                {scopeMode === "VTVL"
                  ? `Đang kiểm tra theo phạm vi Vị trí việc làm: ${selectedVtvl}`
                  : `Đang kiểm tra theo phạm vi Cá nhân: ${selectedJobCodes.length} công việc đã chọn`}
              </div>
              <p className="text-indigo-700 mt-0.5">
                Hệ thống đang chấm <strong>ĐẠT</strong> riêng trên phần việc bạn đã chọn mà không bị báo lỗi bởi các vị trí/công việc khác trong đơn vị.
              </p>
            </div>
          </div>
          {onResetScopeToUnit && (
            <button
              onClick={onResetScopeToUnit}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-300 text-xs font-bold shrink-0 cursor-pointer"
            >
              Chuyển sang xem Toàn đơn vị
            </button>
          )}
        </div>
      )}

      {/* Khối Tổng hợp trạng thái kỹ thuật */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Bước 8: Kiểm Tra Tổng Thể, Bảng Tự Kiểm Tra & Xuất Tệp Excel Chuẩn</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Đối chiếu toàn bộ điều kiện kỹ thuật trước khi xuất ra tệp{" "}
              <strong className="font-mono text-slate-900 break-all">{fileName}</strong> để trình ký xác nhận và gửi về Sở Nội vụ / Ban Tổ chức Thành ủy.
            </p>
          </div>

          {!allTechnicalOk && (
            <button
              onClick={onQuickFillAllCurrentUnit}
              className="w-full lg:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>
                {scopeMode === "UNIT"
                  ? "Tự động hoàn thiện toàn bộ các biểu đạt 100% ĐẠT"
                  : "Tự động hoàn thiện phần việc đang chọn đạt 100% ĐẠT"}
              </span>
            </button>
          )}
        </div>

        {/* 6 thẻ kiểm tra biểu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {summaryCards.map((card, i) => (
            <div
              key={i}
              onClick={() => onGoToStep(card.step)}
              className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 ${card.ok
                  ? "bg-emerald-50/60 border-emerald-200 hover:border-emerald-400"
                  : "bg-amber-50/70 border-amber-200 hover:border-amber-400"
                }`}
            >
              <div>
                <div className="text-xs font-semibold text-slate-600">
                  {card.title}
                </div>
                <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                  {card.done}/{card.total} dòng hợp lệ
                </div>
                <div className="text-[11px] font-medium text-blue-700 mt-1 flex items-center gap-1">
                  Bấm để xem / sửa <ArrowRight className="w-3 h-3" />
                </div>
              </div>
              <div className="shrink-0">
                {card.ok ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ĐẠT 100%
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-200/80 text-amber-950 text-xs font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    Cần bổ sung
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Khung Xuất & Nhập File Excel */}
        <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-md">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <FileSpreadsheet className="w-4 h-4" />
                Xuất Tệp Excel Chuẩn Mẫu Gốc (03_DVSN_XA.xlsx)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-200 text-[11px] font-semibold">
                <Award className="w-3 h-3 text-amber-300" />
                Trần Quốc Liêm – TT DVTH xã Trường Long
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold break-all">
              Tải về tệp <span className="font-mono text-emerald-300">{fileName}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hệ thống chỉ ghi dữ liệu vào đúng <strong>các ô màu trắng</strong> trên bản gốc{" "}
              <code>03_DVSN_XA.xlsx</code>, bảo toàn nguyên vẹn 100% công thức khóa ở các ô màu xám, danh sách chọn (Data Validation), khóa bảo vệ sheet và toàn bộ 30 trang tính của Sở Nội vụ / Ban Tổ chức Thành ủy.
            </p>
            <label className="inline-flex items-start sm:items-center gap-2 text-xs text-slate-200 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={replacePrefix}
                onChange={(e) => setReplacePrefix(e.target.checked)}
                className="mt-0.5 sm:mt-0 rounded border-slate-500"
              />
              <span>
                Thay thế tiền tố mã <code>XXX-</code> bằng Mã cơ quan (
                <code>{unitMeta.unitCode || "DVTH_TRUONGLONG"}-</code>) khi xuất file (mặc định giữ nguyên mã chuẩn <code>XXX-</code> để liên kết danh mục gốc)
              </span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold border border-slate-700 transition cursor-pointer">
              <Upload className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Nhập file .xlsx đang làm dở</span>
              <input
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onImportExcel(file);
                  e.target.value = "";
                }}
              />
            </label>

            <button
              onClick={() => onExportExcel({ replacePrefix })}
              disabled={isExporting}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs sm:text-sm font-bold shadow-lg transition cursor-pointer"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="truncate">
                {isExporting ? "Đang đóng gói Excel..." : `Xuất file ${fileName}`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bảng tự kiểm tra 11 mục (Phụ lục 1) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <span>Phụ lục 1: Bảng Tự Kiểm Tra Trước Khi Trình Ký & Gửi Hồ Sơ (Theo Hướng dẫn 13-HD/BTCTU)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {SELF_CHECKLIST.map((item, idx) => (
            <label
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 cursor-pointer text-xs text-slate-800"
            >
              <input
                type="checkbox"
                checked={checkedItems[idx]}
                onChange={(e) => {
                  const next = [...checkedItems];
                  next[idx] = e.target.checked;
                  setCheckedItems(next);
                }}
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="leading-relaxed">{item}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

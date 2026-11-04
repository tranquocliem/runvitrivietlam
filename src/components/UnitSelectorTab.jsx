"use client";

import React, { useState } from "react";
import { UNIT_TYPES } from "@/data/phuLuc3Data";
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileSpreadsheet,
  ShieldCheck,
  Info,
  Layers,
  Award,
  UserCheck,
  Target,
  Briefcase,
  CheckSquare,
  Square,
  Search,
  Settings2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function UnitSelectorTab({
  selectedUnit,
  setSelectedUnit,
  unitMeta,
  setUnitMeta,
  unitStats,
  unitC1Rows = [],
  unitA2Rows = [],
  unitB1EvalRows = [],
  scopeMode = "UNIT",
  setScopeMode,
  selectedVtvl = "",
  setSelectedVtvl,
  selectedJobCodes = [],
  setSelectedJobCodes,
  onQuickFillUnit,
  onGoToStep,
}) {
  const [jobSearch, setJobSearch] = useState("");
  const [showMetaConfig, setShowMetaConfig] = useState(false);

  const b1Map = {};
  for (const r of unitB1EvalRows) {
    if (r.A) b1Map[r.A] = r;
  }

  const c1Map = {};
  for (const r of unitC1Rows) {
    if (r.A) c1Map[r.A] = r.B;
  }

  const toggleJobSelection = (jobCode) => {
    if (selectedJobCodes.includes(jobCode)) {
      setSelectedJobCodes(selectedJobCodes.filter((c) => c !== jobCode));
    } else {
      setSelectedJobCodes([...selectedJobCodes, jobCode]);
    }
  };

  const filteredJobs = unitA2Rows.filter((a2) => {
    if (!jobSearch.trim()) return true;
    const q = jobSearch.toLowerCase();
    return (
      String(a2.A || "").toLowerCase().includes(q) ||
      String(a2.D || "").toLowerCase().includes(q) ||
      String(a2.C || "").toLowerCase().includes(q) ||
      String(c1Map[a2.C] || "").toLowerCase().includes(q)
    );
  });

  const currentUnitObj = UNIT_TYPES.find((u) => u.code === selectedUnit);

  return (
    <div className="space-y-5">
      {/* KHỐI ĐẦU TRANG DÀNH CHO NGƯỜI MỚI: CHỌN ĐƠN VỊ & CHỌN PHẠM VI KÊ KHAI */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-blue-600/20 shadow-sm overflow-hidden">
        {/* Dải tiêu đề hướng dẫn người mới */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 px-5 sm:px-7 py-4 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold">
                BƯỚC KHỞI ĐẦU DÀNH CHO NGƯỜI MỚI
              </span>
              <span className="text-xs text-slate-300">
                Thiết kế bởi: <strong className="text-white">Trần Quốc Liêm</strong> – CV TT DVTH xã Trường Long
              </span>
            </div>
            <h1 className="text-base sm:text-xl font-extrabold">
              Hãy chọn Đơn vị của bạn và Phạm vi công việc muốn nhập dưới đây
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onGoToStep("GUIDE")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-xs transition cursor-pointer"
            >
              <Info className="w-4 h-4 shrink-0" />
              <span>Xem Hướng dẫn cho người mới</span>
            </button>
            <button
              onClick={() => onGoToStep("A1_A2_B1")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-xs transition cursor-pointer"
            >
              <span>Vào nhập số liệu ngay</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* BƯỚC 1: CHỌN LOẠI HÌNH ĐƠN VỊ SỰ NGHIỆP */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                  1
                </span>
                <span>Chọn Cơ quan / Đơn vị sự nghiệp của bạn:</span>
              </h2>
              <button
                onClick={() => setSelectedUnit("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  selectedUnit === "ALL"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100"
                }`}
              >
                Xem gộp tất cả 06 loại hình ĐVSN
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {UNIT_TYPES.map((u) => {
                const isSelected = selectedUnit === u.code;
                const st = unitStats[u.code] || {
                  a1Count: 0,
                  b1Dat: 0,
                  b1Total: 0,
                  c3Dat: 0,
                  c3Total: 0,
                };
                const b1Pct = st.b1Total > 0 ? Math.round((st.b1Dat / st.b1Total) * 100) : 0;
                const c3Pct = st.c3Total > 0 ? Math.round((st.c3Dat / st.c3Total) * 100) : 0;
                const avgPct = Math.round((b1Pct + c3Pct) / 2);

                return (
                  <div
                    key={u.code}
                    onClick={() => setSelectedUnit(u.code)}
                    className={`rounded-2xl p-3.5 sm:p-4 border-2 transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-500/15"
                        : "border-slate-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {u.id}. {u.code}
                        </span>
                        {avgPct === 100 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3" /> ĐẠT 100%
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-slate-500">
                            B1: {st.b1Dat}/{st.b1Total} việc
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        {u.shortName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        {u.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BƯỚC 2: CHỌN PHẠM VI KÊ KHAI (TOÀN ĐƠN VỊ / VỊ TRÍ VIỆC LÀM / TỪNG CÔNG VIỆC) */}
          <div className="pt-5 border-t border-slate-200 space-y-4">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                  2
                </span>
                <span>
                   tại{" "}
                  <span className="text-blue-700">
                    {currentUnitObj ? currentUnitObj.shortName : "Đơn vị"}
                  </span>
                  , bạn muốn nhập liệu theo phạm vi nào?
                </span>
              </h2>
              <p className="text-xs text-slate-600 mt-1 pl-8">
                Chọn 1 trong 3 chế độ dưới đây. Hệ thống sẽ chỉ hiển thị và chấm{" "}
                <strong className="text-emerald-700">ĐẠT</strong> trên đúng phạm vi bạn chọn:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Chế độ 1 */}
              <div
                onClick={() => setScopeMode("UNIT")}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                  scopeMode === "UNIT"
                    ? "border-blue-600 bg-blue-50/60 shadow-xs ring-2 ring-blue-500/15"
                    : "border-slate-200 hover:border-blue-300 bg-slate-50/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                      1. Nhập Toàn bộ Đơn vị
                    </span>
                    {scopeMode === "UNIT" && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                        Đang chọn
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dành cho <strong>người tổng hợp chung của đơn vị</strong>: làm toàn bộ{" "}
                    <strong>{unitC1Rows.length} vị trí việc làm</strong> ({unitA2Rows.length} công việc).
                  </p>
                </div>
              </div>

              {/* Chế độ 2 */}
              <div
                onClick={() => {
                  setScopeMode("VTVL");
                  if (!selectedVtvl && unitC1Rows[0]?.A) {
                    setSelectedVtvl(unitC1Rows[0].A);
                  }
                }}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                  scopeMode === "VTVL"
                    ? "border-indigo-600 bg-indigo-50/60 shadow-xs ring-2 ring-indigo-500/15"
                    : "border-slate-200 hover:border-indigo-300 bg-slate-50/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-indigo-600 shrink-0" />
                      2. Nhập theo 1 Vị trí việc làm
                    </span>
                    {scopeMode === "VTVL" && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                        Đang chọn
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dành cho <strong>viên chức phụ trách 1 vị trí</strong> (VD: Khuyến nông, Văn hóa, Kế toán...): chỉ nhập các việc của vị trí đó.
                  </p>
                </div>
              </div>

              {/* Chế độ 3 */}
              <div
                onClick={() => {
                  setScopeMode("JOB");
                  if (selectedJobCodes.length === 0 && unitA2Rows[0]?.A) {
                    setSelectedJobCodes([unitA2Rows[0].A]);
                  }
                }}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                  scopeMode === "JOB"
                    ? "border-emerald-600 bg-emerald-50/60 shadow-xs ring-2 ring-emerald-500/15"
                    : "border-slate-200 hover:border-emerald-300 bg-slate-50/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                      3. Chỉ chọn từng Công việc
                    </span>
                    {scopeMode === "JOB" && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                        Đang chọn ({selectedJobCodes.length})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dành cho người <strong>chỉ muốn nhập 1 hoặc vài công việc lẻ</strong> được phân công: tích chọn việc nào thì chỉ tính việc đó.
                  </p>
                </div>
              </div>
            </div>

            {/* Bảng chọn chi tiết khi chọn Chế độ 2 (Theo Vị trí việc làm) */}
            {scopeMode === "VTVL" && (
              <div className="p-4 rounded-2xl bg-indigo-50/50 border-2 border-indigo-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-bold text-indigo-950">
                    👇 Bấm chọn Vị trí việc làm của bạn trong danh sách dưới đây:
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {unitC1Rows.map((c1) => {
                    const jobsOfVtvl = unitA2Rows.filter((a2) => a2.C === c1.A);
                    const datJobs = jobsOfVtvl.filter(
                      (a2) => b1Map[a2.A]?.R === "ĐẠT"
                    ).length;
                    const isPicked = selectedVtvl === c1.A;

                    return (
                      <div
                        key={c1.A}
                        onClick={() => setSelectedVtvl(c1.A)}
                        className={`p-3 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                          isPicked
                            ? "bg-indigo-600 text-white border-indigo-700 shadow-xs"
                            : "bg-white text-slate-800 border-slate-200 hover:border-indigo-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <span
                            className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                              isPicked
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {c1.A}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              isPicked
                                ? "bg-emerald-400/20 text-emerald-200"
                                : datJobs === jobsOfVtvl.length && jobsOfVtvl.length > 0
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {datJobs}/{jobsOfVtvl.length} việc ĐẠT
                          </span>
                        </div>
                        <div className="font-bold text-xs sm:text-sm leading-snug">
                          {c1.B}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bảng chọn chi tiết khi chọn Chế độ 3 (Chọn từng công việc) */}
            {scopeMode === "JOB" && (
              <div className="p-4 rounded-2xl bg-emerald-50/50 border-2 border-emerald-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-bold text-emerald-950">
                    👇 Tích chọn công việc bạn muốn nhập (Đã chọn{" "}
                    <strong className="text-emerald-700">
                      {selectedJobCodes.length}/{unitA2Rows.length}
                    </strong>{" "}
                    công việc):
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedJobCodes(unitA2Rows.map((r) => r.A))}
                      className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      Chọn tất cả
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedJobCodes([])}
                      className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      Bỏ chọn hết
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    placeholder="Gõ tên công việc hoặc mã công việc để tìm nhanh..."
                    className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                  />
                </div>

                <div className="max-h-72 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2 pr-1">
                  {filteredJobs.map((a2) => {
                    const checked = selectedJobCodes.includes(a2.A);
                    const isDat = b1Map[a2.A]?.R === "ĐẠT";
                    return (
                      <div
                        key={a2.A}
                        onClick={() => toggleJobSelection(a2.A)}
                        className={`p-2.5 rounded-xl border transition cursor-pointer flex items-start gap-2.5 text-xs ${
                          checked
                            ? "bg-emerald-600/10 border-emerald-500 text-slate-900"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <div className="mt-0.5 text-emerald-600 shrink-0">
                          {checked ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <span className="font-mono font-bold text-[11px] text-slate-800">
                              {a2.A}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                isDat
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {isDat ? "ĐẠT" : "Chưa nhập"}
                            </span>
                          </div>
                          <div className="font-semibold text-slate-900 mt-0.5 line-clamp-2">
                            {a2.D}
                          </div>
                          <div className="text-[11px] text-indigo-700 mt-0.5 truncate">
                            VTVL: {c1Map[a2.C] || a2.C}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Thanh Nút Bấm Lớn Để Bắt Đầu Sau Khi Chọn Xong */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 text-white">
              <div className="text-xs sm:text-sm">
                <span className="text-slate-400">Bạn đang chọn: </span>
                <strong className="text-emerald-300">
                  {currentUnitObj ? currentUnitObj.shortName : "Tất cả 06 đơn vị"}
                </strong>{" "}
                •{" "}
                <strong className="text-amber-300">
                  {scopeMode === "UNIT"
                    ? `Toàn bộ đơn vị (${unitA2Rows.length} công việc)`
                    : scopeMode === "VTVL"
                    ? `Vị trí: ${c1Map[selectedVtvl] || selectedVtvl}`
                    : `${selectedJobCodes.length} công việc đã chọn`}
                </strong>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                <button
                  onClick={() => onQuickFillUnit(selectedUnit)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-300 border border-emerald-400/30 font-bold text-xs transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Điền số mẫu ĐẠT 100% cho phần này</span>
                </button>
                <button
                  onClick={() => onGoToStep("A1_A2_B1")}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-md transition cursor-pointer"
                >
                  <span>Bắt đầu vào nhập số liệu (Bước 1–3)</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KHỐI CẤU HÌNH THÔNG TIN ĐƠN VỊ & ĐẶT TÊN FILE EXCEL (THU GỌN GỌN GÀNG) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setShowMetaConfig(!showMetaConfig)}
          className="w-full p-4 sm:px-6 flex items-center justify-between gap-3 text-left hover:bg-slate-50 transition cursor-pointer"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Settings2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              Thông tin tên Cơ quan & Tên tệp Excel khi xuất:
            </span>
            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
              {unitMeta.unitName} ({unitMeta.unitCode}_K2526_{unitMeta.version}_{unitMeta.sendDate}.xlsx)
            </span>
          </div>
          <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 shrink-0">
            {showMetaConfig ? "Thu gọn" : "Bấm để đổi tên"}
            {showMetaConfig ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </span>
        </button>

        {showMetaConfig && (
          <div className="px-4 sm:px-6 pb-5 pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên đơn vị sự nghiệp / Cơ quan
              </label>
              <input
                type="text"
                value={unitMeta.unitName}
                onChange={(e) => setUnitMeta({ ...unitMeta, unitName: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mã cơ quan (Dùng đặt tên file & D1)
              </label>
              <input
                type="text"
                value={unitMeta.unitCode}
                onChange={(e) =>
                  setUnitMeta({ ...unitMeta, unitCode: e.target.value.toUpperCase() })
                }
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono font-bold border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Địa bàn Xã / Phường
              </label>
              <input
                type="text"
                value={unitMeta.communeName}
                onChange={(e) => setUnitMeta({ ...unitMeta, communeName: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phiên bản
                </label>
                <input
                  type="text"
                  value={unitMeta.version}
                  onChange={(e) => setUnitMeta({ ...unitMeta, version: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm font-mono border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ngày gửi
                </label>
                <input
                  type="text"
                  value={unitMeta.sendDate}
                  onChange={(e) => setUnitMeta({ ...unitMeta, sendDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm font-mono border border-slate-300 rounded-xl"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

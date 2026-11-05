"use client";

import React, { useState, useMemo } from "react";
import { DROPDOWN_OPTIONS } from "@/data/phuLuc3Data";
import { suggestB1Metrics, explainJobInDetail } from "@/utils/smartPreset";
import {
  CheckCircle2,
  AlertTriangle,
  Search,
  ChevronDown,
  ChevronRight,
  Clock,
  Sparkles,
  BookOpen,
  LayoutList,
  Table,
  Filter,
  Target,
  Building2,
  Briefcase,
} from "lucide-react";

const QUICK_TIME_SOURCES = [
  "Phiếu khảo sát, đo thời gian thực tế trên mẫu đại diện kỳ 01/10/2025–30/9/2026; Thủ trưởng đơn vị xác nhận",
  "Tham chiếu Phụ lục 3 Hướng dẫn 13-HD/BTCTU và đo kiểm đếm thực tế tại đơn vị",
  "Thời khóa biểu, sổ chuyên môn và định mức giờ dạy của Bộ GD&ĐT; Ban Giám hiệu xác nhận",
  "Sổ theo dõi chuyên môn, nhật ký ca trực kỳ 01/10/2025–30/9/2026; Thủ trưởng đơn vị xác nhận",
];

export default function TasksAndWorkloadTab({
  a1Rows,
  a2Rows,
  b1EvaluatedRows,
  c1Rows,
  allUnitC1Rows = [],
  allUnitA2Rows = [],
  scopeMode = "UNIT",
  setScopeMode,
  selectedVtvl = "",
  setSelectedVtvl,
  selectedJobCodes = [],
  setSelectedJobCodes,
  onUpdateA1,
  onUpdateA2,
  onUpdateB1,
  onBatchUpdateB1,
  onOpenNormPicker,
}) {
  const [viewMode, setViewMode] = useState("tree"); // "tree" | "table"
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // "ALL" | "NOT_DAT" | "DAT"
  const [vtvlFilter, setVtvlFilter] = useState("ALL");
  const [expandedTasks, setExpandedTasks] = useState(() => {
    const init = {};
    a1Rows.forEach((r) => {
      if (r.A) init[r.A] = true;
    });
    return init;
  });

  const c1NameMap = useMemo(() => {
    const map = {};
    const list = allUnitC1Rows.length ? allUnitC1Rows : c1Rows;
    for (const r of list) {
      if (r.A) map[r.A] = r.B;
    }
    return map;
  }, [c1Rows, allUnitC1Rows]);

  const b1ByCode = useMemo(() => {
    const map = {};
    for (const r of b1EvaluatedRows) {
      if (r.A) map[r.A] = r;
    }
    return map;
  }, [b1EvaluatedRows]);

  const a2ByCode = useMemo(() => {
    const map = {};
    for (const r of a2Rows) {
      if (r.A) map[r.A] = r;
    }
    return map;
  }, [a2Rows]);

  // Thống kê tổng hợp trên phạm vi đang chọn
  const stats = useMemo(() => {
    let datCount = 0;
    let totalHours = 0;
    for (const r of b1EvaluatedRows) {
      if (r.R === "ĐẠT") {
        datCount++;
        if (typeof r.G === "number") totalHours += r.G;
      }
    }
    return {
      totalTasks: a1Rows.length,
      totalJobs: b1EvaluatedRows.length,
      datCount,
      notDatCount: b1EvaluatedRows.length - datCount,
      totalHours: Math.round(totalHours * 10) / 10,
    };
  }, [a1Rows, b1EvaluatedRows]);

  const handleAutoFillRemainingB1 = () => {
    const updates = [];
    for (const b1 of b1EvaluatedRows) {
      if (b1.R !== "ĐẠT") {
        const a2 = a2ByCode[b1.A];
        const suggested = suggestB1Metrics(a2);
        const isGenericH =
          !b1.H ||
          String(b1.H).startsWith("Hồ sơ/sổ/hệ thống nghiệp vụ của đơn vị");
        updates.push({
          rowNum: b1.rowNum,
          A: b1.A,
          changes: {
            C: b1.C !== "" && b1.C !== undefined ? b1.C : suggested.C,
            D: b1.D !== "" && b1.D !== undefined ? b1.D : suggested.D,
            E: b1.E !== "" && b1.E !== undefined ? b1.E : suggested.E,
            H: isGenericH ? suggested.H : b1.H,
            I: b1.I || suggested.I,
            J: b1.J || suggested.J,
            K: b1.K || "01/10/2025–30/9/2026",
          },
        });
      }
    }
    if (updates.length > 0) {
      onBatchUpdateB1(updates);
    }
  };

  const toggleTask = (taskCode) => {
    setExpandedTasks((prev) => ({ ...prev, [taskCode]: !prev[taskCode] }));
  };

  const expandAll = (val) => {
    const next = {};
    if (val) {
      for (const r of a1Rows) {
        if (r.A) next[r.A] = true;
      }
    }
    setExpandedTasks(next);
  };

  // Lọc danh sách công việc theo điều kiện tìm kiếm
  const filteredJobsByTask = useMemo(() => {
    const map = {};
    for (const a2 of a2Rows) {
      if (!a2.A || !a2.B) continue;
      const b1 = b1ByCode[a2.A] || {};
      const isDat = b1.R === "ĐẠT";
      if (statusFilter === "DAT" && !isDat) continue;
      if (statusFilter === "NOT_DAT" && isDat) continue;
      if (vtvlFilter !== "ALL" && a2.C !== vtvlFilter) continue;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchJob =
          String(a2.A).toLowerCase().includes(q) ||
          String(a2.D || "").toLowerCase().includes(q) ||
          String(a2.E || "").toLowerCase().includes(q) ||
          String(a2.C || "").toLowerCase().includes(q);
        if (!matchJob) continue;
      }

      if (!map[a2.B]) map[a2.B] = [];
      map[a2.B].push({ a2, b1 });
    }
    return map;
  }, [a2Rows, b1ByCode, statusFilter, vtvlFilter, search]);

  const filteredTableB1Rows = useMemo(() => {
    return b1EvaluatedRows.filter((b1) => {
      if (statusFilter === "DAT" && b1.R !== "ĐẠT") return false;
      if (statusFilter === "NOT_DAT" && b1.R === "ĐẠT") return false;
      if (vtvlFilter !== "ALL" && b1.B !== vtvlFilter) return false;
      if (search.trim()) {
        const a2 = a2ByCode[b1.A] || {};
        const q = search.toLowerCase();
        return (
          String(b1.A).toLowerCase().includes(q) ||
          String(a2.D || "").toLowerCase().includes(q) ||
          String(b1.B || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [b1EvaluatedRows, statusFilter, vtvlFilter, search, a2ByCode]);

  const c1ListForDropdown = allUnitC1Rows.length ? allUnitC1Rows : c1Rows;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Thanh Chọn Nhanh Phạm Vi Kê Khai (Toàn đơn vị vs. Cá nhân theo Vị trí / Công việc) */}
      <div className="bg-gradient-to-r from-indigo-950 via-blue-950 to-slate-900 text-white rounded-2xl p-3.5 sm:p-4 shadow-xs border border-indigo-800/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold flex flex-wrap items-center gap-2">
                <span>Chế độ Phạm vi Kê khai & Chấm ĐẠT:</span>
                {scopeMode === "UNIT" && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 text-[11px]">
                    Toàn bộ cơ quan / đơn vị ({allUnitA2Rows.length || a2Rows.length} công việc)
                  </span>
                )}
                {scopeMode === "VTVL" && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-[11px]">
                    Theo Vị trí: {selectedVtvl} ({c1NameMap[selectedVtvl] || ""})
                  </span>
                )}
                {scopeMode === "JOB" && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-[11px]">
                    Chỉ nhập {selectedJobCodes.length} công việc cá nhân đã chọn
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Bạn có thể nhập toàn bộ đơn vị, hoặc chọn đúng <strong>1 Vị trí việc làm</strong> / bấm <strong>&ldquo;Chỉ nhập riêng việc này&rdquo;</strong> ở bất kỳ công việc nào.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setScopeMode && setScopeMode("UNIT")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                scopeMode === "UNIT"
                  ? "bg-white text-slate-950 shadow-xs"
                  : "bg-white/10 hover:bg-white/20 text-slate-200"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Toàn đơn vị</span>
            </button>

            <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1 border border-white/15 min-w-0 max-w-full">
              <Briefcase className="w-3.5 h-3.5 text-amber-300 ml-2 shrink-0" />
              <select
                value={scopeMode === "VTVL" ? selectedVtvl : ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) {
                    setScopeMode && setScopeMode("UNIT");
                  } else {
                    setSelectedVtvl && setSelectedVtvl(val);
                    setScopeMode && setScopeMode("VTVL");
                  }
                }}
                className="bg-transparent text-white text-xs font-bold px-2 py-1 focus:outline-none min-w-0 max-w-[200px] sm:max-w-[260px] truncate cursor-pointer"
              >
                <option value="" className="text-slate-900">
                  -- Chọn riêng 1 Vị trí việc làm --
                </option>
                {c1ListForDropdown.map((c1) => {
                  const shortB =
                    String(c1.B || "").length > 38
                      ? String(c1.B).slice(0, 38) + "..."
                      : c1.B;
                  return (
                    <option key={c1.A} value={c1.A} className="text-slate-900">
                      {c1.A} - {shortB}
                    </option>
                  );
                })}
              </select>
            </div>

            {scopeMode === "JOB" && (
              <div className="flex items-center gap-1 bg-emerald-500/20 rounded-xl p-1 border border-emerald-400/40 min-w-0 max-w-full">
                <select
                  value={selectedJobCodes[0] || ""}
                  onChange={(e) => {
                    if (e.target.value && setSelectedJobCodes) {
                      setSelectedJobCodes([e.target.value]);
                    }
                  }}
                  className="bg-transparent text-emerald-200 text-xs font-bold px-2 py-1 focus:outline-none min-w-0 max-w-[200px] truncate cursor-pointer"
                >
                  {(allUnitA2Rows.length ? allUnitA2Rows : a2Rows).map((job) => {
                    const shortD =
                      String(job.D || "").length > 36
                        ? String(job.D).slice(0, 36) + "..."
                        : job.D;
                    return (
                      <option key={job.A} value={job.A} className="text-slate-900">
                        {job.A} - {shortD}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thanh KPI & Thao tác nhanh */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Bước 1, 2 & 3: Rà Soát Nhiệm Vụ (A1) → Công Việc (A2) → Khối Lượng & Thời Gian (B1)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Nhập <strong>Số sản phẩm/năm (Cột C)</strong>, <strong>Phút/SP (Cột D)</strong>,{" "}
              <strong>Giờ bổ sung (Cột E)</strong> và <strong>Nguồn thời gian (Cột I)</strong> ngay dưới từng công việc để cột cảnh báo chuyển sang <strong className="text-emerald-700">ĐẠT</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
            {stats.notDatCount > 0 && (
              <button
                onClick={handleAutoFillRemainingB1}
                className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>
                  Điền nhanh {stats.notDatCount} công việc chưa ĐẠT theo định mức gợi ý
                </span>
              </button>
            )}
            <div className="grid grid-cols-2 sm:inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1">
              <button
                onClick={() => setViewMode("tree")}
                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  viewMode === "tree"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LayoutList className="w-3.5 h-3.5 shrink-0" />
                <span>Cây Nhiệm vụ</span>
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Table className="w-3.5 h-3.5 shrink-0" />
                <span>Nhập nhanh B1</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 thẻ chỉ số */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] sm:text-xs text-slate-500">Nhiệm vụ trong phạm vi</div>
            <div className="text-base sm:text-xl font-bold text-slate-900 mt-0.5">
              {stats.totalTasks} nhiệm vụ
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="text-[11px] sm:text-xs text-slate-500">Công việc trong phạm vi</div>
            <div className="text-base sm:text-xl font-bold text-slate-900 mt-0.5">
              {stats.totalJobs} công việc
            </div>
          </div>
          <div
            className={`p-3 rounded-xl border ${
              stats.notDatCount === 0
                ? "bg-emerald-50 border-emerald-200"
                : "bg-amber-50 border-amber-200"
            }`}
          >
            <div className="text-[11px] sm:text-xs text-slate-600">Kiểm tra Biểu B1</div>
            <div className="text-base sm:text-xl font-bold mt-0.5 flex flex-wrap items-center gap-1.5">
              <span className="text-emerald-700">
                {stats.datCount}/{stats.totalJobs} ĐẠT
              </span>
              {stats.notDatCount > 0 && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                  Thiếu {stats.notDatCount}
                </span>
              )}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
            <div className="text-[11px] sm:text-xs text-blue-700">Tổng giờ lao động B1</div>
            <div className="text-base sm:text-xl font-bold text-blue-900 mt-0.5">
              {stats.totalHours.toLocaleString("vi-VN")} giờ
            </div>
          </div>
        </div>
      </div>

      {/* Bộ lọc tìm kiếm */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã công việc, tên nhiệm vụ, sản phẩm..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500 hidden sm:block shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg bg-white"
            >
              <option value="ALL">Tất cả trạng thái ({stats.totalJobs})</option>
              <option value="NOT_DAT">Chưa ĐẠT - Cần nhập ({stats.notDatCount})</option>
              <option value="DAT">Đã ĐẠT ({stats.datCount})</option>
            </select>
          </div>

          {scopeMode === "UNIT" && (
            <select
              value={vtvlFilter}
              onChange={(e) => setVtvlFilter(e.target.value)}
              className="w-full sm:w-auto min-w-0 max-w-full truncate px-3 py-2 text-xs font-semibold border border-slate-300 rounded-lg bg-white sm:max-w-[240px]"
            >
              <option value="ALL">Lọc nhanh VTVL ({c1Rows.length})</option>
              {c1Rows.map((c1) => {
                const shortB =
                  String(c1.B || "").length > 38
                    ? String(c1.B).slice(0, 38) + "..."
                    : c1.B;
                return (
                  <option key={c1.A} value={c1.A}>
                    {c1.A} - {shortB}
                  </option>
                );
              })}
            </select>
          )}
        </div>

        {viewMode === "tree" && (
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => expandAll(true)}
              className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
            >
              Mở tất cả
            </button>
            <button
              onClick={() => expandAll(false)}
              className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer"
            >
              Thu gọn
            </button>
          </div>
        )}
      </div>

      {/* HIỂN THỊ CHẾ ĐỘ CÂY NHIỆM VỤ (A1 -> A2 -> B1) */}
      {viewMode === "tree" ? (
        <div className="space-y-3">
          {a1Rows.map((a1) => {
            const jobs = filteredJobsByTask[a1.A] || [];
            if (jobs.length === 0) {
              return null;
            }
            const isExpanded = !!expandedTasks[a1.A];
            const datInTask = jobs.filter((j) => j.b1.R === "ĐẠT").length;

            return (
              <div
                key={a1.A}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* Header Nhiệm vụ A1 */}
                <div
                  onClick={() => toggleTask(a1.A)}
                  className="p-3.5 sm:p-4 bg-slate-50/80 hover:bg-slate-100/70 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/80"
                >
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <div className="mt-0.5 text-slate-500">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-mono text-xs font-bold">
                          {a1.A}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {a1.C}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            datInTask === jobs.length && jobs.length > 0
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {datInTask}/{jobs.length} công việc ĐẠT
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm md:text-base">
                        {a1.B}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                        <strong>Căn cứ (Cột D - A1):</strong> {a1.D} •{" "}
                        <strong>Sản phẩm đầu ra của nhiệm vụ:</strong>{" "}
                        {jobs.map((j) => j.a2.E).join("; ")}
                      </p>
                    </div>
                  </div>

                  {/* Trạng thái nhiệm vụ A1 (Cột F) */}
                  <div
                    className="flex items-center gap-2 shrink-0 pl-7 md:pl-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <label className="text-xs font-semibold text-slate-600">
                      Trạng thái A1:
                    </label>
                    <select
                      value={a1.F || "Tiếp tục thực hiện"}
                      onChange={(e) =>
                        onUpdateA1(a1.rowNum, a1.A, { F: e.target.value })
                      }
                      className="px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                    >
                      {DROPDOWN_OPTIONS.A1_STATUS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Danh sách Công việc A2 + Form B1 */}
                {isExpanded && (
                  <div className="divide-y divide-slate-200">
                    {jobs.map(({ a2, b1 }) => {
                      const isDat = b1.R === "ĐẠT";
                      const vtvlName = c1NameMap[a2.C] || a2.C;
                      const detail = explainJobInDetail(a2);
                      const isGenericH =
                        !b1.H ||
                        String(b1.H).startsWith(
                          "Hồ sơ/sổ/hệ thống nghiệp vụ của đơn vị"
                        );
                      const isIsolatedSingleJob =
                        scopeMode === "JOB" &&
                        selectedJobCodes.length === 1 &&
                        selectedJobCodes[0] === a2.A;

                      return (
                        <div key={a2.A} className="p-3.5 sm:p-5 bg-white space-y-3">
                          {/* Dòng thông tin Công việc A2 */}
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-xs font-bold">
                                  {a2.A}
                                </span>
                                <span
                                  onClick={() => {
                                    if (setSelectedVtvl && setScopeMode) {
                                      setSelectedVtvl(a2.C);
                                      setScopeMode("VTVL");
                                    }
                                  }}
                                  title="Bấm để lọc riêng Vị trí việc làm này"
                                  className="px-2.5 py-0.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold cursor-pointer transition"
                                >
                                  VTVL: {a2.C} ({vtvlName})
                                </span>
                                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">
                                  ĐVT: <strong>{a2.F}</strong>
                                </span>

                                {/* Nút Chỉ nhập riêng công việc này */}
                                {isIsolatedSingleJob ? (
                                  <button
                                    type="button"
                                    onClick={() => setScopeMode && setScopeMode("UNIT")}
                                    className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <Target className="w-3 h-3" />
                                    Đang chỉ nhập riêng việc này (Bấm để xem lại toàn đơn vị)
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (setSelectedJobCodes && setScopeMode) {
                                        setSelectedJobCodes([a2.A]);
                                        setScopeMode("JOB");
                                      }
                                    }}
                                    className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-300 hover:border-emerald-300 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                                  >
                                    <Target className="w-3 h-3 text-emerald-600" />
                                    Chỉ nhập riêng công việc này
                                  </button>
                                )}
                              </div>
                              <div className="font-semibold text-slate-900 text-sm">
                                {a2.D}
                              </div>
                              <div className="text-xs text-slate-500">
                                <strong>Sản phẩm đầu ra (Cột E - A2):</strong> {a2.E} •{" "}
                                <strong>Yêu cầu (Cột G):</strong> {a2.G}
                              </div>
                            </div>

                            {/* Huy hiệu kết quả B1 */}
                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                              {typeof b1.G === "number" && (
                                <div className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                                  Tổng giờ: {b1.G.toFixed(1)}h/năm
                                </div>
                              )}
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                                  isDat
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    : "bg-amber-100 text-amber-900 border border-amber-300"
                                }`}
                              >
                                {isDat ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                                )}
                                {b1.R || "CHƯA NHẬP"}
                              </span>
                            </div>
                          </div>

                          {/* Khung nhập liệu B1 cho công việc này */}
                          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
                            {/* Hộp giải thích dễ hiểu & công thức tính trực tiếp của đúng công việc này */}
                            <div className="p-2.5 sm:p-3 rounded-lg bg-blue-50/80 border border-blue-200/80 text-xs text-slate-700 flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                              <div className="leading-relaxed space-y-1">
                                <div>
                                  <span className="font-bold text-blue-900">
                                    💡 Đang nhập cái gì & Cách đếm ({a2.F}):
                                  </span>{" "}
                                  {detail.howToCountC}{" "}
                                  <span className="font-semibold text-emerald-800">
                                    ({detail.rangeC})
                                  </span>
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-800">
                                    • Thời gian 1 {a2.F} (Cột D):
                                  </span>{" "}
                                  {detail.howToEstimateD}{" "}
                                  <span className="font-semibold text-blue-800">
                                    ({detail.rangeD})
                                  </span>
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-800">
                                    • Giờ bổ sung/năm (Cột E):
                                  </span>{" "}
                                  {detail.howToEstimateE}{" "}
                                  <span className="font-semibold text-indigo-800">
                                    (Gợi ý chuẩn: {detail.suggested.E} giờ/năm)
                                  </span>
                                </div>
                              </div>
                              <div className="shrink-0 px-2.5 py-1.5 rounded-lg bg-white border border-blue-200 font-mono text-[11px] text-blue-950">
                                <strong>Cách tính giờ (G):</strong> ({Number(b1.C) || 0}{" "}
                                {a2.F} × {Number(b1.D) || 0} phút ÷ 60) +{" "}
                                {Number(b1.E) || 0}h BS ={" "}
                                <strong className="text-blue-700">
                                  {typeof b1.G === "number"
                                    ? `${b1.G.toFixed(1)} giờ/năm`
                                    : "0 giờ"}
                                </strong>{" "}
                                (~
                                {typeof b1.G === "number"
                                  ? (b1.G / 1904).toFixed(2)
                                  : "0.00"}{" "}
                                người)
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                              {/* Cột C: Số SP/năm */}
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                  Số SP/năm (Cột C - B1)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  step="any"
                                  value={b1.C ?? ""}
                                  onChange={(e) =>
                                    onUpdateB1(b1.rowNum, b1.A, {
                                      C: e.target.value === "" ? "" : Number(e.target.value),
                                    })
                                  }
                                  placeholder={`Gợi ý: ${detail.suggested.C} ${a2.F || "SP"}/năm`}
                                  className="w-full px-3 py-1.5 text-sm font-semibold border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              {/* Cột D: Phút/SP + Nút chọn Phụ lục 3 */}
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="text-xs font-semibold text-slate-700">
                                    Phút/SP (Cột D)
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => onOpenNormPicker(b1)}
                                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
                                  >
                                    <BookOpen className="w-3 h-3" />
                                    Tra Phụ lục 3
                                  </button>
                                </div>
                                <div className="relative">
                                  <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={b1.D ?? ""}
                                    onChange={(e) =>
                                      onUpdateB1(b1.rowNum, b1.A, {
                                        D: e.target.value === "" ? "" : Number(e.target.value),
                                      })
                                    }
                                    placeholder={`Gợi ý: ${detail.suggested.D} phút`}
                                    className="w-full px-3 py-1.5 text-sm font-semibold border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                  />
                                  {b1.D > 0 && (
                                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 pointer-events-none">
                                      ={(Number(b1.D) / 60).toFixed(1)}h
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Cột E: Giờ bổ sung */}
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                  Giờ bổ sung/năm (Cột E)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  step="any"
                                  value={b1.E ?? ""}
                                  onChange={(e) =>
                                    onUpdateB1(b1.rowNum, b1.A, {
                                      E: e.target.value === "" ? "" : Number(e.target.value),
                                    })
                                  }
                                  placeholder={`Gợi ý: ${detail.suggested.E} giờ`}
                                  className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              {/* Cột J: Căn cứ thời gian */}
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                  Căn cứ thời gian (Cột J)
                                </label>
                                <select
                                  value={b1.J || "Kiểm đếm, ước lượng thực tế"}
                                  onChange={(e) =>
                                    onUpdateB1(b1.rowNum, b1.A, { J: e.target.value })
                                  }
                                  className="w-full px-2.5 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                  {DROPDOWN_OPTIONS.B1_TIME_BASIS.map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Cột C của A2: Đổi VTVL nếu cần */}
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                  Gắn mã VTVL (Cột C - A2)
                                </label>
                                <select
                                  value={a2.C || ""}
                                  onChange={(e) =>
                                    onUpdateA2(a2.rowNum, a2.A, { C: e.target.value })
                                  }
                                  className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                >
                                  {c1ListForDropdown.map((c1) => (
                                    <option key={c1.A} value={c1.A}>
                                      {c1.A} - {c1.B}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Nguồn số lượng (H) & Nguồn thời gian (I) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="block text-xs font-semibold text-slate-700">
                                    Nguồn số lượng sản phẩm (Cột H - B1)
                                  </label>
                                  {isGenericH && detail.sourceH && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onUpdateB1(b1.rowNum, b1.A, {
                                          H: detail.sourceH,
                                        })
                                      }
                                      className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
                                    >
                                      + Điền tên sổ/hồ sơ của việc này
                                    </button>
                                  )}
                                </div>
                                <input
                                  type="text"
                                  value={b1.H || ""}
                                  onChange={(e) =>
                                    onUpdateB1(b1.rowNum, b1.A, { H: e.target.value })
                                  }
                                  placeholder={detail.sourceH}
                                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                                />
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="text-xs font-semibold text-slate-700">
                                    Nguồn xác định thời gian (Cột I - B1 - Bắt buộc)
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const suggested = detail.suggested;
                                      onUpdateB1(b1.rowNum, b1.A, {
                                        C: b1.C !== "" && b1.C !== undefined ? b1.C : suggested.C,
                                        D: b1.D !== "" && b1.D !== undefined ? b1.D : suggested.D,
                                        E: b1.E !== "" && b1.E !== undefined ? b1.E : suggested.E,
                                        H: isGenericH ? suggested.H : b1.H,
                                        I: b1.I || suggested.I,
                                      });
                                    }}
                                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                                  >
                                    + Gợi ý nhanh dòng này
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={b1.I || ""}
                                  onChange={(e) =>
                                    onUpdateB1(b1.rowNum, b1.A, { I: e.target.value })
                                  }
                                  placeholder={detail.sourceI || QUICK_TIME_SOURCES[0]}
                                  className={`w-full px-3 py-1.5 text-xs border rounded-lg bg-white ${
                                    !b1.I
                                      ? "border-amber-400 bg-amber-50/30"
                                      : "border-slate-300"
                                  }`}
                                />
                                {!b1.I && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onUpdateB1(b1.rowNum, b1.A, {
                                          I: detail.sourceI || QUICK_TIME_SOURCES[0],
                                          ...(isGenericH && detail.sourceH
                                            ? { H: detail.sourceH }
                                            : {}),
                                        })
                                      }
                                      className="text-[10px] px-2 py-0.5 rounded bg-emerald-100/90 hover:bg-emerald-200 text-emerald-900 font-semibold transition cursor-pointer"
                                    >
                                      Chọn chuẩn của việc này: &ldquo;
                                      {(detail.sourceI || QUICK_TIME_SOURCES[0]).slice(0, 52)}...&rdquo;
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onUpdateB1(b1.rowNum, b1.A, {
                                          I: QUICK_TIME_SOURCES[1],
                                        })
                                      }
                                      className="text-[10px] px-2 py-0.5 rounded bg-slate-200/80 hover:bg-blue-100 text-slate-700 hover:text-blue-800 transition cursor-pointer"
                                    >
                                      Chọn mẫu chung: &ldquo;
                                      {QUICK_TIME_SOURCES[1].slice(0, 44)}...&rdquo;
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* HIỂN THỊ CHẾ ĐỘ NHẬP NHANH B1 */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* MOBILE CARDS KHI Ở CHẾ ĐỘ NHẬP NHANH (< lg) */}
          <div className="lg:hidden divide-y divide-slate-200">
            {filteredTableB1Rows.map((b1) => {
              const a2 = a2ByCode[b1.A] || {};
              const isDat = b1.R === "ĐẠT";
              return (
                <div key={b1.A} className="p-4 space-y-3 bg-white">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                          {b1.A}
                        </span>
                        <span className="font-mono text-xs font-semibold text-indigo-700">
                          {b1.B}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-1">
                        {a2.D}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        SP: {a2.E} ({a2.F})
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                        isDat
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {b1.R}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1 text-center">
                        Số SP/năm (C)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={b1.C ?? ""}
                        onChange={(e) =>
                          onUpdateB1(b1.rowNum, b1.A, {
                            C: e.target.value === "" ? "" : Number(e.target.value),
                          })
                        }
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-center text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-semibold text-slate-600">
                          Phút/SP (D)
                        </label>
                        <button
                          type="button"
                          onClick={() => onOpenNormPicker(b1)}
                          className="text-[10px] font-bold text-blue-600"
                        >
                          PL3
                        </button>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={b1.D ?? ""}
                        onChange={(e) =>
                          onUpdateB1(b1.rowNum, b1.A, {
                            D: e.target.value === "" ? "" : Number(e.target.value),
                          })
                        }
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-center text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-600 mb-1 text-center">
                        Giờ BS (E)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={b1.E ?? ""}
                        onChange={(e) =>
                          onUpdateB1(b1.rowNum, b1.A, {
                            E: e.target.value === "" ? "" : Number(e.target.value),
                          })
                        }
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-center text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                      Nguồn thời gian (Cột I) • Tổng giờ:{" "}
                      <strong className="text-blue-700">
                        {typeof b1.G === "number" ? `${b1.G.toFixed(1)}h` : "—"}
                      </strong>
                    </label>
                    <input
                      type="text"
                      value={b1.I || ""}
                      onChange={(e) =>
                        onUpdateB1(b1.rowNum, b1.A, { I: e.target.value })
                      }
                      placeholder="Nguồn thời gian..."
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP TABLE KHI Ở CHẾ ĐỘ NHẬP NHANH (>= lg) */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 uppercase">
                  <th className="py-3 px-3 w-36">Mã CV (A)</th>
                  <th className="py-3 px-3 min-w-[220px]">Tên công việc & Sản phẩm (A2)</th>
                  <th className="py-3 px-2 w-28">Mã VTVL (B)</th>
                  <th className="py-3 px-2 w-24 text-center">Số SP/năm (C)</th>
                  <th className="py-3 px-2 w-28 text-center">Phút/SP (D)</th>
                  <th className="py-3 px-2 w-24 text-center">Giờ BS (E)</th>
                  <th className="py-3 px-2 min-w-[200px]">Nguồn thời gian (I)</th>
                  <th className="py-3 px-2 w-24 text-right">Tổng giờ (G)</th>
                  <th className="py-3 px-3 w-36 text-center">Cảnh báo (R)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTableB1Rows.map((b1) => {
                  const a2 = a2ByCode[b1.A] || {};
                  const isDat = b1.R === "ĐẠT";
                  return (
                    <tr key={b1.A} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                        {b1.A}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900">{a2.D}</div>
                        <div className="text-slate-500">
                          SP: {a2.E} ({a2.F})
                        </div>
                      </td>
                      <td className="py-2.5 px-2 font-mono text-indigo-700 font-semibold">
                        {b1.B}
                      </td>
                      <td className="py-2.5 px-2">
                        <input
                          type="number"
                          min="0"
                          value={b1.C ?? ""}
                          onChange={(e) =>
                            onUpdateB1(b1.rowNum, b1.A, {
                              C: e.target.value === "" ? "" : Number(e.target.value),
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded text-center font-semibold"
                        />
                      </td>
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            value={b1.D ?? ""}
                            onChange={(e) =>
                              onUpdateB1(b1.rowNum, b1.A, {
                                D: e.target.value === "" ? "" : Number(e.target.value),
                              })
                            }
                            className="w-full px-2 py-1 border border-slate-300 rounded text-center font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() => onOpenNormPicker(b1)}
                            title="Chọn từ Phụ lục 3"
                            className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 px-2">
                        <input
                          type="number"
                          min="0"
                          value={b1.E ?? ""}
                          onChange={(e) =>
                            onUpdateB1(b1.rowNum, b1.A, {
                              E: e.target.value === "" ? "" : Number(e.target.value),
                            })
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded text-center"
                        />
                      </td>
                      <td className="py-2.5 px-2">
                        <input
                          type="text"
                          value={b1.I || ""}
                          onChange={(e) =>
                            onUpdateB1(b1.rowNum, b1.A, { I: e.target.value })
                          }
                          placeholder="Nguồn thời gian..."
                          className="w-full px-2 py-1 border border-slate-300 rounded"
                        />
                      </td>
                      <td className="py-2.5 px-2 text-right font-bold text-blue-800">
                        {typeof b1.G === "number" ? b1.G.toFixed(1) : "—"}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            isDat
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          {b1.R}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

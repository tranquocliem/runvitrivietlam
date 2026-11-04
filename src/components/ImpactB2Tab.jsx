"use client";

import React, { useState, useMemo } from "react";
import { DROPDOWN_OPTIONS } from "@/data/phuLuc3Data";
import { CheckCircle2, AlertTriangle, Info, Search, Zap, RotateCcw } from "lucide-react";

export default function ImpactB2Tab({ b2EvaluatedRows, b1EvaluatedRows, onUpdateB2, onBatchUpdateB2 }) {
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("ALL"); // "ALL" | "ACTIVE" | "ERROR"

  const b1Map = useMemo(() => {
    const m = {};
    for (const r of b1EvaluatedRows) {
      if (r.A) m[r.A] = r;
    }
    return m;
  }, [b1EvaluatedRows]);

  const stats = useMemo(() => {
    let refCount = 0;
    let datCount = 0;
    let errCount = 0;
    let totalSavedHours = 0;
    let totalAddedHours = 0;

    for (const r of b2EvaluatedRows) {
      if (r.P === "THAM KHẢO – KHÔNG TÍNH") {
        refCount++;
      } else if (r.P === "ĐẠT") {
        datCount++;
        totalSavedHours += Number(r.N) || 0;
        totalAddedHours += Number(r.O) || 0;
      } else {
        errCount++;
      }
    }
    return {
      total: b2EvaluatedRows.length,
      refCount,
      datCount,
      errCount,
      netHours: Math.round((totalAddedHours - totalSavedHours) * 10) / 10,
    };
  }, [b2EvaluatedRows]);

  const handleResetAllToReference = () => {
    const updates = b2EvaluatedRows
      .filter((r) => r.P !== "THAM KHẢO – KHÔNG TÍNH" && r.P !== "ĐẠT")
      .map((r) => ({
        rowNum: r.rowNum,
        A: r.A,
        changes: {
          M: "Ước lượng tham khảo",
          L: "Đã đo sau thay đổi (không trừ)",
        },
      }));
    if (updates.length > 0) onBatchUpdateB2(updates);
  };

  const filteredRows = useMemo(() => {
    return b2EvaluatedRows.filter((r) => {
      if (filterMode === "ACTIVE" && r.M === "Ước lượng tham khảo") return false;
      if (filterMode === "ERROR" && (r.P === "THAM KHẢO – KHÔNG TÍNH" || r.P === "ĐẠT"))
        return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          String(r.A || "").toLowerCase().includes(q) ||
          String(r.D || "").toLowerCase().includes(q) ||
          String(r.B || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [b2EvaluatedRows, filterMode, search]);

  return (
    <div className="space-y-5">
      {/* Header & Hướng dẫn */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Bước 4: Đánh Giá Tác Động Chuyển Đổi Số, Thuê Dịch Vụ, Tự Chủ, Xã Hội Hóa (Biểu B2)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Chỉ ghi nhận khi tác động <strong>đã thực tế xảy ra trong kỳ và có bằng chứng</strong>. Nếu công việc không có thay đổi hoặc thời gian tại B1 đã đo sau khi áp dụng phần mềm, giữ trạng thái{" "}
              <strong className="text-slate-800">&ldquo;Ước lượng tham khảo&rdquo;</strong> (báo{" "}
              <em>THAM KHẢO – KHÔNG TÍNH</em> là hợp lệ 100%, không gây lỗi ở Biểu C3).
            </p>
          </div>

          {stats.errCount > 0 && (
            <button
              onClick={handleResetAllToReference}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              Đặt {stats.errCount} dòng lỗi về &ldquo;Ước lượng tham khảo&rdquo; (Hợp lệ C3)
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500">Dòng Tham khảo (Không trừ giờ)</div>
            <div className="text-xl font-bold text-slate-800 mt-0.5">
              {stats.refCount}/{stats.total}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="text-xs text-emerald-700">Dòng Tác động thực tế ĐẠT</div>
            <div className="text-xl font-bold text-emerald-900 mt-0.5">
              {stats.datCount} dòng
            </div>
          </div>
          <div
            className={`p-3 rounded-xl border ${
              stats.errCount === 0
                ? "bg-slate-50 border-slate-200"
                : "bg-rose-50 border-rose-200"
            }`}
          >
            <div className="text-xs text-slate-600">Dòng Chưa đủ căn cứ (Cần xử lý)</div>
            <div
              className={`text-xl font-bold mt-0.5 ${
                stats.errCount === 0 ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {stats.errCount} dòng lỗi
            </div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
            <div className="text-xs text-blue-700">Tổng giờ tác động ròng sang C3</div>
            <div className="text-xl font-bold text-blue-900 mt-0.5">
              {stats.netHours > 0 ? `+${stats.netHours}` : stats.netHours} giờ
            </div>
          </div>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã công việc, tên công đoạn..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode("ALL")}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border cursor-pointer ${
              filterMode === "ALL"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-700 border-slate-300"
            }`}
          >
            Tất cả ({stats.total})
          </button>
          <button
            onClick={() => setFilterMode("ACTIVE")}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border cursor-pointer ${
              filterMode === "ACTIVE"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-700 border-slate-300"
            }`}
          >
            Đang bật kiểm chứng ({stats.datCount + stats.errCount})
          </button>
          {stats.errCount > 0 && (
            <button
              onClick={() => setFilterMode("ERROR")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                filterMode === "ERROR"
                  ? "bg-rose-600 text-white border-rose-600"
                  : "bg-rose-50 text-rose-700 border-rose-300"
              }`}
            >
              Đang báo lỗi ({stats.errCount})
            </button>
          )}
        </div>
      </div>

      {/* Danh sách B2_CT */}
      <div className="space-y-3">
        {filteredRows.map((r) => {
          const b1 = b1Map[r.A] || {};
          const isRef = r.P === "THAM KHẢO – KHÔNG TÍNH";
          const isDat = r.P === "ĐẠT";

          return (
            <div
              key={`${r.rowNum}-${r.A}`}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-xs font-bold">
                      {r.A}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono text-xs font-semibold">
                      VTVL: {r.B || "—"}
                    </span>
                    <span className="text-xs text-slate-500">
                      Sản lượng B1: <strong>{b1.C ?? "—"}</strong> • Giờ B1:{" "}
                      <strong>{typeof b1.G === "number" ? `${b1.G.toFixed(1)}h` : "—"}</strong>
                    </span>
                  </div>
                  <div className="font-semibold text-slate-900 text-sm">{r.D}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (r.M === "Ước lượng tham khảo") {
                        const maxSp = Number(b1.C) || 10;
                        const curMin = Number(b1.D) || 60;
                        onUpdateB2(r.rowNum, r.A, {
                          C: "Số hóa",
                          E: maxSp,
                          F: Math.round(curMin * 1.25),
                          G: curMin,
                          J: "Hệ thống quản lý văn bản điện tử và chữ ký số đã triển khai trong kỳ 01/10/2025–30/9/2026",
                          K: "01/10/2025–30/9/2026",
                          L: "Đã đo sau thay đổi (không trừ)",
                          M: "Đã kiểm chứng",
                          S: "Đã đối chiếu",
                        });
                      } else {
                        onUpdateB2(r.rowNum, r.A, {
                          M: "Ước lượng tham khảo",
                        });
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      r.M === "Ước lượng tham khảo"
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    {r.M === "Ước lượng tham khảo"
                      ? "Kê khai tác động thực tế"
                      : "Chuyển về Tham khảo"}
                  </button>

                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold ${
                      isDat
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : isRef
                        ? "bg-slate-100 text-slate-700 border border-slate-300"
                        : "bg-rose-100 text-rose-800 border border-rose-300"
                    }`}
                  >
                    {isDat ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isRef ? (
                      <Info className="w-4 h-4 text-slate-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    )}
                    {r.P}
                  </span>
                </div>
              </div>

              {/* Nếu bật kiểm chứng hoặc đang chỉnh sửa chi tiết */}
              {r.M !== "Ước lượng tham khảo" && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Loại tác động (Cột C)
                      </label>
                      <select
                        value={r.C || "Số hóa"}
                        onChange={(e) => onUpdateB2(r.rowNum, r.A, { C: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        {DROPDOWN_OPTIONS.B2_IMPACT_TYPE.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        SP áp dụng (Cột E ≤ {b1.C || 0})
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={r.E ?? ""}
                        onChange={(e) =>
                          onUpdateB2(r.rowNum, r.A, {
                            E: e.target.value === "" ? "" : Number(e.target.value),
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phút trước (Cột F)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={r.F ?? ""}
                        onChange={(e) =>
                          onUpdateB2(r.rowNum, r.A, {
                            F: e.target.value === "" ? "" : Number(e.target.value),
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phút sau (Cột G)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={r.G ?? ""}
                        onChange={(e) =>
                          onUpdateB2(r.rowNum, r.A, {
                            G: e.target.value === "" ? "" : Number(e.target.value),
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Giờ việc mới (Cột I)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={r.I ?? ""}
                        onChange={(e) =>
                          onUpdateB2(r.rowNum, r.A, {
                            I: e.target.value === "" ? "" : Number(e.target.value),
                          })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Cơ sở B1 (Cột L)
                      </label>
                      <select
                        value={r.L || "Đã đo sau thay đổi (không trừ)"}
                        onChange={(e) => onUpdateB2(r.rowNum, r.A, { L: e.target.value })}
                        className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        {DROPDOWN_OPTIONS.B2_B1_BASIS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nguồn minh chứng (Cột J)
                      </label>
                      <input
                        type="text"
                        value={r.J || ""}
                        onChange={(e) => onUpdateB2(r.rowNum, r.A, { J: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Trạng thái kiểm chứng (Cột M)
                      </label>
                      <select
                        value={r.M || "Đã kiểm chứng"}
                        onChange={(e) => onUpdateB2(r.rowNum, r.A, { M: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        {DROPDOWN_OPTIONS.B2_STATUS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Đối chiếu trùng (Cột S)
                      </label>
                      <select
                        value={r.S || "Đã đối chiếu"}
                        onChange={(e) => onUpdateB2(r.rowNum, r.A, { S: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        {DROPDOWN_OPTIONS.B2_DEDUP.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


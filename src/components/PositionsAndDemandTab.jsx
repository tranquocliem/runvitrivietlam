"use client";

import React, { useState, useMemo } from "react";
import { DROPDOWN_OPTIONS } from "@/data/phuLuc3Data";
import { suggestC1Row, suggestC3Row } from "@/utils/smartPreset";
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Users,
  Clock,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function PositionsAndDemandTab({
  c1EvaluatedRows,
  c2Rows,
  c3EvaluatedRows,
  onUpdateC1,
  onUpdateC2,
  onUpdateC3,
  onBatchFixC1AndC3,
}) {
  const [expandedC2, setExpandedC2] = useState({});

  const c2Map = useMemo(() => {
    const m = {};
    for (const r of c2Rows) {
      if (r.A) m[r.A] = r;
    }
    return m;
  }, [c2Rows]);

  const c1Map = useMemo(() => {
    const m = {};
    for (const r of c1EvaluatedRows) {
      if (r.A) m[r.A] = r;
    }
    return m;
  }, [c1EvaluatedRows]);

  const stats = useMemo(() => {
    let c1Dat = 0;
    let c3Dat = 0;
    let totalPeopleNeed = 0;
    let totalHoursNet = 0;

    for (const r of c1EvaluatedRows) {
      if (r.K === "ĐẠT") c1Dat++;
    }
    for (const r of c3EvaluatedRows) {
      if (r.M === "ĐẠT") c3Dat++;
      if (typeof r.J === "number") totalPeopleNeed += r.J;
      if (typeof r.E === "number") totalHoursNet += r.E;
    }

    return {
      totalVTVL: c3EvaluatedRows.length,
      c1Dat,
      c3Dat,
      notDatCount: c3EvaluatedRows.length - c3Dat + (c1EvaluatedRows.length - c1Dat),
      totalPeopleNeed,
      totalHoursNet: Math.round(totalHoursNet * 10) / 10,
    };
  }, [c1EvaluatedRows, c3EvaluatedRows]);

  const toggleC2 = (code) => {
    setExpandedC2((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  return (
    <div className="space-y-5">
      {/* Header & KPI */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Bước 5 & 6: Rà Soát Vị Trí Việc Làm, Năng Lực (C1, C2) & Xác Định Nhu Cầu Nhân Lực (C3)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Xác nhận quỹ giờ làm việc tại <strong>Biểu C1</strong> (40 giờ/tuần = 1.904 giờ/năm hoặc chế độ đặc thù giáo viên), đối chiếu số người quy đổi PP2 từ B1 và chốt{" "}
              <strong>Số người cần bố trí (Cột J - Biểu C3)</strong>.
            </p>
          </div>

          <button
            onClick={onBatchFixC1AndC3}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            Chuẩn hóa & Điền kết luận mẫu cho toàn bộ VTVL (C1 & C3 ĐẠT 100%)
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500">Danh mục VTVL (Biểu C1)</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              {stats.c1Dat}/{c1EvaluatedRows.length} ĐẠT
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500">Nhu cầu nhân lực (Biểu C3)</div>
            <div className="text-xl font-bold text-emerald-700 mt-0.5">
              {stats.c3Dat}/{stats.totalVTVL} ĐẠT
            </div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
            <div className="text-xs text-blue-700">Tổng giờ ròng chuyển sang C3</div>
            <div className="text-xl font-bold text-blue-900 mt-0.5">
              {stats.totalHoursNet.toLocaleString("vi-VN")} giờ
            </div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
            <div className="text-xs text-indigo-700">Tổng số người cần bố trí (Cột J)</div>
            <div className="text-xl font-bold text-indigo-900 mt-0.5 flex items-center gap-1.5">
              <Users className="w-5 h-5 text-indigo-600" />
              {stats.totalPeopleNeed} người
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách Thẻ VTVL (Gộp C1 + C2 + C3 trên 1 thẻ) */}
      <div className="space-y-4">
        {c3EvaluatedRows.map((c3) => {
          const c1 = c1Map[c3.A] || {};
          const c2 = c2Map[c3.A] || {};
          const isC1Dat = c1.K === "ĐẠT";
          const isC3Dat = c3.M === "ĐẠT";
          const hasPP1 = String(c3.B || "").includes("PP1");
          const hasPP2 = String(c3.B || "").includes("PP2");
          const hasPP3 = String(c3.B || "").includes("PP3");
          const showC2 = !!expandedC2[c3.A];

          return (
            <div
              key={c3.A}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
            >
              {/* Header VTVL */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white font-mono text-xs font-bold">
                      {c3.A}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-xs font-semibold">
                      {c1.C || "Viên chức"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                      Phương pháp: {c3.B}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {c1.B || c3.A}
                  </h3>
                </div>

                {/* Cặp huy hiệu cảnh báo C1 & C3 */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      isC1Dat
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-amber-50 text-amber-900 border-amber-300"
                    }`}
                  >
                    {isC1Dat ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    C1: {c1.K || "Chưa đạt"}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      isC3Dat
                        ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                        : "bg-rose-50 text-rose-900 border-rose-300"
                    }`}
                  >
                    {isC3Dat ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    )}
                    C3: {c3.M || "Chưa đạt"}
                  </span>

                  {(!isC1Dat || !isC3Dat) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (c1.rowNum) {
                          const fixedC1 = suggestC1Row(c1);
                          onUpdateC1(c1.rowNum, c1.A, {
                            G: fixedC1.G,
                            H: fixedC1.H,
                            I: fixedC1.I,
                            J: fixedC1.J,
                          });
                        }
                        const fixedC3 = suggestC3Row(c3);
                        onUpdateC3(c3.rowNum, c3.A, {
                          H: fixedC3.H,
                          I: fixedC3.I,
                          J: fixedC3.J,
                          K: fixedC3.K,
                          L: fixedC3.L,
                        });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
                    >
                      Điền chuẩn VTVL này
                    </button>
                  )}
                </div>
              </div>

              {/* Nội dung chia 2 phần: Trái = C1 (Quỹ giờ), Phải = C3 (Tính toán & Kết luận nhân lực) */}
              <div className="p-4 md:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* CỘT TRÁI (5/12): BIỂU C1 - QUỸ GIỜ & TRẠNG THÁI */}
                <div className="lg:col-span-5 space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Biểu C1: Chế độ làm việc & Quỹ giờ
                    </span>
                    <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                      Mẫu số giờ (Cột E): {c1.E || "Chưa có"} giờ/năm
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Chế độ làm việc (Cột J - C1)
                      </label>
                      <select
                        value={c1.J || "Phổ biến (40 giờ/tuần)"}
                        onChange={(e) => {
                          const mode = e.target.value;
                          onUpdateC1(c1.rowNum, c1.A, {
                            J: mode,
                            H: mode === "Đặc thù" ? c1.H || 1760 : "",
                            I: mode === "Đặc thù" ? "Đã kiểm chứng" : c1.I || "",
                          });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs font-semibold border border-slate-300 rounded-lg bg-white"
                      >
                        {DROPDOWN_OPTIONS.C1_WORK_MODE.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Trạng thái rà soát (Cột G - C1)
                      </label>
                      <select
                        value={c1.G || "Tiếp tục sử dụng"}
                        onChange={(e) =>
                          onUpdateC1(c1.rowNum, c1.A, { G: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        {DROPDOWN_OPTIONS.C1_STATUS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {c1.J === "Đặc thù" && (
                    <div className="grid grid-cols-2 gap-2.5 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200">
                      <div>
                        <label className="block text-xs font-semibold text-amber-900 mb-1">
                          Giờ riêng đặc thù/năm (Cột H)
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={c1.H ?? ""}
                          onChange={(e) =>
                            onUpdateC1(c1.rowNum, c1.A, {
                              H: e.target.value === "" ? "" : Number(e.target.value),
                            })
                          }
                          placeholder="VD: 1760"
                          className="w-full px-2.5 py-1 text-xs font-bold border border-amber-300 rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-amber-900 mb-1">
                          Xác nhận giờ riêng (Cột I)
                        </label>
                        <select
                          value={c1.I || "Đã kiểm chứng"}
                          onChange={(e) =>
                            onUpdateC1(c1.rowNum, c1.A, { I: e.target.value })
                          }
                          className="w-full px-2 py-1 text-xs font-semibold border border-amber-300 rounded bg-white"
                        >
                          {DROPDOWN_OPTIONS.C1_VERIFY.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Căn cứ quỹ giờ / định mức (Cột F - C1)
                    </label>
                    <input
                      type="text"
                      value={c1.F || ""}
                      onChange={(e) =>
                        onUpdateC1(c1.rowNum, c1.A, { F: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleC2(c3.A)}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                      Xem / Sửa Tóm tắt Trách nhiệm & Khung năng lực (Biểu C2)
                    </span>
                    {showC2 ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* CỘT PHẢI (7/12): BIỂU C3 - XÁC ĐỊNH NHU CẦU NHÂN LỰC */}
                <div className="lg:col-span-7 space-y-3">
                  {/* Dòng tự động tính từ B1 và B2 */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center bg-blue-50/60 border border-blue-200/80 rounded-xl p-2.5 text-xs">
                    <div>
                      <div className="text-slate-500">Giờ B1 ĐẠT (Cột C)</div>
                      <div className="font-bold text-slate-900 text-sm">
                        {typeof c3.C === "number" ? `${c3.C.toFixed(1)}h` : "0h"}
                      </div>
                      {c3.N > 0 && (
                        <div className="text-[10px] text-rose-600 font-semibold">
                          ({c3.N} dòng B1 chưa ĐẠT)
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-slate-500">Tác động B2 (Cột D)</div>
                      <div className="font-bold text-slate-900 text-sm">
                        {typeof c3.D === "number" ? `${c3.D.toFixed(1)}h` : "0h"}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Giờ ròng (Cột E)</div>
                      <div className="font-bold text-blue-800 text-sm">
                        {typeof c3.E === "number" ? `${c3.E.toFixed(1)}h` : "—"}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg border border-blue-200 p-1">
                      <div className="text-blue-700 font-semibold">
                        Người quy đổi PP2 (G)
                      </div>
                      <div className="font-bold text-blue-900 text-sm">
                        {typeof c3.G === "number" ? c3.G.toFixed(2) : "Không dùng PP2"}
                      </div>
                    </div>
                  </div>

                  {/* Các ô nhập liệu của C3 */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phương pháp (Cột B)
                      </label>
                      <select
                        value={c3.B || "PP1"}
                        onChange={(e) =>
                          onUpdateC3(c3.rowNum, c3.A, { B: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                      >
                        {DROPDOWN_OPTIONS.C3_METHODS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Số người PP1 (Cột H)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        disabled={!hasPP1}
                        value={c3.H ?? ""}
                        onChange={(e) =>
                          onUpdateC3(c3.rowNum, c3.A, {
                            H: e.target.value === "" ? "" : Number(e.target.value),
                          })
                        }
                        placeholder={hasPP1 ? "Nhập số người PP1" : "Không áp dụng"}
                        className={`w-full px-2.5 py-1.5 text-xs font-semibold border rounded-lg ${
                          hasPP1
                            ? "border-slate-300 bg-white"
                            : "border-slate-200 bg-slate-100 text-slate-400"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Số người PP3 (Cột I)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        disabled={!hasPP3}
                        value={c3.I ?? ""}
                        onChange={(e) =>
                          onUpdateC3(c3.rowNum, c3.A, {
                            I: e.target.value === "" ? "" : Number(e.target.value),
                          })
                        }
                        placeholder={hasPP3 ? "Nhập số người PP3" : "Không áp dụng"}
                        className={`w-full px-2.5 py-1.5 text-xs font-semibold border rounded-lg ${
                          hasPP3
                            ? "border-slate-300 bg-white"
                            : "border-slate-200 bg-slate-100 text-slate-400"
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-indigo-900 mb-1">
                        Kết luận cần bố trí (Cột J) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={c3.J ?? ""}
                        onChange={(e) =>
                          onUpdateC3(c3.rowNum, c3.A, {
                            J: e.target.value === "" ? "" : Number(e.target.value),
                          })
                        }
                        placeholder="Số người chốt"
                        className="w-full px-2.5 py-1.5 text-sm font-bold border-2 border-indigo-500 rounded-lg bg-indigo-50/40 text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-3">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Giải trình & Căn cứ xác định nhu cầu (Cột K - C3)
                      </label>
                      <input
                        type="text"
                        value={c3.K || ""}
                        onChange={(e) =>
                          onUpdateC3(c3.rowNum, c3.A, { K: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Trạng thái xác nhận (Cột L)
                      </label>
                      <select
                        value={c3.L || "Chưa đủ dữ liệu"}
                        onChange={(e) =>
                          onUpdateC3(c3.rowNum, c3.A, { L: e.target.value })
                        }
                        className={`w-full px-2.5 py-1.5 text-xs font-bold border rounded-lg ${
                          c3.L === "Đã kiểm chứng"
                            ? "border-emerald-400 bg-emerald-50 text-emerald-900"
                            : "border-amber-400 bg-amber-50 text-amber-900"
                        }`}
                      >
                        {DROPDOWN_OPTIONS.C3_STATUS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Khung mở rộng Biểu C2 (Trách nhiệm & Khung năng lực) */}
              {showC2 && c2.rowNum && (
                <div className="px-5 py-4 bg-indigo-50/30 border-t border-slate-200 space-y-3 text-xs">
                  <div className="font-bold text-indigo-950">
                    Biểu C2 – Tóm tắt Trách nhiệm & Khung năng lực của VTVL ({c2.A})
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Tóm tắt trách nhiệm & sản phẩm chính (Cột B - C2)
                      </label>
                      <textarea
                        rows={2}
                        value={c2.B || ""}
                        onChange={(e) =>
                          onUpdateC2(c2.rowNum, c2.A, { B: e.target.value })
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Năng lực chuyên môn & Tiêu chuẩn chức danh (Cột D - C2)
                      </label>
                      <textarea
                        rows={2}
                        value={c2.D || ""}
                        onChange={(e) =>
                          onUpdateC2(c2.rowNum, c2.A, { D: e.target.value })
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Số Quyết định phê duyệt / Tên tệp lưu bản mô tả VTVL (Cột G - C2)
                    </label>
                    <input
                      type="text"
                      value={c2.G || ""}
                      onChange={(e) =>
                        onUpdateC2(c2.rowNum, c2.A, { G: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
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


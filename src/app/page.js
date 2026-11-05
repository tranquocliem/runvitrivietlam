"use client";

import React, { useState, useEffect, useMemo } from "react";
import initialData from "@/data/dvsnData.json";
import { UNIT_TYPES } from "@/data/phuLuc3Data";
import {
  evaluateB1Row,
  evaluateB2CTRow,
  evaluateC1Row,
  evaluateC3Row,
  evaluateD1Rows,
  evaluateD2Rows,
} from "@/utils/validationEngine";
import {
  suggestB1Metrics,
  suggestC1Row,
  suggestC3Row,
  generateD1FromC3,
  generateD2FromC3,
} from "@/utils/smartPreset";
import { exportToOriginalExcel, importFromExcelFile } from "@/utils/excelExportImport";

import UnitSelectorTab from "@/components/UnitSelectorTab";
import TasksAndWorkloadTab from "@/components/TasksAndWorkloadTab";
import ImpactB2Tab from "@/components/ImpactB2Tab";
import PositionsAndDemandTab from "@/components/PositionsAndDemandTab";
import StaffingPlanTab from "@/components/StaffingPlanTab";
import ReviewAndExportTab from "@/components/ReviewAndExportTab";
import ReferenceModal from "@/components/ReferenceModal";
import UserGuideTab from "@/components/UserGuideTab";

import {
  Building2,
  ClipboardList,
  Zap,
  Users,
  CalendarRange,
  ShieldCheck,
  BookOpen,
  Download,
  Upload,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Award,
  UserCheck,
  Target,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

const STORAGE_KEY = "vtvl_truonglong_dvsn_xa_v3";

function belongsToUnit(code, unitCode) {
  if (!code) return false;
  if (unitCode === "ALL") return true;
  const s = String(code);
  if (unitCode === "TH") {
    return (s.includes("-A1-TH-") || s.includes("-TH-")) && !s.includes("-THCS-");
  }
  return s.includes(`-A1-${unitCode}-`) || s.includes(`-${unitCode}-`);
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("UNIT"); // "UNIT" | "A1_A2_B1" | "B2" | "C1_C2_C3" | "D1_D2" | "EXPORT"
  const [selectedUnit, setSelectedUnit] = useState("DVTH"); // Mặc định Trung tâm Dịch vụ tổng hợp xã Trường Long
  const [unitMeta, setUnitMeta] = useState({
    unitName: "Trung tâm Dịch vụ tổng hợp xã Trường Long",
    unitCode: "DVTH_TRUONGLONG",
    communeName: "Xã Trường Long, TP. Cần Thơ",
    version: "v1",
    sendDate: "06112026",
  });

  // Chế độ phạm vi kê khai: "UNIT" (Toàn đơn vị) | "VTVL" (1 Vị trí việc làm) | "JOB" (1 hoặc vài Công việc cụ thể)
  const [scopeMode, setScopeMode] = useState("UNIT");
  const [selectedVtvl, setSelectedVtvl] = useState("");
  const [selectedJobCodes, setSelectedJobCodes] = useState([]);

  // Dữ liệu 09 biểu
  const [sheetState, setSheetState] = useState(() => ({
    A1: initialData.A1.filter((r) => r.A),
    A2: initialData.A2.filter((r) => r.A),
    B1: initialData.B1.filter((r) => r.A),
    B2_CT: initialData.B2_CT.filter((r) => r.A),
    C1: initialData.C1.filter((r) => r.A),
    C2: initialData.C2.filter((r) => r.A),
    C3: initialData.C3.filter((r) => r.A),
    D1: [],
    D2: [],
  }));

  const [isRefModalOpen, setIsRefModalOpen] = useState(false);
  const [normPickerTargetB1, setNormPickerTargetB1] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.sheetState && parsed.sheetState.A1) {
          setSheetState(parsed.sheetState);
        }
        if (parsed.unitMeta) setUnitMeta(parsed.unitMeta);
        if (parsed.selectedUnit) setSelectedUnit(parsed.selectedUnit);
        if (parsed.scopeMode) setScopeMode(parsed.scopeMode);
        if (parsed.selectedVtvl) setSelectedVtvl(parsed.selectedVtvl);
        if (Array.isArray(parsed.selectedJobCodes)) {
          setSelectedJobCodes(parsed.selectedJobCodes);
        }
      }
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          sheetState,
          unitMeta,
          selectedUnit,
          scopeMode,
          selectedVtvl,
          selectedJobCodes,
        })
      );
    } catch (e) {
      console.error("Failed to save state", e);
    }
  }, [sheetState, unitMeta, selectedUnit, scopeMode, selectedVtvl, selectedJobCodes]);

  // Hàm chuyển đổi đơn vị kèm cập nhật tên mặc định xã Trường Long
  const handleSelectUnitChange = (code) => {
    setSelectedUnit(code);
    setScopeMode("UNIT");
    setSelectedVtvl("");
    setSelectedJobCodes([]);
    const u = UNIT_TYPES.find((item) => item.code === code);
    if (u) {
      setUnitMeta((prev) => ({
        ...prev,
        unitName: `${u.shortName} xã Trường Long`,
        unitCode: `${u.code}_TRUONGLONG`,
        communeName: prev.communeName || "Xã Trường Long, TP. Cần Thơ",
      }));
    } else if (code === "ALL") {
      setUnitMeta((prev) => ({
        ...prev,
        unitName: "Khối Đơn vị sự nghiệp công lập xã Trường Long",
        unitCode: "DVSN_TRUONGLONG",
      }));
    }
  };

  // Bản đồ tra cứu DM_SAN_PHAM và A2
  const dmSanPhamMap = useMemo(() => {
    const m = {};
    for (const r of initialData.DM_SAN_PHAM || []) {
      if (r.A) m[r.A] = r;
    }
    return m;
  }, []);

  const a2Map = useMemo(() => {
    const m = {};
    for (const r of sheetState.A2) {
      if (r.A) m[r.A] = r;
    }
    return m;
  }, [sheetState.A2]);

  // Tính toán toàn bộ các biểu theo đúng công thức Excel
  const allEvaluated = useMemo(() => {
    const b1Eval = sheetState.B1.map((r) => evaluateB1Row(r, a2Map, dmSanPhamMap));
    const b2Eval = sheetState.B2_CT.map((r) => evaluateB2CTRow(r, a2Map, b1Eval));
    const c1Eval = sheetState.C1.map((r) => evaluateC1Row(r));
    const c3Eval = sheetState.C3.map((r) => evaluateC3Row(r, c1Eval, b1Eval, b2Eval));
    const d1Eval = evaluateD1Rows(sheetState.D1, c1Eval);
    const d2Eval = evaluateD2Rows(sheetState.D2, c3Eval);

    return {
      B1: b1Eval,
      B2_CT: b2Eval,
      C1: c1Eval,
      C3: c3Eval,
      D1: d1Eval,
      D2: d2Eval,
    };
  }, [sheetState, a2Map, dmSanPhamMap]);

  // Thống kê theo từng loại hình ĐVSN (6 nhóm)
  const unitStats = useMemo(() => {
    const res = {};
    for (const u of UNIT_TYPES) {
      const code = u.code;
      const a1 = sheetState.A1.filter((r) => belongsToUnit(r.A, code));
      const b1 = allEvaluated.B1.filter((r) => belongsToUnit(r.A, code));
      const c1 = allEvaluated.C1.filter((r) => belongsToUnit(r.A, code));
      const c3 = allEvaluated.C3.filter((r) => belongsToUnit(r.A, code));

      res[code] = {
        a1Count: a1.length,
        b1Total: b1.length,
        b1Dat: b1.filter((r) => r.R === "ĐẠT").length,
        c1Total: c1.length,
        c1Dat: c1.filter((r) => r.K === "ĐẠT").length,
        c3Total: c3.length,
        c3Dat: c3.filter((r) => r.M === "ĐẠT").length,
      };
    }
    return res;
  }, [sheetState.A1, allEvaluated]);

  // Toàn bộ các dòng thuộc Đơn vị đang chọn (chưa lọc theo VTVL / Job)
  const fullUnitRows = useMemo(() => {
    return {
      A1: sheetState.A1.filter((r) => belongsToUnit(r.A, selectedUnit)),
      A2: sheetState.A2.filter((r) => belongsToUnit(r.A, selectedUnit)),
      B1: allEvaluated.B1.filter((r) => belongsToUnit(r.A, selectedUnit)),
      B2_CT: allEvaluated.B2_CT.filter((r) => belongsToUnit(r.A, selectedUnit)),
      C1: allEvaluated.C1.filter((r) => belongsToUnit(r.A, selectedUnit)),
      C2: sheetState.C2.filter((r) => belongsToUnit(r.A, selectedUnit)),
      C3: allEvaluated.C3.filter((r) => belongsToUnit(r.A, selectedUnit)),
      D1: allEvaluated.D1.filter((r) => belongsToUnit(r.B, selectedUnit)),
      D2: allEvaluated.D2.filter((r) => belongsToUnit(r.A, selectedUnit)),
    };
  }, [sheetState, allEvaluated, selectedUnit]);

  // Lọc các dòng theo Phạm vi đang chọn (UNIT | VTVL | JOB) và chỉ chấm ĐẠT trên phạm vi đó!
  const currentUnitRows = useMemo(() => {
    if (scopeMode === "UNIT") {
      return fullUnitRows;
    }

    if (scopeMode === "VTVL" && selectedVtvl) {
      const a2Filtered = fullUnitRows.A2.filter((r) => r.C === selectedVtvl);
      const taskSet = new Set(a2Filtered.map((r) => r.B));
      const jobSet = new Set(a2Filtered.map((r) => r.A));

      const a1Filtered = fullUnitRows.A1.filter((r) => taskSet.has(r.A));
      const b1Filtered = fullUnitRows.B1.filter((r) => jobSet.has(r.A));
      const b2Filtered = fullUnitRows.B2_CT.filter((r) => jobSet.has(r.A));
      const c1Filtered = fullUnitRows.C1.filter((r) => r.A === selectedVtvl);
      const c2Filtered = fullUnitRows.C2.filter((r) => r.A === selectedVtvl);
      const c3Raw = sheetState.C3.filter((r) => r.A === selectedVtvl);
      const c3Filtered = c3Raw.map((r) =>
        evaluateC3Row(r, c1Filtered, b1Filtered, b2Filtered)
      );
      const d1Filtered = fullUnitRows.D1.filter((r) => r.B === selectedVtvl);
      const d2Filtered = evaluateD2Rows(
        sheetState.D2.filter((r) => r.A === selectedVtvl),
        c3Filtered
      );

      return {
        A1: a1Filtered,
        A2: a2Filtered,
        B1: b1Filtered,
        B2_CT: b2Filtered,
        C1: c1Filtered,
        C2: c2Filtered,
        C3: c3Filtered,
        D1: d1Filtered,
        D2: d2Filtered,
      };
    }

    if (scopeMode === "JOB" && selectedJobCodes.length > 0) {
      const jobSet = new Set(selectedJobCodes);
      const a2Filtered = fullUnitRows.A2.filter((r) => jobSet.has(r.A));
      const taskSet = new Set(a2Filtered.map((r) => r.B));
      const vtvlSet = new Set(a2Filtered.map((r) => r.C));

      const a1Filtered = fullUnitRows.A1.filter((r) => taskSet.has(r.A));
      const b1Filtered = fullUnitRows.B1.filter((r) => jobSet.has(r.A));
      const b2Filtered = fullUnitRows.B2_CT.filter((r) => jobSet.has(r.A));
      const c1Filtered = fullUnitRows.C1.filter((r) => vtvlSet.has(r.A));
      const c2Filtered = fullUnitRows.C2.filter((r) => vtvlSet.has(r.A));
      const c3Raw = sheetState.C3.filter((r) => vtvlSet.has(r.A));
      // Khi ở chế độ JOB, C3 chỉ tính giờ & kiểm tra lỗi B1 trên đúng các công việc đã chọn!
      const c3Filtered = c3Raw.map((r) =>
        evaluateC3Row(r, c1Filtered, b1Filtered, b2Filtered)
      );
      const d1Filtered = fullUnitRows.D1.filter((r) => vtvlSet.has(r.B));
      const d2Filtered = evaluateD2Rows(
        sheetState.D2.filter((r) => vtvlSet.has(r.A)),
        c3Filtered
      );

      return {
        A1: a1Filtered,
        A2: a2Filtered,
        B1: b1Filtered,
        B2_CT: b2Filtered,
        C1: c1Filtered,
        C2: c2Filtered,
        C3: c3Filtered,
        D1: d1Filtered,
        D2: d2Filtered,
      };
    }

    return fullUnitRows;
  }, [fullUnitRows, scopeMode, selectedVtvl, selectedJobCodes, sheetState.C3, sheetState.D2]);

  // Các hàm cập nhật dữ liệu từng biểu
  const handleUpdateA1 = (rowNum, code, changes) => {
    setSheetState((prev) => ({
      ...prev,
      A1: prev.A1.map((r) => (r.A === code ? { ...r, ...changes } : r)),
    }));
  };

  const handleUpdateA2 = (rowNum, code, changes) => {
    setSheetState((prev) => ({
      ...prev,
      A2: prev.A2.map((r) => (r.A === code ? { ...r, ...changes } : r)),
    }));
  };

  const handleUpdateB1 = (rowNum, code, changes) => {
    setSheetState((prev) => ({
      ...prev,
      B1: prev.B1.map((r) => (r.A === code ? { ...r, ...changes } : r)),
    }));
  };

  const handleBatchUpdateB1 = (updates) => {
    const map = new Map(updates.map((u) => [u.A, u.changes]));
    setSheetState((prev) => ({
      ...prev,
      B1: prev.B1.map((r) => (map.has(r.A) ? { ...r, ...map.get(r.A) } : r)),
    }));
    showToast(`Đã điền số liệu gợi ý cho ${updates.length} công việc tại Biểu B1!`);
  };

  const handleUpdateB2 = (rowNum, code, changes) => {
    setSheetState((prev) => ({
      ...prev,
      B2_CT: prev.B2_CT.map((r) => (r.A === code ? { ...r, ...changes } : r)),
    }));
  };

  const handleBatchUpdateB2 = (updates) => {
    const map = new Map(updates.map((u) => [u.A, u.changes]));
    setSheetState((prev) => ({
      ...prev,
      B2_CT: prev.B2_CT.map((r) => (map.has(r.A) ? { ...r, ...map.get(r.A) } : r)),
    }));
    showToast("Đã chuẩn hóa trạng thái Biểu B2!");
  };

  const handleUpdateC1 = (rowNum, code, changes) => {
    setSheetState((prev) => ({
      ...prev,
      C1: prev.C1.map((r) => (r.A === code ? { ...r, ...changes } : r)),
    }));
  };

  const handleUpdateC2 = (rowNum, code, changes) => {
    setSheetState((prev) => ({
      ...prev,
      C2: prev.C2.map((r) => (r.A === code ? { ...r, ...changes } : r)),
    }));
  };

  const handleUpdateC3 = (rowNum, code, changes) => {
    setSheetState((prev) => ({
      ...prev,
      C3: prev.C3.map((r) => (r.A === code ? { ...r, ...changes } : r)),
    }));
  };

  // Kiểm tra dòng B1 và dòng VTVL có nằm trong phạm vi đang chọn không
  const isJobInActiveScope = (jobCode, a2ByCode, targetUnitCode = selectedUnit) => {
    if (!belongsToUnit(jobCode, targetUnitCode)) return false;
    if (scopeMode === "VTVL" && selectedVtvl) {
      return a2ByCode[jobCode]?.C === selectedVtvl;
    }
    if (scopeMode === "JOB" && selectedJobCodes.length > 0) {
      return selectedJobCodes.includes(jobCode);
    }
    return true;
  };

  const isVtvlInActiveScope = (vtvlCode, a2ByCode, targetUnitCode = selectedUnit) => {
    if (!belongsToUnit(vtvlCode, targetUnitCode)) return false;
    if (scopeMode === "VTVL" && selectedVtvl) {
      return vtvlCode === selectedVtvl;
    }
    if (scopeMode === "JOB" && selectedJobCodes.length > 0) {
      const vtvlSet = new Set(
        selectedJobCodes.map((jc) => a2ByCode[jc]?.C).filter(Boolean)
      );
      return vtvlSet.has(vtvlCode);
    }
    return true;
  };

  // Điền nhanh (B1 + C1 + C3 + D1 + D2) đạt 100% ĐẠT cho phạm vi đang chọn
  const handleQuickFillUnit = (targetUnitCode = selectedUnit) => {
    setSheetState((prev) => {
      const a2ByCode = {};
      for (const r of prev.A2) a2ByCode[r.A] = r;

      // 1. Điền B1 trong phạm vi
      const nextB1 = prev.B1.map((r) => {
        if (!isJobInActiveScope(r.A, a2ByCode, targetUnitCode)) return r;
        const suggested = suggestB1Metrics(a2ByCode[r.A]);
        const isGenericH =
          !r.H ||
          String(r.H).startsWith("Hồ sơ/sổ/hệ thống nghiệp vụ của đơn vị");
        return {
          ...r,
          C: r.C !== "" && r.C !== undefined ? r.C : suggested.C,
          D: r.D !== "" && r.D !== undefined ? r.D : suggested.D,
          E: r.E !== "" && r.E !== undefined ? r.E : suggested.E,
          H: isGenericH ? suggested.H : r.H,
          I: r.I || suggested.I,
          J: r.J || suggested.J,
          K: r.K || "01/10/2025–30/9/2026",
        };
      });

      // 2. Điền C1 trong phạm vi
      const nextC1 = prev.C1.map((r) => {
        if (!isVtvlInActiveScope(r.A, a2ByCode, targetUnitCode)) return r;
        return suggestC1Row(r);
      });

      // Tính tạm B1, B2, C1 trong phạm vi để gợi ý C3 chính xác
      const scopedB1Eval = nextB1
        .filter((r) => isJobInActiveScope(r.A, a2ByCode, targetUnitCode))
        .map((r) => evaluateB1Row(r, a2ByCode, dmSanPhamMap));
      const scopedB2Eval = prev.B2_CT
        .filter((r) => isJobInActiveScope(r.A, a2ByCode, targetUnitCode))
        .map((r) => evaluateB2CTRow(r, a2ByCode, scopedB1Eval));
      const tempC1Eval = nextC1.map((r) => evaluateC1Row(r));

      // 3. Điền C3 trong phạm vi
      const nextC3 = prev.C3.map((r) => {
        if (!isVtvlInActiveScope(r.A, a2ByCode, targetUnitCode)) return r;
        const evalRow = evaluateC3Row(r, tempC1Eval, scopedB1Eval, scopedB2Eval);
        const suggested = suggestC3Row(evalRow);
        return {
          ...r,
          H: suggested.H,
          I: suggested.I,
          J: suggested.J,
          K: suggested.K,
          L: suggested.L,
        };
      });

      // 4. Tạo D1 & D2 cho phạm vi đang chọn
      const scopedC3 = nextC3.filter((r) =>
        isVtvlInActiveScope(r.A, a2ByCode, targetUnitCode)
      );
      const scopedC1Eval = tempC1Eval.filter((r) =>
        isVtvlInActiveScope(r.A, a2ByCode, targetUnitCode)
      );
      const otherD1 = prev.D1.filter(
        (r) => !isVtvlInActiveScope(r.B, a2ByCode, targetUnitCode)
      );
      const otherD2 = prev.D2.filter(
        (r) => !isVtvlInActiveScope(r.A, a2ByCode, targetUnitCode)
      );

      const genD1 = generateD1FromC3(scopedC3, scopedC1Eval, unitMeta.unitCode);
      const genD2 = generateD2FromC3(scopedC3);

      const mergedD1 = [...otherD1, ...genD1].map((r, i) => ({
        ...r,
        rowNum: i + 3,
      }));
      const mergedD2 = [...otherD2, ...genD2].map((r, i) => ({
        ...r,
        rowNum: i + 3,
      }));

      return {
        ...prev,
        B1: nextB1,
        C1: nextC1,
        C3: nextC3,
        D1: mergedD1,
        D2: mergedD2,
      };
    });

    if (scopeMode === "VTVL") {
      showToast(`Đã điền chuẩn ĐẠT 100% cho Vị trí việc làm ${selectedVtvl}!`);
    } else if (scopeMode === "JOB") {
      showToast(`Đã điền chuẩn ĐẠT 100% cho ${selectedJobCodes.length} công việc đã chọn!`);
    } else {
      const unitLabel =
        targetUnitCode === "ALL"
          ? "tất cả 06 đơn vị"
          : UNIT_TYPES.find((u) => u.code === targetUnitCode)?.shortName || targetUnitCode;
      showToast(`Đã điền số liệu chuẩn ĐẠT 100% (B1, C1, C3, D1, D2) cho ${unitLabel}!`);
    }
  };

  const handleBatchFixC1AndC3 = () => {
    setSheetState((prev) => {
      const a2ByCode = {};
      for (const r of prev.A2) a2ByCode[r.A] = r;

      const nextC1 = prev.C1.map((r) =>
        isVtvlInActiveScope(r.A, a2ByCode, selectedUnit) ? suggestC1Row(r) : r
      );
      const scopedB1Eval = prev.B1
        .filter((r) => isJobInActiveScope(r.A, a2ByCode, selectedUnit))
        .map((r) => evaluateB1Row(r, a2ByCode, dmSanPhamMap));
      const scopedB2Eval = prev.B2_CT
        .filter((r) => isJobInActiveScope(r.A, a2ByCode, selectedUnit))
        .map((r) => evaluateB2CTRow(r, a2ByCode, scopedB1Eval));
      const tempC1Eval = nextC1.map((r) => evaluateC1Row(r));

      const nextC3 = prev.C3.map((r) => {
        if (!isVtvlInActiveScope(r.A, a2ByCode, selectedUnit)) return r;
        const evalRow = evaluateC3Row(r, tempC1Eval, scopedB1Eval, scopedB2Eval);
        const suggested = suggestC3Row(evalRow);
        return {
          ...r,
          H: suggested.H,
          I: suggested.I,
          J: suggested.J,
          K: suggested.K,
          L: suggested.L,
        };
      });

      return { ...prev, C1: nextC1, C3: nextC3 };
    });
    showToast("Đã chuẩn hóa quỹ giờ C1 và kết luận nhu cầu nhân lực C3!");
  };

  const handleAutoGenerateD1D2 = () => {
    setSheetState((prev) => {
      const a2ByCode = {};
      for (const r of prev.A2) a2ByCode[r.A] = r;

      const scopedC3 = prev.C3.filter((r) =>
        isVtvlInActiveScope(r.A, a2ByCode, selectedUnit)
      );
      const scopedC1Eval = allEvaluated.C1.filter((r) =>
        isVtvlInActiveScope(r.A, a2ByCode, selectedUnit)
      );
      const otherD1 = prev.D1.filter(
        (r) => !isVtvlInActiveScope(r.B, a2ByCode, selectedUnit)
      );
      const otherD2 = prev.D2.filter(
        (r) => !isVtvlInActiveScope(r.A, a2ByCode, selectedUnit)
      );

      const genD1 = generateD1FromC3(scopedC3, scopedC1Eval, unitMeta.unitCode);
      const genD2 = generateD2FromC3(scopedC3);

      return {
        ...prev,
        D1: [...otherD1, ...genD1].map((r, i) => ({ ...r, rowNum: i + 3 })),
        D2: [...otherD2, ...genD2].map((r, i) => ({ ...r, rowNum: i + 3 })),
      };
    });
    showToast("Đã khởi tạo tự động danh sách D1 và phương án 5 năm D2!");
  };

  const handleResetToOriginal = () => {
    if (
      !window.confirm(
        "Bạn có chắc muốn đặt lại toàn bộ dữ liệu về trạng thái ban đầu của file 03_DVSN_XA.xlsx?"
      )
    )
      return;
    localStorage.removeItem(STORAGE_KEY);
    setScopeMode("UNIT");
    setSelectedVtvl("");
    setSelectedJobCodes([]);
    setSheetState({
      A1: initialData.A1.filter((r) => r.A),
      A2: initialData.A2.filter((r) => r.A),
      B1: initialData.B1.filter((r) => r.A),
      B2_CT: initialData.B2_CT.filter((r) => r.A),
      C1: initialData.C1.filter((r) => r.A),
      C2: initialData.C2.filter((r) => r.A),
      C3: initialData.C3.filter((r) => r.A),
      D1: [],
      D2: [],
    });
    showToast("Đã khôi phục dữ liệu gốc ban đầu!");
  };

  const handleExportExcel = async (opts = {}) => {
    try {
      setIsExporting(true);
      const blob = await exportToOriginalExcel(
        {
          ...sheetState,
          D1: allEvaluated.D1,
          D2: allEvaluated.D2,
        },
        {
          replacePrefix: opts.replacePrefix,
          unitCode: unitMeta.unitCode,
        }
      );
      const fileName = `${unitMeta.unitCode || "DVTH_TRUONGLONG"}_K2526_${unitMeta.version || "v1"
        }_${unitMeta.sendDate || "06112026"}.xlsx`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast(`Đã xuất thành công tệp ${fileName}!`);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xuất file Excel: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportExcel = async (file) => {
    try {
      const parsed = await importFromExcelFile(file);
      setSheetState((prev) => ({
        A1: parsed.A1.filter((r) => r.A).length ? parsed.A1.filter((r) => r.A) : prev.A1,
        A2: parsed.A2.filter((r) => r.A).length ? parsed.A2.filter((r) => r.A) : prev.A2,
        B1: parsed.B1.filter((r) => r.A).length ? parsed.B1.filter((r) => r.A) : prev.B1,
        B2_CT: parsed.B2_CT.filter((r) => r.A).length
          ? parsed.B2_CT.filter((r) => r.A)
          : prev.B2_CT,
        C1: parsed.C1.filter((r) => r.A).length ? parsed.C1.filter((r) => r.A) : prev.C1,
        C2: parsed.C2.filter((r) => r.A).length ? parsed.C2.filter((r) => r.A) : prev.C2,
        C3: parsed.C3.filter((r) => r.A).length ? parsed.C3.filter((r) => r.A) : prev.C3,
        D1: parsed.D1.filter((r) => r.A),
        D2: parsed.D2.filter((r) => r.A),
      }));
      showToast(`Đã đọc thành công dữ liệu từ tệp ${file.name}!`);
    } catch (err) {
      console.error(err);
      alert("Không thể đọc file Excel này: " + err.message);
    }
  };

  const b1DatCount = currentUnitRows.B1.filter((r) => r.R === "ĐẠT").length;
  const c3DatCount = currentUnitRows.C3.filter((r) => r.M === "ĐẠT").length;

  const navTabs = [
    {
      id: "UNIT",
      stepNum: 1,
      label: "Chọn Đơn vị & Phạm vi",
      subLabel: "Thiết lập phạm vi",
      shortLabel: "B1: Đơn vị",
      icon: Building2,
      badge:
        scopeMode === "UNIT"
          ? selectedUnit === "ALL"
            ? "Tất cả (6)"
            : selectedUnit
          : scopeMode === "VTVL"
            ? "1 VTVL"
            : `${selectedJobCodes.length} việc`,
      ok: true,
    },
    {
      id: "A1_A2_B1",
      stepNum: 2,
      label: "Nhiệm vụ & Khối lượng",
      subLabel: "Biểu A1, A2, B1",
      shortLabel: "B2: A1–B1",
      icon: ClipboardList,
      badge: `${b1DatCount}/${currentUnitRows.B1.length} ĐẠT`,
      ok: b1DatCount === currentUnitRows.B1.length && currentUnitRows.B1.length > 0,
    },
    {
      id: "B2",
      stepNum: 3,
      label: "Tác động CĐS",
      subLabel: "Biểu B2",
      shortLabel: "B3: Biểu B2",
      icon: Zap,
      badge: `${currentUnitRows.B2_CT.length} dòng`,
      ok: currentUnitRows.B2_CT.length > 0,
    },
    {
      id: "C1_C2_C3",
      stepNum: 4,
      label: "Vị trí & Nhu cầu",
      subLabel: "Biểu C1, C2, C3",
      shortLabel: "B4: C1–C3",
      icon: Users,
      badge: `${c3DatCount}/${currentUnitRows.C3.length} ĐẠT`,
      ok: c3DatCount === currentUnitRows.C3.length && currentUnitRows.C3.length > 0,
    },
    {
      id: "D1_D2",
      stepNum: 5,
      label: "Nhân lực & Phương án",
      subLabel: "Biểu D1, D2",
      shortLabel: "B5: D1–D2",
      icon: CalendarRange,
      badge: `${currentUnitRows.D1.length} NL`,
      ok: currentUnitRows.D1.length > 0 && currentUnitRows.D2.length > 0,
    },
    {
      id: "EXPORT",
      stepNum: 6,
      label: "Kiểm tra & Xuất Excel",
      subLabel: "Hoàn tất 9 biểu",
      shortLabel: "B6: Xuất file",
      icon: ShieldCheck,
      badge: "Xuất .xlsx",
      ok:
        b1DatCount === currentUnitRows.B1.length &&
        c3DatCount === currentUnitRows.C3.length &&
        currentUnitRows.D1.length > 0,
    },
  ];

  const currentStepIndex = navTabs.findIndex((t) => t.id === activeTab);
  const prevStep = currentStepIndex > 0 ? navTabs[currentStepIndex - 1] : null;
  const nextStep =
    currentStepIndex >= 0 && currentStepIndex < navTabs.length - 1
      ? navTabs[currentStepIndex + 1]
      : null;

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden flex flex-col pb-20 lg:pb-0">
      {/* Toast thông báo */}
      {toastMsg && (
        <div className="fixed bottom-20 lg:bottom-5 right-4 left-4 sm:left-auto sm:right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xl border border-emerald-500/40 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Branding Bar - Thương hiệu tác giả Trần Quốc Liêm */}
      <div className="bg-slate-950 text-slate-200 border-b border-slate-800 px-3 sm:px-6 py-1.5 text-[11px]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 font-bold shrink-0">
              <Award className="w-3 h-3 text-amber-400 shrink-0" />
              Trần Quốc Liêm
            </span>
            <span className="text-slate-300 font-medium hidden sm:inline truncate">
              Chuyên viên Trung tâm Dịch vụ tổng hợp xã Trường Long
            </span>
            <span className="text-slate-400 sm:hidden truncate">
              CV TT DVTH xã Trường Long
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-slate-400 shrink-0">
            <span>Theo Hướng dẫn số 13-HD/BTCTU • Khối ĐVSN công lập cấp xã</span>
          </div>
        </div>
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs w-full">
        {/* Dòng 1: Logo + Tiêu đề gọn gàng bên trái | Các nút công cụ bên phải */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 min-w-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div
              onClick={() => setActiveTab("UNIT")}
              className="flex items-center gap-2.5 cursor-pointer group min-w-0 flex-1"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0 group-hover:scale-105 transition">
                TQL
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-extrabold text-slate-900 text-[13px] sm:text-[15px] leading-snug truncate sm:whitespace-nowrap">
                  Rà soát Vị trí việc làm & Biên chế 2027–2031
                </h1>
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  <span className="text-blue-700 font-bold">Xã Trường Long</span> • Khối Đơn vị sự nghiệp công lập
                </p>
              </div>
            </div>

            <button
              onClick={handleResetToOriginal}
              title="Khôi phục dữ liệu ban đầu"
              className="lg:hidden p-2 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition cursor-pointer shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Cụm nút công cụ gọn gàng */}
          <div className="grid grid-cols-2 sm:flex items-center gap-1.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("GUIDE")}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-bold transition cursor-pointer truncate"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="truncate">Hướng dẫn & Cách tính</span>
            </button>

            <button
              onClick={() => {
                setNormPickerTargetB1(null);
                setIsRefModalOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer truncate"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">Phụ lục 3</span>
            </button>

            <button
              onClick={() => handleQuickFillUnit(selectedUnit)}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition cursor-pointer truncate"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Điền mẫu nhanh</span>
            </button>

            <button
              onClick={() => handleExportExcel({ replacePrefix: false })}
              disabled={isExporting}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer truncate"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{isExporting ? "Đang xuất..." : "Xuất Excel"}</span>
            </button>

            <label
              title="Nhập file Excel (.xlsx) đang làm dở"
              className="hidden sm:inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Nhập file</span>
              <input
                type="file"
                accept=".xlsx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImportExcel(file);
                  e.target.value = "";
                }}
              />
            </label>

            <button
              onClick={handleResetToOriginal}
              title="Khôi phục dữ liệu ban đầu"
              className="hidden lg:inline-flex p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dòng 2: Thanh Chọn Đơn Vị & Phạm Vi Làm Việc (Có min-w-0 & w-full để không bao giờ tràn màn hình mobile) */}
        <div className="bg-blue-50/70 border-t border-blue-100 px-3 sm:px-6 py-2 w-full">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0 w-full">
              {/* Chọn Đơn vị */}
              <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap flex items-center gap-1 shrink-0 w-24 sm:w-auto">
                  <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  Đơn vị:
                </span>
                <select
                  value={selectedUnit}
                  onChange={(e) => handleSelectUnitChange(e.target.value)}
                  className="flex-1 sm:flex-none min-w-0 max-w-full truncate font-bold text-blue-900 bg-white border border-blue-300 rounded-lg px-2.5 py-1.5 sm:py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                >
                  {UNIT_TYPES.map((u) => (
                    <option key={u.code} value={u.code}>
                      {u.id}. {u.shortName} ({u.code})
                    </option>
                  ))}
                  <option value="ALL">Tất cả 06 loại hình ĐVSN (Toàn bộ file)</option>
                </select>
              </div>

              {/* Chọn Phạm vi kê khai */}
              <div className="flex items-center gap-2 flex-1 min-w-0 w-full">
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap flex items-center gap-1 shrink-0 w-24 sm:w-auto">
                  <Target className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  Phạm vi nhập:
                </span>
                <select
                  value={
                    scopeMode === "VTVL"
                      ? `VTVL:${selectedVtvl}`
                      : scopeMode === "JOB"
                        ? "JOB"
                        : "UNIT"
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "UNIT") {
                      setScopeMode("UNIT");
                    } else if (val === "JOB") {
                      setScopeMode("JOB");
                      if (selectedJobCodes.length === 0 && fullUnitRows.A2[0]?.A) {
                        setSelectedJobCodes([fullUnitRows.A2[0].A]);
                      }
                      setActiveTab("UNIT");
                    } else if (val.startsWith("VTVL:")) {
                      setSelectedVtvl(val.replace("VTVL:", ""));
                      setScopeMode("VTVL");
                    }
                  }}
                  className={`flex-1 w-0 min-w-0 max-w-full sm:max-w-md truncate font-bold rounded-lg px-2.5 py-1.5 sm:py-1 text-xs border focus:outline-none shadow-2xs ${scopeMode === "UNIT"
                      ? "bg-white text-slate-800 border-slate-300"
                      : "bg-indigo-600 text-white border-indigo-700"
                    }`}
                >
                  <option value="UNIT" className="text-slate-900 bg-white">
                    Toàn bộ đơn vị ({fullUnitRows.C1.length} vị trí – {fullUnitRows.A2.length} việc)
                  </option>
                  <optgroup
                    label="── Chọn riêng 01 Vị trí việc làm: ──"
                    className="text-slate-900 bg-white"
                  >
                    {fullUnitRows.C1.map((c1) => {
                      const shortName =
                        String(c1.B || "").length > 42
                          ? String(c1.B).slice(0, 42) + "..."
                          : c1.B;
                      return (
                        <option
                          key={c1.A}
                          value={`VTVL:${c1.A}`}
                          className="text-slate-900 bg-white"
                        >
                          Vị trí: {shortName} ({c1.A})
                        </option>
                      );
                    })}
                  </optgroup>
                  <option value="JOB" className="text-slate-900 bg-white">
                    ── Chỉ chọn từng Công việc ({selectedJobCodes.length || 1} việc) ──
                  </option>
                </select>
              </div>
            </div>

            {activeTab !== "UNIT" && (
              <button
                onClick={() => setActiveTab("UNIT")}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer whitespace-nowrap self-end sm:self-auto shrink-0"
              >
                Tùy chỉnh chi tiết công việc →
              </button>
            )}
          </div>
        </div>

        {/* Thanh Quy Trình 6 Bước trên Desktop (>= lg) - Hiển thị trọn vẹn 6 cột trên 1 hàng, không cần kéo thanh cuộn ngang */}
        <div className="hidden lg:block border-t border-slate-200 bg-slate-50/80">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2">
            <div className="grid grid-cols-6 gap-1.5">
              {navTabs.map((t, idx) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                const isPast = currentStepIndex > idx;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTab(t.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`group relative flex flex-col justify-between p-2 rounded-xl text-left border transition cursor-pointer ${isActive
                        ? "bg-blue-600 text-white border-blue-700 shadow-sm ring-2 ring-blue-300/60"
                        : isPast
                          ? "bg-white hover:bg-blue-50/70 text-slate-800 border-emerald-300"
                          : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                  >
                    <div className="flex items-center justify-between gap-1 w-full mb-1">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-tight ${isActive
                            ? "bg-white text-blue-700"
                            : t.ok
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                      >
                        Bước {t.stepNum}
                      </span>
                      {t.badge && (
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold truncate ${isActive
                              ? "bg-blue-800/80 text-white"
                              : t.ok
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-800 border border-amber-200"
                            }`}
                        >
                          {t.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 ${isActive
                            ? "text-white"
                            : t.ok
                              ? "text-emerald-600"
                              : "text-slate-500"
                          }`}
                      />
                      <span className="text-xs font-extrabold leading-tight truncate">
                        {t.label}
                      </span>
                    </div>

                    <div
                      className={`text-[10px] mt-0.5 truncate ${isActive ? "text-blue-100 font-medium" : "text-slate-400"
                        }`}
                    >
                      {t.subLabel}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-5">
        {/* Nếu đang mở trang Hướng dẫn (từ nút trên Header), hiện thanh quay lại Quy trình làm việc */}
        {activeTab === "GUIDE" ? (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-amber-950">
                  Cẩm nang Hướng dẫn Sử dụng & Giải thích Công thức Từng Công việc
                </h2>
                <p className="text-xs text-amber-800">
                  Tài liệu tra cứu độc lập — Bạn có thể xem bất cứ lúc nào rồi bấm nút bên phải để quay lại bước đang nhập.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("A1_A2_B1")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-xs transition cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại Quy trình thực hiện (Bước 2: Nhập khối lượng)
            </button>
          </div>
        ) : (
          /* Thanh Điều Hướng Nhanh Đầu Trang (Giúp người dùng biết đang ở bước mấy và bấm 1 nút qua bước tiếp theo) */
          <div className="mb-4 bg-white border border-slate-200 rounded-2xl px-3 sm:px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="px-2 py-1 rounded-lg bg-blue-600 text-white text-xs font-extrabold shrink-0">
                Bước {currentStepIndex + 1}/{navTabs.length}
              </span>
              <div className="min-w-0 truncate">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                  {navTabs[currentStepIndex]?.label}
                </span>
                <span className="hidden sm:inline text-xs text-slate-500 ml-2">
                  ({navTabs[currentStepIndex]?.subLabel})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
              {prevStep && (
                <button
                  onClick={() => {
                    setActiveTab(prevStep.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Bước {prevStep.stepNum}</span>
                </button>
              )}
              {nextStep && (
                <button
                  onClick={() => {
                    setActiveTab(nextStep.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-xs transition cursor-pointer min-w-0"
                >
                  <span className="truncate">
                    Tiếp theo: Bước {nextStep.stepNum} ({nextStep.label})
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              )}
            </div>
          </div>
        )}
        {activeTab === "UNIT" && (
          <UnitSelectorTab
            selectedUnit={selectedUnit}
            setSelectedUnit={handleSelectUnitChange}
            unitMeta={unitMeta}
            setUnitMeta={setUnitMeta}
            unitStats={unitStats}
            unitC1Rows={fullUnitRows.C1}
            unitA2Rows={fullUnitRows.A2}
            unitB1EvalRows={fullUnitRows.B1}
            scopeMode={scopeMode}
            setScopeMode={setScopeMode}
            selectedVtvl={selectedVtvl}
            setSelectedVtvl={setSelectedVtvl}
            selectedJobCodes={selectedJobCodes}
            setSelectedJobCodes={setSelectedJobCodes}
            onQuickFillUnit={handleQuickFillUnit}
            onGoToStep={setActiveTab}
          />
        )}

        {activeTab === "A1_A2_B1" && (
          <TasksAndWorkloadTab
            a1Rows={currentUnitRows.A1}
            a2Rows={currentUnitRows.A2}
            b1EvaluatedRows={currentUnitRows.B1}
            c1Rows={currentUnitRows.C1}
            allUnitC1Rows={fullUnitRows.C1}
            allUnitA2Rows={fullUnitRows.A2}
            scopeMode={scopeMode}
            setScopeMode={setScopeMode}
            selectedVtvl={selectedVtvl}
            setSelectedVtvl={setSelectedVtvl}
            selectedJobCodes={selectedJobCodes}
            setSelectedJobCodes={setSelectedJobCodes}
            onUpdateA1={handleUpdateA1}
            onUpdateA2={handleUpdateA2}
            onUpdateB1={handleUpdateB1}
            onBatchUpdateB1={handleBatchUpdateB1}
            onOpenNormPicker={(b1Row) => {
              setNormPickerTargetB1(b1Row);
              setIsRefModalOpen(true);
            }}
          />
        )}

        {activeTab === "B2" && (
          <ImpactB2Tab
            b2EvaluatedRows={currentUnitRows.B2_CT}
            b1EvaluatedRows={currentUnitRows.B1}
            onUpdateB2={handleUpdateB2}
            onBatchUpdateB2={handleBatchUpdateB2}
          />
        )}

        {activeTab === "C1_C2_C3" && (
          <PositionsAndDemandTab
            c1EvaluatedRows={currentUnitRows.C1}
            c2Rows={currentUnitRows.C2}
            c3EvaluatedRows={currentUnitRows.C3}
            onUpdateC1={handleUpdateC1}
            onUpdateC2={handleUpdateC2}
            onUpdateC3={handleUpdateC3}
            onBatchFixC1AndC3={handleBatchFixC1AndC3}
          />
        )}

        {activeTab === "D1_D2" && (
          <StaffingPlanTab
            d1EvaluatedRows={currentUnitRows.D1}
            d2EvaluatedRows={currentUnitRows.D2}
            c1EvaluatedRows={currentUnitRows.C1}
            c3EvaluatedRows={currentUnitRows.C3}
            unitMeta={unitMeta}
            onSetD1={(newUnitD1) => {
              setSheetState((prev) => {
                const a2ByCode = {};
                for (const r of prev.A2) a2ByCode[r.A] = r;
                const others = prev.D1.filter(
                  (r) => !isVtvlInActiveScope(r.B, a2ByCode, selectedUnit)
                );
                return {
                  ...prev,
                  D1: [...others, ...newUnitD1].map((r, i) => ({
                    ...r,
                    rowNum: i + 3,
                  })),
                };
              });
            }}
            onSetD2={(newUnitD2) => {
              setSheetState((prev) => {
                const a2ByCode = {};
                for (const r of prev.A2) a2ByCode[r.A] = r;
                const others = prev.D2.filter(
                  (r) => !isVtvlInActiveScope(r.A, a2ByCode, selectedUnit)
                );
                return {
                  ...prev,
                  D2: [...others, ...newUnitD2].map((r, i) => ({
                    ...r,
                    rowNum: i + 3,
                  })),
                };
              });
            }}
            onAutoGenerateD1D2={handleAutoGenerateD1D2}
          />
        )}

        {activeTab === "EXPORT" && (
          <ReviewAndExportTab
            b1EvaluatedRows={currentUnitRows.B1}
            b2EvaluatedRows={currentUnitRows.B2_CT}
            c1EvaluatedRows={currentUnitRows.C1}
            c3EvaluatedRows={currentUnitRows.C3}
            d1EvaluatedRows={currentUnitRows.D1}
            d2EvaluatedRows={currentUnitRows.D2}
            unitMeta={unitMeta}
            scopeMode={scopeMode}
            selectedVtvl={selectedVtvl}
            selectedJobCodes={selectedJobCodes}
            onResetScopeToUnit={() => setScopeMode("UNIT")}
            onExportExcel={handleExportExcel}
            onImportExcel={handleImportExcel}
            onQuickFillAllCurrentUnit={() => handleQuickFillUnit(selectedUnit)}
            onGoToStep={setActiveTab}
            isExporting={isExporting}
          />
        )}

        {activeTab === "GUIDE" && (
          <UserGuideTab
            a1Rows={currentUnitRows.A1}
            a2Rows={currentUnitRows.A2}
            b1EvaluatedRows={currentUnitRows.B1}
            c1Rows={currentUnitRows.C1}
            onUpdateB1={handleUpdateB1}
            onGoToStep={setActiveTab}
          />
        )}

        {/* Thanh Điều Hướng Cuối Trang (Bấm chuyển bước tiếp theo dễ dàng mà không cần cuộn lên trên) */}
        {activeTab !== "GUIDE" && (
          <div className="mt-6 bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                Đang ở Bước {currentStepIndex + 1} / {navTabs.length}: {navTabs[currentStepIndex]?.label}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
                {nextStep
                  ? `Sau khi kiểm tra xong bước này, hãy bấm nút bên phải để chuyển sang Bước ${nextStep.stepNum}: ${nextStep.label}.`
                  : "Bạn đã ở bước cuối cùng! Hãy kiểm tra tổng thể và bấm Xuất file Excel (.xlsx) để nộp báo cáo."}
              </p>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0">
              {prevStep && (
                <button
                  onClick={() => {
                    setActiveTab(prevStep.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại Bước {prevStep.stepNum}</span>
                </button>
              )}
              {nextStep && (
                <button
                  onClick={() => {
                    setActiveTab(nextStep.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-black shadow-sm transition cursor-pointer"
                >
                  <span>
                    Tiếp theo: Bước {nextStep.stepNum} ({nextStep.label})
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer Thương Hiệu Cá Nhân */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs text-slate-600">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
            <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Thiết kế & Phát triển ứng dụng:</span>
            <strong className="text-slate-900">Trần Quốc Liêm</strong>
            <span>–</span>
            <span className="font-semibold text-blue-700">
              Chuyên viên Trung tâm Dịch vụ tổng hợp xã Trường Long
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Hệ thống Số hóa Rà soát VTVL & Phương án Biên chế 2027–2031 (Biểu mẫu 03_DVSN_XA)
          </div>
        </div>
      </footer>

      {/* Thanh Điều Hướng Cố Định Dưới Đáy Cho Mobile (< lg) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg pb-safe">
        <div className="grid grid-cols-6 gap-0.5 px-1 py-1">
          {navTabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTab(t.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition cursor-pointer ${isActive
                    ? "bg-blue-600 text-white font-bold shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                  }`}
              >
                <div className="relative">
                  <Icon className="w-4 h-4" />
                  {t.ok && !isActive && (
                    <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </div>
                <span className="text-[10px] leading-tight mt-1 truncate max-w-full">
                  {t.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Modal Tra cứu Phụ lục 3 & Giải đáp */}
      <ReferenceModal
        isOpen={isRefModalOpen}
        onClose={() => {
          setIsRefModalOpen(false);
          setNormPickerTargetB1(null);
        }}
        onSelectNorm={({ minutes, hours, level, item }) => {
          if (normPickerTargetB1) {
            handleUpdateB1(normPickerTargetB1.rowNum, normPickerTargetB1.A, {
              D: minutes,
              I: `Tham chiếu mục ${item.id} (${item.name} - mức ${level}: ${hours} giờ/SP) Phụ lục 3 Hướng dẫn 13-HD/BTCTU và đo thực tế tại đơn vị; Thủ trưởng xác nhận`,
              J: "Kiểm đếm, ước lượng thực tế",
            });
            showToast(
              `Đã áp dụng mức ${hours} giờ (${minutes} phút/SP) vào công việc ${normPickerTargetB1.A}!`
            );
            setIsRefModalOpen(false);
            setNormPickerTargetB1(null);
          } else {
            navigator.clipboard?.writeText(String(minutes));
            showToast(`Đã sao chép ${minutes} phút (${hours} giờ)!`);
          }
        }}
      />
    </div>
  );
}

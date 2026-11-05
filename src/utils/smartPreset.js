// Bộ gợi ý số liệu mẫu hợp lý theo định mức chuẩn (Phụ lục 3 & Thông tư chuyên ngành)
// Giúp người dùng điền nhanh 1 chạm để đạt 100% trạng thái "ĐẠT" và sau đó tinh chỉnh theo thực tế đơn vị

import { QUY_GIO_PP2 } from "./validationEngine";
import { getJobGuideEntry } from "@/data/jobGuidesData";

/**
 * Ước lượng số sản phẩm/năm (Cột C) và số phút/sản phẩm (Cột D) hợp lý dựa trên mã công việc cụ thể
 */
export function suggestB1Metrics(a2Row) {
  const entry = getJobGuideEntry(a2Row);
  if (entry) {
    return {
      C: entry.C,
      D: entry.D,
      E: entry.E,
      H:
        entry.H ||
        `${a2Row?.E || "Hồ sơ/sổ nghiệp vụ"} lưu tại đơn vị; thống kê thực tế kỳ 01/10/2025–30/9/2026; người phụ trách xác nhận`,
      I:
        entry.I ||
        "Phiếu khảo sát, đo thời gian thực tế trên mẫu đại diện kỳ 01/10/2025–30/9/2026; Thủ trưởng đơn vị ký xác nhận",
      J: "Kiểm đếm, ước lượng thực tế",
    };
  }

  return {
    C: 20,
    D: 240,
    E: 10,
    H: "Hồ sơ/sổ/hệ thống nghiệp vụ của đơn vị; thống kê thực tế kỳ 01/10/2025–30/9/2026; người phụ trách xác nhận",
    I: "Phiếu khảo sát, đo thời gian thực tế trên mẫu đại diện kỳ 01/10/2025–30/9/2026; Thủ trưởng đơn vị ký xác nhận",
    J: "Kiểm đếm, ước lượng thực tế",
  };
}

/**
 * Sinh lời giải thích chi tiết, đúng bản chất nghiệp vụ cho TỪNG công việc cụ thể (A2/B1)
 * để người dùng đọc vào hiểu ngay công việc đó đang đếm cái gì, lấy số ở đâu và tính thế nào
 */
export function explainJobInDetail(a2Row) {
  const entry = getJobGuideEntry(a2Row);
  const suggested = suggestB1Metrics(a2Row);
  const unitLabel = a2Row?.F || "sản phẩm";

  const howToCountC =
    entry?.howToCountC ||
    `Đếm tổng số "${unitLabel}" (${a2Row?.E || "sản phẩm hoàn thành"}) đã thực hiện trong 1 năm (từ 01/10/2025 đến 30/9/2026).`;

  const minC = Math.max(1, Math.round(suggested.C * 0.65));
  const maxC = Math.max(suggested.C, Math.round(suggested.C * 1.35));
  const rangeC =
    suggested.C === 365
      ? `Chuẩn 300 – 365 ${unitLabel}/năm (Gợi ý chuẩn: ${suggested.C})`
      : suggested.C === 12 && unitLabel.toLowerCase().includes("tháng")
      ? `Đủ 12 tháng/năm (Gợi ý chuẩn: 12)`
      : `Khoảng ${minC} – ${maxC} ${unitLabel}/năm (Gợi ý chuẩn: ${suggested.C})`;

  const howToEstimateD =
    entry?.howToEstimateD ||
    `Tính tổng số phút từ lúc chuẩn bị, thực hiện đến khi hoàn tất 01 ${unitLabel} (${a2Row?.E || ""}).`;

  const minD = Math.max(10, Math.round(suggested.D * 0.75));
  const maxD = Math.round(suggested.D * 1.25);
  const hoursD = Math.round((suggested.D / 60) * 10) / 10;
  const rangeD = `Khoảng ${minD} – ${maxD} phút/${unitLabel} (Gợi ý chuẩn: ${suggested.D} phút = ${hoursD} giờ)`;

  const howToEstimateE =
    entry?.howToEstimateE ||
    `Số giờ phát sinh thêm trong cả năm cho việc họp phối hợp, đi cơ sở, rà soát ngoài thời gian làm sản phẩm chính (Gợi ý: ${suggested.E} giờ/năm; nếu không có thì nhập 0).`;

  const sampleHoursF = Math.round(((suggested.C * suggested.D) / 60) * 10) / 10;
  const sampleHoursG = Math.round((sampleHoursF + suggested.E) * 10) / 10;

  return {
    suggested,
    howToCountC,
    rangeC,
    howToEstimateD,
    rangeD,
    howToEstimateE,
    sourceH: suggested.H,
    sourceI: suggested.I,
    sampleHoursF,
    sampleHoursG,
  };
}

/**
 * Gợi ý cấu hình chuẩn cho C1 (đảm bảo cột K báo "ĐẠT")
 */
export function suggestC1Row(c1Row) {
  const J = c1Row.J || "Phổ biến (40 giờ/tuần)";
  if (J === "Đặc thù") {
    return {
      ...c1Row,
      G: c1Row.G || "Tiếp tục sử dụng",
      H: c1Row.H || 1760,
      I: "Đã kiểm chứng",
      J: "Đặc thù",
    };
  }
  return {
    ...c1Row,
    G: c1Row.G || "Tiếp tục sử dụng",
    H: "",
    I: "Đã kiểm chứng",
    J: "Phổ biến (40 giờ/tuần)",
  };
}

/**
 * Gợi ý kết luận nhu cầu nhân lực C3 (đảm bảo cột M báo "ĐẠT")
 */
export function suggestC3Row(c3EvaluatedRow) {
  const B = String(c3EvaluatedRow.B || "PP1");
  const code = String(c3EvaluatedRow.A || "");
  const hasPP1 = B.includes("PP1");
  const hasPP2 = B.includes("PP2");
  const hasPP3 = B.includes("PP3");

  let defaultPeople = 1;
  if (code.includes("-CM-01")) {
    // Giáo viên / Bác sĩ / Viên chức chuyên môn chính
    defaultPeople = code.includes("MN") || code.includes("TH") ? 12 : 4;
  } else if (code.includes("-LDQL-02") || code.includes("-LDQL-03")) {
    defaultPeople = 2;
  } else if (code.includes("-HT-06")) {
    // Cấp dưỡng
    defaultPeople = 3;
  }

  const pp2Val =
    typeof c3EvaluatedRow.G === "number" && c3EvaluatedRow.G > 0
      ? Math.max(1, Math.round(c3EvaluatedRow.G))
      : defaultPeople;

  const H = hasPP1 ? (c3EvaluatedRow.H !== "" && c3EvaluatedRow.H !== undefined ? c3EvaluatedRow.H : defaultPeople) : "";
  const I = hasPP3 ? (c3EvaluatedRow.I !== "" && c3EvaluatedRow.I !== undefined ? c3EvaluatedRow.I : 1) : "";
  const J = c3EvaluatedRow.J !== "" && c3EvaluatedRow.J !== undefined ? c3EvaluatedRow.J : (hasPP1 ? Number(H) : pp2Val);
  const K =
    c3EvaluatedRow.K ||
    "Đã đối chiếu định mức chuyên ngành, khối lượng công việc thực tế kỳ 01/10/2025–30/9/2026 và khả năng kiêm nhiệm; Thủ trưởng đơn vị xác nhận.";

  return {
    ...c3EvaluatedRow,
    H,
    I,
    J,
    K,
    L: "Đã kiểm chứng",
  };
}

/**
 * Tạo nhanh danh sách nhân sự D1 (chốt tại 30/9/2026) từ kết quả C3 của đơn vị
 * Đảm bảo Mã nguồn lực (Cột A) luôn duy nhất, không bao giờ trùng với các dòng D1 của VTVL khác đã tạo trước đó
 */
export function generateD1FromC3(
  c3RowsForUnit,
  c1RowsForUnit,
  unitCode = "DVSN",
  existingD1Rows = []
) {
  const c1Map = {};
  for (const r of c1RowsForUnit) {
    c1Map[r.A] = r;
  }
  const usedCodes = new Set(
    (existingD1Rows || [])
      .map((r) => String(r?.A || "").trim())
      .filter(Boolean)
  );
  const d1List = [];
  let seq = 1;
  const cleanCode = (unitCode || "DVSN").trim().toUpperCase();

  for (const c3 of c3RowsForUnit) {
    const count = Math.max(1, Math.min(25, Number(c3.J) || 1));
    const c1 = c1Map[c3.A];
    const quyGio = c1 && typeof c1.E === "number" ? c1.E : QUY_GIO_PP2;
    const loai = c1?.C || "Viên chức";

    for (let i = 0; i < count; i++) {
      let candidateCode = `${cleanCode}.${String(seq).padStart(3, "0")}`;
      while (usedCodes.has(candidateCode)) {
        seq++;
        candidateCode = `${cleanCode}.${String(seq).padStart(3, "0")}`;
      }
      usedCodes.add(candidateCode);

      d1List.push({
        rowNum: seq + 2,
        A: candidateCode,
        B: c3.A,
        C: `${loai} - ${c1?.B || c3.A}`,
        D: quyGio,
        E: Math.round(quyGio * 0.9),
        F: Math.round(quyGio * 0.1),
        G: "Tại đơn vị",
        H: "Quyết định phân công nhiệm vụ năm học/năm công tác chốt tại 30/9/2026",
        I: "Đã kiểm chứng",
        K: "",
      });
      seq++;
    }
  }
  return d1List;
}

/**
 * Tạo nhanh phương án biên chế 5 năm (2027-2031) cho Biểu D2 từ kết quả C3
 */
export function generateD2FromC3(c3RowsForUnit) {
  const years = [2027, 2028, 2029, 2030, 2031];
  const d2List = [];
  let idx = 1;

  for (const c3 of c3RowsForUnit) {
    const need = Number(c3.J) || 1;
    for (const yr of years) {
      d2List.push({
        rowNum: idx + 2,
        A: c3.A,
        B: yr,
        C: need,
        D: need,
        E: need,
        F: "Giữ ổn định bố trí hiện có; kết hợp kiêm nhiệm, chuẩn hóa quy trình và ứng dụng CNTT",
        G: 0,
        H: `Căn cứ nhu cầu nhân lực năm cơ sở (${need} người) và dự báo quy mô hoạt động năm ${yr} ổn định; Thủ trưởng đơn vị xác nhận`,
        I: "Đã hoàn thành ở đơn vị",
        L: need,
      });
      idx++;
    }
  }
  return d2List;
}


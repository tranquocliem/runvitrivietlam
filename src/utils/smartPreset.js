// Bộ gợi ý số liệu mẫu hợp lý theo định mức chuẩn (Phụ lục 3 & Thông tư chuyên ngành)
// Giúp người dùng điền nhanh 1 chạm để đạt 100% trạng thái "ĐẠT" và sau đó tinh chỉnh theo thực tế đơn vị

import { QUY_GIO_PP2 } from "./validationEngine";

/**
 * Ước lượng số sản phẩm/năm (Cột C) và số phút/sản phẩm (Cột D) hợp lý dựa trên đơn vị tính và tên công việc
 */
export function suggestB1Metrics(a2Row) {
  const unit = String(a2Row?.F || "").toLowerCase();
  const jobName = String(a2Row?.D || "").toLowerCase();

  // Nếu là công việc giảng dạy/nuôi dưỡng theo ngày-nhóm/lớp hoặc tiết
  if (unit.includes("ngày-nhóm/lớp") || unit.includes("ngày")) {
    return {
      C: 220, // 220 ngày thực học/năm
      D: 360, // 6 giờ/ngày = 360 phút
      E: 40,
      I: "Sổ theo dõi chuyên môn, lịch phân công giảng dạy/trực kỳ 01/10/2025–30/9/2026; Hiệu trưởng/Thủ trưởng đơn vị xác nhận",
      J: "Kiểm đếm, ước lượng thực tế",
    };
  }
  if (unit.includes("tiết")) {
    return {
      C: 805, // 23 tiết/tuần x 35 tuần
      D: 45,  // 45 phút/tiết
      E: 60,
      I: "Thời khóa biểu, sổ đầu bài và phân công chuyên môn năm học (kỳ 01/10/2025–30/9/2026); Ban Giám hiệu xác nhận",
      J: "Kiểm đếm, ước lượng thực tế",
    };
  }
  if (unit.includes("ca trực") || unit.includes("ca")) {
    return {
      C: 365,
      D: 300, // 5 giờ/ca
      E: 0,
      I: "Sổ phân công trực và giao ca bảo vệ/trực đơn vị kỳ 01/10/2025–30/9/2026; Thủ trưởng đơn vị xác nhận",
      J: "Kiểm đếm, ước lượng thực tế",
    };
  }
  if (unit.includes("lượt") || unit.includes("đơn") || unit.includes("bệnh nhân")) {
    return {
      C: 600,
      D: 30,
      E: 20,
      I: "Sổ khám bệnh/Phần mềm quản lý nghiệp vụ; phiếu khảo sát thời gian thực tế có xác nhận (tham chiếu Phụ lục 3 HD 13-HD/BTCTU)",
      J: "Kiểm đếm, ước lượng thực tế",
    };
  }
  if (unit.includes("văn bản") || unit.includes("công văn")) {
    return {
      C: 180,
      D: 120, // 2 giờ/văn bản (mức thông thường Phụ lục 3)
      E: 15,
      I: "Hệ thống quản lý văn bản và điều hành; phiếu đo thời gian thực tế tham chiếu Phụ lục 3 Hướng dẫn 13-HD/BTCTU",
      J: "Kiểm đếm, ước lượng thực tế",
    };
  }
  if (unit.includes("kế hoạch") || unit.includes("chương trình")) {
    return {
      C: 12,
      D: 480, // 8 giờ/kế hoạch (mức đơn giản-thông thường Phụ lục 3)
      E: 12,
      I: "Phiếu ghi nhận thời gian thực tế trên mẫu đại diện (tham chiếu mục I.3 Phụ lục 3 Hướng dẫn 13-HD/BTCTU); Thủ trưởng xác nhận",
      J: "Kiểm đếm, ước lượng thực tế",
    };
  }
  if (unit.includes("báo cáo") || unit.includes("kỳ")) {
    return {
      C: 24,
      D: 240, // 4 giờ/báo cáo (mức thông thường Phụ lục 3)
      E: 10,
      I: "Sổ đăng ký văn bản đi; phiếu đo thời gian thực tế tham chiếu mục I.6 Phụ lục 3 Hướng dẫn 13-HD/BTCTU",
      J: "Kiểm đếm, ước lượng thực tế",
    };
  }
  if (unit.includes("hồ sơ") || unit.includes("bộ")) {
    return {
      C: 45,
      D: 180, // 3 giờ/hồ sơ (mức thông thường Phụ lục 3)
      E: 15,
      I: "Sổ theo dõi hồ sơ nghiệp vụ; phiếu khảo sát thời gian thực tế tham chiếu Phụ lục 3 Hướng dẫn 13-HD/BTCTU",
      J: "Kiểm đếm, ước lượng thực tế",
    };
  }
  if (unit.includes("biên bản") || unit.includes("cuộc") || unit.includes("đợt") || unit.includes("lớp")) {
    return {
      C: 18,
      D: 240, // 4 giờ
      E: 12,
      I: "Hồ sơ cuộc họp/kiểm tra, biên bản lưu; phiếu xác nhận thời gian thực tế của người đứng đầu đơn vị",
      J: "Kiểm đếm, ước lượng thực tế",
    };
  }
  if (unit.includes("thực đơn") || unit.includes("tuần") || unit.includes("tháng") || unit.includes("quý")) {
    return {
      C: 40,
      D: 180,
      E: 10,
      I: "Hồ sơ chuyên môn lưu tại đơn vị; phiếu đo thời gian thực tế kỳ 01/10/2025–30/9/2026 có xác nhận",
      J: "Kiểm đếm, ước lượng thực tế",
    };
  }
  if (jobName.includes("kế toán") || jobName.includes("chứng từ") || jobName.includes("thu, chi")) {
    return {
      C: 360,
      D: 30,
      E: 24,
      I: "Sổ kế toán, chứng từ thanh toán Kho bạc; phiếu đo thời gian thực tế tham chiếu mục V.30 Phụ lục 3 HD 13-HD/BTCTU",
      J: "Kiểm đếm, ước lượng thực tế",
    };
  }

  // Mặc định hợp lý cho các sản phẩm khác
  return {
    C: 20,
    D: 240,
    E: 10,
    I: "Phiếu khảo sát, đo thời gian thực tế trên mẫu đại diện kỳ 01/10/2025–30/9/2026; Thủ trưởng đơn vị ký xác nhận",
    J: "Kiểm đếm, ước lượng thực tế",
  };
}

/**
 * Sinh lời giải thích chi tiết, bình dân, dễ hiểu cho từng công việc cụ thể (A2/B1)
 * để người không rành công nghệ đọc vào hiểu ngay đang nhập cái gì, lấy số ở đâu và tính thế nào
 */
export function explainJobInDetail(a2Row) {
  const suggested = suggestB1Metrics(a2Row);
  const unit = String(a2Row?.F || "sản phẩm").toLowerCase();
  const jobName = String(a2Row?.D || "").toLowerCase();
  const product = a2Row?.E || "Sản phẩm đầu ra của công việc";

  let howToCountC = `Đếm tổng số "${a2Row?.F || "sản phẩm"}" (${product}) đã thực hiện hoàn thành trong 1 năm (từ 01/10/2025 đến 30/9/2026) từ sổ theo dõi chuyên môn hoặc hệ thống văn bản.`;
  let rangeC = `Khoảng ${Math.max(1, Math.round(suggested.C * 0.6))} – ${Math.round(suggested.C * 1.4)} ${a2Row?.F || "SP"}/năm (Gợi ý chuẩn: ${suggested.C})`;
  let howToEstimateD = `Ước tính tổng số phút từ lúc nghiên cứu, chuẩn bị, soạn thảo/thực hiện đến khi hoàn tất 01 ${a2Row?.F || "sản phẩm"}.`;
  let rangeD = `Khoảng ${Math.max(15, Math.round(suggested.D * 0.75))} – ${Math.round(suggested.D * 1.25)} phút/SP (Gợi ý chuẩn: ${suggested.D} phút = ${(suggested.D / 60).toFixed(1)} giờ)`;
  let howToEstimateE = `Số giờ phát sinh thêm trong cả năm cho việc họp bàn, đi cơ sở, phối hợp, chỉnh sửa nhiều lần ngoài thời gian làm sản phẩm chính (Gợi ý: ${suggested.E} giờ/năm; nếu không có thì nhập 0).`;

  if (unit.includes("tiết")) {
    howToCountC = "Lấy số tiết dạy trung bình 1 tuần × 35 tuần thực học trong năm học (kỳ 01/10/2025–30/9/2026) theo Thời khóa biểu và Sổ đầu bài.";
    howToEstimateD = "Mỗi tiết học theo quy định chuẩn (35–45 phút/tiết tùy cấp học).";
  } else if (unit.includes("ngày-nhóm/lớp") || unit.includes("ngày")) {
    howToCountC = "Đếm tổng số ngày thực tế tổ chức nuôi dưỡng, chăm sóc, giáo dục trẻ hoặc trực chuyên môn trong năm học (~220 ngày thực học).";
    howToEstimateD = "Số phút làm việc trực tiếp trên nhóm/lớp trong 1 ngày (VD: 6 giờ/ngày = 360 phút; 8 giờ/ngày = 480 phút).";
  } else if (jobName.includes("kế hoạch") || jobName.includes("chương trình")) {
    howToCountC = "Đếm số Kế hoạch năm (1), Kế hoạch quý (4), Kế hoạch tháng (12) và các Kế hoạch chuyên đề/đợt đã ban hành trong kỳ.";
    howToEstimateD = "Tính từ lúc thu thập số liệu, dự thảo kế hoạch, lấy ý kiến đến khi trình ký ban hành (thường từ 4–8 giờ = 240–480 phút/kế hoạch).";
  } else if (jobName.includes("báo cáo") || unit.includes("báo cáo")) {
    howToCountC = "Đếm số Báo cáo tuần (52), tháng (12), quý (4), 6 tháng, năm và báo cáo đột xuất đã gửi đi trong kỳ 01/10/2025–30/9/2026.";
    howToEstimateD = "Thời gian tổng hợp số liệu, viết dự thảo, rà soát và trình ký 01 báo cáo (thường từ 2–4 giờ = 120–240 phút/báo cáo).";
  } else if (jobName.includes("tập huấn") || jobName.includes("hội thi") || jobName.includes("giải") || unit.includes("cuộc")) {
    howToCountC = "Đếm tổng số lớp tập huấn, hội nghị, hội thi, giải thi đấu hoặc đợt ra quân thực tế đã tổ chức trong năm.";
    howToEstimateD = "Tính cả thời gian chuẩn bị hậu cần, tài liệu, giấy mời và thời gian trực tiếp tổ chức 01 cuộc/lớp (thường từ 4–8 giờ = 240–480 phút/cuộc).";
  } else if (jobName.includes("truyền thanh") || jobName.includes("phát thanh") || jobName.includes("tin, bài")) {
    howToCountC = "Đếm tổng số chương trình phát thanh, bản tin, bài viết hoặc số ca tiếp âm/phát sóng thực hiện trong 1 năm.";
    howToEstimateD = "Thời gian đi lấy tin, viết bài, biên tập, đọc thu âm hoặc trực vận hành máy phát cho 01 bản tin/chương trình.";
  } else if (jobName.includes("kế toán") || jobName.includes("dự toán") || jobName.includes("quyết toán") || jobName.includes("tài sản")) {
    howToCountC = "Đếm tổng số bộ chứng từ thanh toán, bảng lương hàng tháng, bộ hồ sơ dự toán/quyết toán hoặc đợt kiểm kê tài sản trong năm.";
    howToEstimateD = "Thời gian kiểm tra hóa đơn chứng từ, nhập phần mềm kế toán, giao dịch Kho bạc Nhà nước cho 01 bộ hồ sơ.";
  } else if (jobName.includes("văn thư") || jobName.includes("lưu trữ") || jobName.includes("văn bản đến")) {
    howToCountC = "Đếm tổng số văn bản đến + văn bản đi trên Hệ thống Quản lý văn bản hoặc số hồ sơ lưu trữ lập trong kỳ.";
    howToEstimateD = "Thời gian tiếp nhận, vào sổ, chuyển giao, kiểm tra thể thức, đóng dấu và phát hành cho 01 văn bản/hồ sơ.";
  }

  const sampleHoursF = Math.round(((suggested.C * suggested.D) / 60) * 10) / 10;
  const sampleHoursG = Math.round((sampleHoursF + suggested.E) * 10) / 10;

  return {
    suggested,
    howToCountC,
    rangeC,
    howToEstimateD,
    rangeD,
    howToEstimateE,
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
 */
export function generateD1FromC3(c3RowsForUnit, c1RowsForUnit, unitCode = "DVSN") {
  const c1Map = {};
  for (const r of c1RowsForUnit) {
    c1Map[r.A] = r;
  }
  const d1List = [];
  let seq = 1;
  const cleanCode = (unitCode || "DVSN").trim().toUpperCase();

  for (const c3 of c3RowsForUnit) {
    const count = Math.max(1, Math.min(25, Number(c3.J) || 1));
    const c1 = c1Map[c3.A];
    const quyGio = c1 && typeof c1.E === "number" ? c1.E : QUY_GIO_PP2;
    const loai = c1?.C || "Viên chức";

    for (let i = 0; i < count; i++) {
      const stt = String(seq).padStart(3, "0");
      d1List.push({
        rowNum: seq + 2,
        A: `${cleanCode}.${stt}`,
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


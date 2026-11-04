// Mô phỏng chính xác 100% hệ thống công thức tự tính và cảnh báo của 03_DVSN_XA.xlsx
export const QUY_GIO_PP2 = 1904;

function isNum(val) {
  if (val === "" || val === null || val === undefined) return false;
  const n = Number(val);
  return !Number.isNaN(n) && Number.isFinite(n);
}

function toNum(val) {
  return isNum(val) ? Number(val) : 0;
}

function str(val) {
  return val === null || val === undefined ? "" : String(val).trim();
}

/**
 * Tính toán dòng Biểu B1 (sheet 3. B1_KhoiLuong)
 * Cột:
 * A: Mã công việc
 * B: Mã VTVL (tra từ A2)
 * C: Số SP/năm
 * D: Phút/SP
 * E: Giờ bổ sung
 * F: Giờ theo SP (tự tính)
 * G: Tổng giờ B1 (tự tính)
 * H: Nguồn số lượng
 * I: Nguồn thời gian
 * J: Căn cứ thời gian ("Kiểm đếm, ước lượng thực tế" | "Có định mức")
 * K: Kỳ ("01/10/2025–30/9/2026")
 * L: Mã SP chuẩn
 * M, N, O: Tra từ 11. DM_SAN_PHAM (D: phân nhóm, E: phút chuẩn, G: trạng thái xác nhận)
 * P: Phút áp dụng (tự tính)
 * Q: Thuyết minh thời gian (tự tính)
 * R: Cảnh báo (tự tính)
 * S: Giải trình khác chuẩn
 */
export function evaluateB1Row(row, a2Map, dmSanPhamMap) {
  const A = str(row.A);
  if (!A) {
    return { ...row, B: "", F: "", G: "", M: "", N: "", O: "", P: "", Q: "", R: "" };
  }

  const a2Item = a2Map[A];
  const B = a2Item ? str(a2Item.C) : "";
  const C = row.C === "" || row.C === null || row.C === undefined ? "" : (isNum(row.C) ? Number(row.C) : row.C);
  const D = row.D === "" || row.D === null || row.D === undefined ? "" : (isNum(row.D) ? Number(row.D) : row.D);
  const E = row.E === "" || row.E === null || row.E === undefined ? "" : (isNum(row.E) ? Number(row.E) : row.E);
  const H = str(row.H);
  const I = str(row.I);
  const J = str(row.J);
  const K = str(row.K);
  const L = str(row.L);
  const S = str(row.S);

  const spItem = L && dmSanPhamMap ? dmSanPhamMap[L] : null;
  const M = spItem ? str(spItem.D) : "";
  const N = spItem && isNum(spItem.E) ? Number(spItem.E) : (spItem ? str(spItem.E) : "");
  const O = spItem ? str(spItem.G) : "";
  const spSourceF = spItem ? str(spItem.F) : "";

  // P3 := IF(A3="","",IF(AND(ISNUMBER(N3),N3>0,O3="Đã xác nhận",S3=""),N3,IF(AND(ISNUMBER(D3),D3>0,OR(J3="Kiểm đếm, ước lượng thực tế",AND(J3="Có định mức",I3<>""))),D3,"")))
  let P = "";
  const condCatalogVerified = isNum(N) && Number(N) > 0 && O === "Đã xác nhận" && S === "";
  if (condCatalogVerified) {
    P = Number(N);
  } else if (
    isNum(D) &&
    Number(D) > 0 &&
    (J === "Kiểm đếm, ước lượng thực tế" || (J === "Có định mức" && I !== ""))
  ) {
    P = Number(D);
  }

  // Q3 := IF(P3="","",IF(AND(ISNUMBER(N3),N3>0,O3="Đã xác nhận",S3=""),"Định mức danh mục: "&...,IF(J3="Có định mức","Định mức: "&I3,"Ước lượng thực tế"&IF(I3="","","; "&I3))))
  let Q = "";
  if (P !== "") {
    if (condCatalogVerified) {
      Q = `Định mức danh mục: ${spSourceF}`;
    } else if (J === "Có định mức") {
      Q = `Định mức: ${I}`;
    } else {
      Q = `Ước lượng thực tế${I ? "; " + I : ""}`;
    }
  }

  // R3 := IF(A3="","",IF(B3="","THIẾU MÃ VTVL",IF(H3="","THIẾU NGUỒN SẢN LƯỢNG/CÔNG VIỆC",IF(K3="","THIẾU KỲ",IF(AND(C3="",ISNUMBER(E3),E3>0,I3<>""),"ĐẠT",IF(AND(C3="",ISNUMBER(E3),E3>0,I3=""),"THIẾU NGUỒN THỜI GIAN",IF(C3="","THIẾU SẢN LƯỢNG",IF(J3="","CHƯA CHỌN TRẠNG THÁI",IF(AND(ISNUMBER(N3),N3>0,O3="Đã xác nhận",S3<>"",LEFT(TRIM(S3),LEN("Đã xác nhận:"))<>"Đã xác nhận:"),"CHỜ XÁC NHẬN KHÁC CHUẨN",IF(AND(I3="",NOT(AND(ISNUMBER(N3),N3>0,O3="Đã xác nhận",S3=""))),"THIẾU NGUỒN THỜI GIAN",IF(P3="","THIẾU THỜI GIAN","ĐẠT")))))))))))
  let R = "";
  if (!B) {
    R = "THIẾU MÃ VTVL";
  } else if (!H) {
    R = "THIẾU NGUỒN SẢN LƯỢNG/CÔNG VIỆC";
  } else if (!K) {
    R = "THIẾU KỲ";
  } else if (C === "" && isNum(E) && Number(E) > 0 && I !== "") {
    R = "ĐẠT";
  } else if (C === "" && isNum(E) && Number(E) > 0 && I === "") {
    R = "THIẾU NGUỒN THỜI GIAN";
  } else if (C === "") {
    R = "THIẾU SẢN LƯỢNG";
  } else if (!J) {
    R = "CHƯA CHỌN TRẠNG THÁI";
  } else if (
    isNum(N) &&
    Number(N) > 0 &&
    O === "Đã xác nhận" &&
    S !== "" &&
    !S.startsWith("Đã xác nhận:")
  ) {
    R = "CHỜ XÁC NHẬN KHÁC CHUẨN";
  } else if (I === "" && !condCatalogVerified) {
    R = "THIẾU NGUỒN THỜI GIAN";
  } else if (P === "") {
    R = "THIẾU THỜI GIAN";
  } else {
    R = "ĐẠT";
  }

  // F3 := IF(R3<>"ĐẠT","",IF(AND(C3="",ISNUMBER(E3),E3>0),0,C3*P3/60))
  let F = "";
  if (R === "ĐẠT") {
    if (C === "" && isNum(E) && Number(E) > 0) {
      F = 0;
    } else if (isNum(C) && isNum(P)) {
      F = (Number(C) * Number(P)) / 60;
    }
  }

  // G3 := IF(NOT(ISNUMBER(F3)),"",F3+IF(ISNUMBER(E3),E3,0))
  let G = "";
  if (isNum(F)) {
    G = Number(F) + (isNum(E) ? Number(E) : 0);
  }

  return {
    ...row,
    B,
    M,
    N,
    O,
    P,
    Q,
    R,
    F,
    G,
  };
}

/**
 * Tính toán dòng Biểu B2_CT_TacDong (sheet 4. B2_CT_TacDong)
 */
export function evaluateB2CTRow(row, a2Map, b1EvaluatedRows) {
  const A = str(row.A);
  if (!A) {
    return { ...row, B: "", H: "", N: "", O: "", P: "" };
  }

  const a2Item = a2Map[A];
  const B = a2Item ? str(a2Item.C) : "";
  const C = str(row.C);
  const D = str(row.D);
  const E = row.E === "" || row.E === null || row.E === undefined ? "" : (isNum(row.E) ? Number(row.E) : row.E);
  const F = row.F === "" || row.F === null || row.F === undefined ? "" : (isNum(row.F) ? Number(row.F) : row.F);
  const G = row.G === "" || row.G === null || row.G === undefined ? "" : (isNum(row.G) ? Number(row.G) : row.G);
  const I = row.I === "" || row.I === null || row.I === undefined ? "" : (isNum(row.I) ? Number(row.I) : row.I);
  const J = str(row.J);
  const K = str(row.K);
  const L = str(row.L);
  const M = str(row.M);
  const S = str(row.S);

  // H3 := IF(OR(A3="",NOT(ISNUMBER(E3)),NOT(ISNUMBER(F3)),NOT(ISNUMBER(G3)),F3<G3),"",E3*(F3-G3)/60)
  let H = "";
  if (isNum(E) && isNum(F) && isNum(G) && Number(F) >= Number(G)) {
    H = (Number(E) * (Number(F) - Number(G))) / 60;
  }

  // Tổng sản lượng C và tổng giờ G của mã A tại B1
  let sumB1_C = 0;
  let sumB1_G = 0;
  for (const b1 of b1EvaluatedRows) {
    if (str(b1.A) === A) {
      if (isNum(b1.C)) sumB1_C += Number(b1.C);
      if (isNum(b1.G)) sumB1_G += Number(b1.G);
    }
  }

  const validTypes = [
    "Số hóa",
    "Cải tiến quy trình",
    "Thuê dịch vụ/đặt hàng",
    "Tự chủ",
    "Xã hội hóa",
    "Công việc mới phát sinh",
  ];

  // P3 formula
  let P = "";
  if (M === "Ước lượng tham khảo") {
    P = "THAM KHẢO – KHÔNG TÍNH";
  } else if (!B || !D || !J || !K || !L || M !== "Đã kiểm chứng") {
    P = "CHƯA ĐỦ CĂN CỨ";
  } else if (!validTypes.includes(C)) {
    P = "LOẠI TÁC ĐỘNG KHÔNG HỢP LỆ";
  } else if (S !== "Đã đối chiếu") {
    P = "CHỜ SOÁT TRÙNG";
  } else if (H === "" && I === "") {
    P = "THIẾU GIỜ TÁC ĐỘNG";
  } else if (H !== "" && (E === "" || Number(E) <= 0)) {
    P = "THIẾU SẢN PHẨM ÁP DỤNG";
  } else if (H !== "" && Number(E) > sumB1_C) {
    P = "SẢN PHẨM ÁP DỤNG VƯỢT B1";
  } else if (F !== "" && G !== "" && Number(F) < Number(G) && (I === "" || Number(I) <= 0)) {
    P = "THỜI GIAN TĂNG CHƯA GHI GIỜ MỚI";
  } else if (L === "Trước thay đổi, có điều chỉnh" && H !== "" && Number(H) > sumB1_G) {
    P = "GIỜ GIẢM VƯỢT GIỜ B1";
  } else {
    P = "ĐẠT";
  }

  // N3 := IF(A3="","",IF(AND(P3="ĐẠT",L3="Trước thay đổi, có điều chỉnh",H3<>""),H3,0))
  const N = P === "ĐẠT" && L === "Trước thay đổi, có điều chỉnh" && isNum(H) ? Number(H) : 0;

  // O3 := IF(A3="","",IF(AND(P3="ĐẠT",I3<>""),I3,0))
  const O = P === "ĐẠT" && isNum(I) ? Number(I) : 0;

  return {
    ...row,
    B,
    H,
    N,
    O,
    P,
  };
}

/**
 * Tính toán Biểu C1_VTVL (sheet 6. C1_VTVL)
 * E3 := IF(A3="","",IF(NOT(OR(J3="Phổ biến (40 giờ/tuần)",J3="Đặc thù")),"",IF(OR(J3="Đặc thù",H3<>""),IF(AND(ISNUMBER(H3),H3>0,F3<>"",I3="Đã kiểm chứng"),H3,""),QUY_GIO_PP2)))
 * K3 := IF(A3="","",IF(J3="","CHƯA CHỌN CHẾ ĐỘ LÀM VIỆC",IF(NOT(OR(J3="Phổ biến (40 giờ/tuần)",J3="Đặc thù")),"CHẾ ĐỘ KHÔNG HỢP LỆ",IF(AND(J3="Đặc thù",E3=""),"THIẾU GIỜ ĐẶC THÙ",IF(AND(H3<>"",E3=""),"GIỜ CHƯA XÁC NHẬN",IF(E3="","THIẾU MẪU SỐ","ĐẠT"))))))
 */
export function evaluateC1Row(row) {
  const A = str(row.A);
  if (!A) {
    return { ...row, E: "", K: "" };
  }
  const F = str(row.F);
  const H = row.H === "" || row.H === null || row.H === undefined ? "" : (isNum(row.H) ? Number(row.H) : row.H);
  const I = str(row.I);
  const J = str(row.J);

  let E = "";
  const validJ = J === "Phổ biến (40 giờ/tuần)" || J === "Đặc thù";
  if (validJ) {
    if (J === "Đặc thù" || H !== "") {
      if (isNum(H) && Number(H) > 0 && F !== "" && I === "Đã kiểm chứng") {
        E = Number(H);
      } else {
        E = "";
      }
    } else {
      E = QUY_GIO_PP2;
    }
  }

  let K = "";
  if (!J) {
    K = "CHƯA CHỌN CHẾ ĐỘ LÀM VIỆC";
  } else if (!validJ) {
    K = "CHẾ ĐỘ KHÔNG HỢP LỆ";
  } else if (J === "Đặc thù" && E === "") {
    K = "THIẾU GIỜ ĐẶC THÙ";
  } else if (H !== "" && E === "") {
    K = "GIỜ CHƯA XÁC NHẬN";
  } else if (E === "") {
    K = "THIẾU MẪU SỐ";
  } else {
    K = "ĐẠT";
  }

  return {
    ...row,
    E,
    K,
  };
}

/**
 * Tính toán Biểu C3_NhuCau (sheet 8. C3_NhuCau)
 */
export function evaluateC3Row(row, c1EvaluatedRows, b1EvaluatedRows, b2CTEvaluatedRows) {
  const A = str(row.A);
  if (!A) {
    return { ...row, C: "", D: "", E: "", F: "", G: "", M: "", N: "" };
  }
  const B = str(row.B);
  const H = row.H === "" || row.H === null || row.H === undefined ? "" : (isNum(row.H) ? Number(row.H) : row.H);
  const I = row.I === "" || row.I === null || row.I === undefined ? "" : (isNum(row.I) ? Number(row.I) : row.I);
  const J = row.J === "" || row.J === null || row.J === undefined ? "" : (isNum(row.J) ? Number(row.J) : row.J);
  const K = str(row.K);
  const L = str(row.L);

  // Kiểm tra C1
  const c1Match = c1EvaluatedRows.filter((r) => str(r.A) === A);
  const countC1 = c1Match.length;
  const F = countC1 > 0 && isNum(c1Match[0].E) ? Number(c1Match[0].E) : "";

  // C3 := IF(A3="","",IF(COUNTIFS('3. B1_KhoiLuong'!$B$3:$B$30002,A3,'3. B1_KhoiLuong'!$R$3:$R$30002,"ĐẠT")=0,"",SUMIFS('3. B1_KhoiLuong'!$G$3:$G$30002,'3. B1_KhoiLuong'!$B$3:$B$30002,A3,'3. B1_KhoiLuong'!$R$3:$R$30002,"ĐẠT")))
  let countB1Dat = 0;
  let sumB1DatG = 0;
  let countB1NotDat = 0;
  for (const b1 of b1EvaluatedRows) {
    if (str(b1.B) === A) {
      if (b1.R === "ĐẠT") {
        countB1Dat++;
        if (isNum(b1.G)) sumB1DatG += Number(b1.G);
      } else {
        countB1NotDat++;
      }
    }
  }
  const C = countB1Dat === 0 ? "" : sumB1DatG;
  const N = countB1NotDat;

  // D3 := SUMIF('5. B2_ThayDoi'!$B$3:$B$30002,A3,'5. B2_ThayDoi'!$F$3:$F$30002)
  // Trong đó F ở B2_ThayDoi = Giờ tăng (O) - Giờ giảm (N) của B2_CT
  let sumB2Net = 0;
  let countB2Invalid = 0;
  for (const b2 of b2CTEvaluatedRows) {
    if (str(b2.B) === A) {
      const net = toNum(b2.O) - toNum(b2.N);
      sumB2Net += net;
      if (str(b2.M) !== "Ước lượng tham khảo" && b2.P !== "ĐẠT") {
        countB2Invalid++;
      }
    }
  }
  const D = sumB2Net;

  // E3 := IF(OR(A3="",C3=""),"",C3+IF(D3="",0,D3))
  const E = C === "" ? "" : Number(C) + (isNum(D) ? Number(D) : 0);

  // G3 := IF(OR(A3="",NOT(ISNUMBER(SEARCH("PP2",B3))),E3="",F3="",E3<0),"",IF(F3>0,E3/F3,""))
  let G = "";
  const hasPP1 = B.includes("PP1");
  const hasPP2 = B.includes("PP2");
  const hasPP3 = B.includes("PP3");
  if (hasPP2 && isNum(E) && isNum(F) && Number(E) >= 0 && Number(F) > 0) {
    G = Number(E) / Number(F);
  }

  const validMethods = ["PP1", "PP2", "PP3", "PP1+PP2", "PP1+PP3", "PP2+PP3", "PP1+PP2+PP3"];

  let M = "";
  if (countC1 !== 1) {
    M = "KIỂM TRA MÃ VTVL C1";
  } else if (!validMethods.includes(B)) {
    M = "PHƯƠNG PHÁP KHÔNG HỢP LỆ";
  } else if (hasPP2 && (G === "" || N > 0)) {
    M = "PP2: THIẾU GIỜ HOẶC B1 CHƯA ĐẠT";
  } else if (hasPP2 && countB2Invalid > 0) {
    M = "PP2: B2 CHƯA ĐỦ CĂN CỨ";
  } else if (hasPP1 && H === "") {
    M = "PP1: THIẾU SỐ NGƯỜI";
  } else if (hasPP3 && I === "") {
    M = "PP3: THIẾU CĂN CỨ CHUYÊN GIA";
  } else if (!K) {
    M = "THIẾU NGUỒN/GIẢI TRÌNH";
  } else if (J === "") {
    M = "CHƯA KẾT LUẬN NGƯỜI CẦN BỐ TRÍ";
  } else if (L !== "Đã kiểm chứng") {
    M = "CHỜ XÁC NHẬN NGHIỆP VỤ";
  } else {
    M = "ĐẠT";
  }

  return {
    ...row,
    C,
    D,
    E,
    F,
    G,
    M,
    N,
  };
}

/**
 * Tính toán Biểu D1_NhanLuc (sheet 9. D1_NhanLuc)
 * J3 := IF(A3="","",IF(COUNTIF($A$3:$A$30002,A3)>1,"TRÙNG MÃ NGUỒN LỰC",IF(G3="","THIẾU NƠI TÍNH BIÊN CHẾ",IF(OR(D3="",E3="",F3="",H3="",I3<>"Đã kiểm chứng"),"Chưa đủ căn cứ",IF(E3+F3>D3,"Vượt quỹ giờ","Đạt")))))
 */
export function evaluateD1Rows(rows, c1EvaluatedRows) {
  const counts = {};
  for (const r of rows) {
    const a = str(r.A);
    if (a) counts[a] = (counts[a] || 0) + 1;
  }

  const c1Map = {};
  for (const c1 of c1EvaluatedRows) {
    if (str(c1.A)) c1Map[str(c1.A)] = c1;
  }

  return rows.map((row) => {
    const A = str(row.A);
    if (!A) return { ...row, D: "", J: "" };

    const B = str(row.B);
    const c1 = c1Map[B];
    // D tự lấy quỹ giờ từ C1 (hoặc giờ riêng ở K)
    let D = row.D;
    if (isNum(row.K) && Number(row.K) > 0) {
      D = Number(row.K);
    } else if (c1 && isNum(c1.E)) {
      D = Number(c1.E);
    } else if (isNum(row.D)) {
      D = Number(row.D);
    } else {
      D = QUY_GIO_PP2;
    }

    const E = row.E === "" || row.E === null || row.E === undefined ? "" : (isNum(row.E) ? Number(row.E) : row.E);
    const F = row.F === "" || row.F === null || row.F === undefined ? "" : (isNum(row.F) ? Number(row.F) : row.F);
    const G = str(row.G);
    const H = str(row.H);
    const I = str(row.I);

    let J = "";
    if (counts[A] > 1) {
      J = "TRÙNG MÃ NGUỒN LỰC";
    } else if (!G) {
      J = "THIẾU NƠI TÍNH BIÊN CHẾ";
    } else if (D === "" || E === "" || F === "" || !H || I !== "Đã kiểm chứng") {
      J = "Chưa đủ căn cứ";
    } else if (Number(E) + Number(F) > Number(D)) {
      J = "Vượt quỹ giờ";
    } else {
      J = "Đạt";
    }

    return { ...row, D, J };
  });
}

/**
 * Tính toán Biểu D2_PhuongAn (sheet 10. D2_PhuongAn)
 * M3 := IF(A3="","",IF(H3="","THIẾU GIẢI TRÌNH",IF(C3="","CHƯA NHẬP SỐ NGƯỜI CẦN BỐ TRÍ",IF(D3="","THIẾU NGƯỜI CÙNG ĐƠN VỊ TÍNH",IF(OR(NOT(ISNUMBER(C3)),NOT(ISNUMBER(D3))),"C/D PHẢI TÍNH THEO NGƯỜI",IF(OR(C3<0,D3<0),"SỐ NGƯỜI ÂM",IF(AND(L3<>"",C3<>L3),"KHÁC NĂM CƠ SỞ – GIẢI TRÌNH","CẦN THẨM ĐỊNH")))))))
 */
export function evaluateD2Rows(rows, c3EvaluatedRows) {
  const c3Map = {};
  for (const c3 of c3EvaluatedRows) {
    if (str(c3.A)) c3Map[str(c3.A)] = c3;
  }

  return rows.map((row) => {
    const A = str(row.A);
    if (!A) return { ...row, M: "" };

    const c3 = c3Map[A];
    const L = c3 && isNum(c3.J) ? Number(c3.J) : (row.L !== undefined && row.L !== "" ? row.L : "");
    const C = row.C !== "" && row.C !== undefined && row.C !== null ? (isNum(row.C) ? Number(row.C) : row.C) : L;
    const D = row.D === "" || row.D === null || row.D === undefined ? "" : (isNum(row.D) ? Number(row.D) : row.D);
    const H = str(row.H);

    let M = "";
    if (!H) {
      M = "THIẾU GIẢI TRÌNH";
    } else if (C === "") {
      M = "CHƯA NHẬP SỐ NGƯỜI CẦN BỐ TRÍ";
    } else if (D === "") {
      M = "THIẾU NGƯỜI CÙNG ĐƠN VỊ TÍNH";
    } else if (!isNum(C) || !isNum(D)) {
      M = "C/D PHẢI TÍNH THEO NGƯỜI";
    } else if (Number(C) < 0 || Number(D) < 0) {
      M = "SỐ NGƯỜI ÂM";
    } else if (L !== "" && Number(C) !== Number(L)) {
      M = "KHÁC NĂM CƠ SỞ – GIẢI TRÌNH";
    } else {
      M = "CẦN THẨM ĐỊNH";
    }

    return { ...row, C, L, M };
  });
}


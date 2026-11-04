import JSZip from "jszip";

function escapeXml(unsafe) {
  if (unsafe === null || unsafe === undefined) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function decodeXml(s) {
  if (!s) return "";
  return String(s)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function colToNum(col) {
  let n = 0;
  for (let i = 0; i < col.length; i++) {
    n = n * 26 + (col.charCodeAt(i) - 64);
  }
  return n;
}

function isNumericValue(val) {
  if (val === "" || val === null || val === undefined) return false;
  if (typeof val === "number") return !Number.isNaN(val) && Number.isFinite(val);
  const trimmed = String(val).trim();
  if (trimmed === "") return false;
  const n = Number(trimmed);
  return !Number.isNaN(n) && Number.isFinite(n);
}

/**
 * Cập nhật một ô (cell) trong nội dung XML của một <row r="rowNum">...</row>
 * Chỉ sửa giá trị của các cột nhập liệu (white cells), giữ nguyên 100% các cột công thức (grey cells) và thuộc tính style (s="...")
 */
function updateRowXml(rowInnerXml, rowNum, updates, numericCols = new Set()) {
  const cellRegex = /<c\s+r="([A-Z]+)\d+"([^/>]*)(?:\/>|>([\s\S]*?)<\/c>)/g;
  const existingCells = new Map();
  let match;
  while ((match = cellRegex.exec(rowInnerXml)) !== null) {
    const col = match[1];
    const attrs = match[2] || "";
    const inner = match[3] || "";
    const fullMatch = match[0];
    const sMatch = /\bs="(\d+)"/.exec(attrs);
    const styleAttr = sMatch ? ` s="${sMatch[1]}"` : "";
    const hasFormula = inner.includes("<f");
    existingCells.set(col, {
      col,
      attrs,
      inner,
      fullMatch,
      styleAttr,
      hasFormula,
    });
  }

  for (const [col, rawVal] of Object.entries(updates)) {
    const existing = existingCells.get(col);
    // Tuyệt đối không ghi đè vào ô có công thức (<f>)
    if (existing && existing.hasFormula) continue;

    const styleAttr = existing ? existing.styleAttr : "";
    const cellRef = `${col}${rowNum}`;
    let newCellXml = "";

    if (rawVal === "" || rawVal === null || rawVal === undefined) {
      newCellXml = `<c r="${cellRef}"${styleAttr}/>`;
    } else if (numericCols.has(col) && isNumericValue(rawVal)) {
      newCellXml = `<c r="${cellRef}"${styleAttr}><v>${Number(rawVal)}</v></c>`;
    } else {
      newCellXml = `<c r="${cellRef}"${styleAttr} t="inlineStr"><is><t xml:space="preserve">${escapeXml(rawVal)}</t></is></c>`;
    }

    existingCells.set(col, {
      col,
      fullMatch: newCellXml,
      styleAttr,
      hasFormula: false,
    });
  }

  // Sắp xếp lại các cell theo đúng thứ tự cột A, B, C... chuẩn OpenXML
  const sortedCols = Array.from(existingCells.keys()).sort(
    (a, b) => colToNum(a) - colToNum(b)
  );
  return sortedCols.map((c) => existingCells.get(c).fullMatch).join("");
}

/**
 * Cập nhật hàng loạt dòng trên một worksheet XML
 */
function updateSheetXml(sheetXml, rowUpdatesMap, numericCols) {
  return sheetXml.replace(
    /(<row\s+r="(\d+)"[^>]*>)([\s\S]*?)(<\/row>)/g,
    (fullRow, openTag, rNumStr, rowInner, closeTag) => {
      const rNum = parseInt(rNumStr, 10);
      const updates = rowUpdatesMap.get(rNum);
      if (!updates) return fullRow;
      const newInner = updateRowXml(rowInner, rNum, updates, numericCols);
      return `${openTag}${newInner}${closeTag}`;
    }
  );
}

/**
 * Thay thế tiền tố XXX bằng Mã cơ quan (nếu người dùng bật tuỳ chọn thay mã)
 */
function applyUnitCodePrefix(val, unitCodePrefix) {
  if (!unitCodePrefix || unitCodePrefix === "XXX" || typeof val !== "string") {
    return val;
  }
  return val.replace(/\bXXX-/g, `${unitCodePrefix}-`);
}

/**
 * Xuất dữ liệu từ Web App ra đúng bản gốc 03_DVSN_XA.xlsx
 * Chỉ điền các ô màu trắng, giữ nguyên khóa bảo vệ, công thức ô xám, dataValidation và các sheet ẩn.
 */
export async function exportToOriginalExcel(state, options = {}) {
  const { replacePrefix = false, unitCode = "DVSN" } = options;
  const prefix = replacePrefix && unitCode ? unitCode.trim().toUpperCase() : "XXX";

  const response = await fetch("/templates/03_DVSN_XA.xlsx");
  if (!response.ok) {
    throw new Error("Không tải được file mẫu gốc /templates/03_DVSN_XA.xlsx");
  }
  const arrayBuffer = await response.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  // 1. Sheet 3: 1. A1_NhiemVu (Cột trắng: A, B, C, D, E, F, G)
  const a1Map = new Map();
  for (const r of state.A1 || []) {
    if (!r.rowNum) continue;
    a1Map.set(r.rowNum, {
      A: applyUnitCodePrefix(r.A, prefix),
      B: r.B,
      C: r.C,
      D: r.D,
      E: r.E,
      F: r.F,
      G: r.G,
    });
  }
  let sheet3Xml = await zip.file("xl/worksheets/sheet3.xml").async("string");
  sheet3Xml = updateSheetXml(sheet3Xml, a1Map, new Set());
  zip.file("xl/worksheets/sheet3.xml", sheet3Xml);

  // 2. Sheet 4: 2. A2_CongViec (Cột trắng: A, B, C, D, E, F, G, H)
  const a2Map = new Map();
  for (const r of state.A2 || []) {
    if (!r.rowNum) continue;
    a2Map.set(r.rowNum, {
      A: applyUnitCodePrefix(r.A, prefix),
      B: applyUnitCodePrefix(r.B, prefix),
      C: applyUnitCodePrefix(r.C, prefix),
      D: r.D,
      E: r.E,
      F: r.F,
      G: r.G,
      H: applyUnitCodePrefix(r.H, prefix),
    });
  }
  let sheet4Xml = await zip.file("xl/worksheets/sheet4.xml").async("string");
  sheet4Xml = updateSheetXml(sheet4Xml, a2Map, new Set());
  zip.file("xl/worksheets/sheet4.xml", sheet4Xml);

  // 3. Sheet 5: 3. B1_KhoiLuong (Cột trắng: A, C, D, E, H, I, J, K, L, S; Cột số: C, D, E)
  const b1Map = new Map();
  for (const r of state.B1 || []) {
    if (!r.rowNum) continue;
    b1Map.set(r.rowNum, {
      A: applyUnitCodePrefix(r.A, prefix),
      C: r.C,
      D: r.D,
      E: r.E,
      H: r.H,
      I: r.I,
      J: r.J,
      K: r.K,
      L: r.L,
      S: r.S || "",
    });
  }
  let sheet5Xml = await zip.file("xl/worksheets/sheet5.xml").async("string");
  sheet5Xml = updateSheetXml(sheet5Xml, b1Map, new Set(["C", "D", "E"]));
  zip.file("xl/worksheets/sheet5.xml", sheet5Xml);

  // 4. Sheet 6: 4. B2_CT_TacDong (Cột trắng: A, C, D, E, F, G, I, J, K, L, M, S; Cột số: E, F, G, I)
  const b2Map = new Map();
  for (const r of state.B2_CT || []) {
    if (!r.rowNum) continue;
    b2Map.set(r.rowNum, {
      A: applyUnitCodePrefix(r.A, prefix),
      C: r.C,
      D: r.D,
      E: r.E ?? "",
      F: r.F ?? "",
      G: r.G ?? "",
      I: r.I ?? "",
      J: r.J,
      K: r.K,
      L: r.L,
      M: r.M,
      S: r.S,
    });
  }
  let sheet6Xml = await zip.file("xl/worksheets/sheet6.xml").async("string");
  sheet6Xml = updateSheetXml(sheet6Xml, b2Map, new Set(["E", "F", "G", "I"]));
  zip.file("xl/worksheets/sheet6.xml", sheet6Xml);

  // 5. Sheet 7: 5. B2_ThayDoi (Cột A nếu có thay đổi mã)
  if (replacePrefix && prefix !== "XXX") {
    const b2TdMap = new Map();
    for (const r of state.B2_CT || []) {
      if (!r.rowNum) continue;
      b2TdMap.set(r.rowNum, { A: applyUnitCodePrefix(r.A, prefix) });
    }
    let sheet7Xml = await zip.file("xl/worksheets/sheet7.xml").async("string");
    sheet7Xml = updateSheetXml(sheet7Xml, b2TdMap, new Set());
    zip.file("xl/worksheets/sheet7.xml", sheet7Xml);
  }

  // 6. Sheet 8: 6. C1_VTVL (Cột trắng: A, B, C, D, F, G, H, I, J; Cột số: H)
  const c1Map = new Map();
  for (const r of state.C1 || []) {
    if (!r.rowNum) continue;
    c1Map.set(r.rowNum, {
      A: applyUnitCodePrefix(r.A, prefix),
      B: r.B,
      C: r.C,
      D: r.D,
      F: r.F,
      G: r.G,
      H: r.H ?? "",
      I: r.I ?? "",
      J: r.J,
    });
  }
  let sheet8Xml = await zip.file("xl/worksheets/sheet8.xml").async("string");
  sheet8Xml = updateSheetXml(sheet8Xml, c1Map, new Set(["H"]));
  zip.file("xl/worksheets/sheet8.xml", sheet8Xml);

  // 7. Sheet 9: 7. C2_NangLuc (Cột trắng: A, B, C, D, E, F, G)
  const c2Map = new Map();
  for (const r of state.C2 || []) {
    if (!r.rowNum) continue;
    c2Map.set(r.rowNum, {
      A: applyUnitCodePrefix(r.A, prefix),
      B: r.B,
      C: r.C,
      D: r.D,
      E: r.E,
      F: r.F,
      G: r.G,
    });
  }
  let sheet9Xml = await zip.file("xl/worksheets/sheet9.xml").async("string");
  sheet9Xml = updateSheetXml(sheet9Xml, c2Map, new Set());
  zip.file("xl/worksheets/sheet9.xml", sheet9Xml);

  // 8. Sheet 10: 8. C3_NhuCau (Cột trắng: A, B, H, I, J, K, L; Cột số: H, I, J)
  const c3Map = new Map();
  for (const r of state.C3 || []) {
    if (!r.rowNum) continue;
    c3Map.set(r.rowNum, {
      A: applyUnitCodePrefix(r.A, prefix),
      B: r.B,
      H: r.H ?? "",
      I: r.I ?? "",
      J: r.J ?? "",
      K: r.K,
      L: r.L,
    });
  }
  let sheet10Xml = await zip.file("xl/worksheets/sheet10.xml").async("string");
  sheet10Xml = updateSheetXml(sheet10Xml, c3Map, new Set(["H", "I", "J"]));
  zip.file("xl/worksheets/sheet10.xml", sheet10Xml);

  // 9. Sheet 11: 9. D1_NhanLuc (Gồm cả cột D vì file gốc 03_DVSN_XA.xlsx bị khuyết công thức ở cột D)
  if (state.D1 && state.D1.length > 0) {
    const d1Map = new Map();
    state.D1.forEach((r, idx) => {
      const rNum = r.rowNum || idx + 3;
      const dVal =
        r.D !== "" && r.D !== null && r.D !== undefined ? r.D : 1904;
      d1Map.set(rNum, {
        A: r.A,
        B: applyUnitCodePrefix(r.B, prefix),
        C: r.C ?? "",
        D: dVal,
        E: r.E ?? "",
        F: r.F ?? "",
        G: r.G ?? "",
        H: r.H ?? "",
        I: r.I ?? "",
        K: r.K ?? "",
      });
    });
    let sheet11Xml = await zip.file("xl/worksheets/sheet11.xml").async("string");
    sheet11Xml = updateSheetXml(
      sheet11Xml,
      d1Map,
      new Set(["D", "E", "F", "K"])
    );
    zip.file("xl/worksheets/sheet11.xml", sheet11Xml);
  }

  // 10. Sheet 12: 10. D2_PhuongAn (Gồm cả C, J, K, L vì file gốc 03_DVSN_XA.xlsx không có công thức sẵn ở C, J, K, L)
  if (state.D2 && state.D2.length > 0) {
    const d2Map = new Map();
    state.D2.forEach((r, idx) => {
      const rNum = r.rowNum || idx + 3;
      d2Map.set(rNum, {
        A: applyUnitCodePrefix(r.A, prefix),
        B: r.B ?? "",
        C: r.C ?? "",
        D: r.D ?? "",
        E: r.E ?? "",
        F: r.F ?? "",
        G: r.G ?? "",
        H: r.H ?? "",
        I: r.I ?? "",
        J: r.J ?? "",
        K: r.K ?? "",
        L: r.L ?? "",
      });
    });
    let sheet12Xml = await zip.file("xl/worksheets/sheet12.xml").async("string");
    sheet12Xml = updateSheetXml(
      sheet12Xml,
      d2Map,
      new Set(["B", "C", "D", "E", "G", "J", "K", "L"])
    );
    zip.file("xl/worksheets/sheet12.xml", sheet12Xml);
  }

  // Đảm bảo Excel tự động tính toán lại toàn bộ công thức (fullCalcOnLoad="1") khi mở file
  const wbFile = zip.file("xl/workbook.xml");
  if (wbFile) {
    let wbXml = await wbFile.async("string");
    if (wbXml.includes("<calcPr")) {
      wbXml = wbXml.replace(/<calcPr[^>]*\/>/, '<calcPr fullCalcOnLoad="1"/>');
    }
    zip.file("xl/workbook.xml", wbXml);
  }

  const outBlob = await zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  return outBlob;
}

/**
 * Đọc ngược một file Excel (.xlsx) do người dùng tải lên để kiểm tra lỗi và tiếp tục chỉnh sửa trên Web App
 */
export async function importFromExcelFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  const ssFile = zip.file("xl/sharedStrings.xml");
  const ssList = [];
  if (ssFile) {
    const ssXml = await ssFile.async("string");
    const siRegex = /<si>([\s\S]*?)<\/si>/g;
    let m;
    while ((m = siRegex.exec(ssXml)) !== null) {
      const tRegex = /<t[^>]*>([\s\S]*?)<\/t>/g;
      let tm;
      let s = "";
      while ((tm = tRegex.exec(m[1])) !== null) {
        s += decodeXml(tm[1]);
      }
      ssList.push(s);
    }
  }

  async function parseSheetRows(sheetPath, maxRowLimit = 450) {
    const f = zip.file(sheetPath);
    if (!f) return [];
    const xml = await f.async("string");
    const rows = [];
    const rowRegex = /<row\s+r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g;
    let rm;
    while ((rm = rowRegex.exec(xml)) !== null) {
      const rNum = parseInt(rm[1], 10);
      if (rNum < 3 || rNum > maxRowLimit) continue;
      const rowBody = rm[2];
      const cellRegex = /<c\s+r="([A-Z]+)\d+"([^/>]*)(?:\/>|>([\s\S]*?)<\/c>)/g;
      let cm;
      const rowObj = { rowNum: rNum };
      let hasData = false;
      while ((cm = cellRegex.exec(rowBody)) !== null) {
        const col = cm[1];
        const attrs = cm[2] || "";
        const inner = cm[3] || "";
        if (!inner) continue;
        const tMatch = /t="([^"]+)"/.exec(attrs);
        const t = tMatch ? tMatch[1] : "";
        const hasFormula = inner.includes("<f");
        let val = "";
        if (t === "s") {
          const vMatch = /<v>(\d+)<\/v>/.exec(inner);
          if (vMatch) val = ssList[parseInt(vMatch[1], 10)] || "";
        } else if (t === "inlineStr") {
          const tNodeMatch = /<t[^>]*>([\s\S]*?)<\/t>/.exec(inner);
          if (tNodeMatch) val = decodeXml(tNodeMatch[1]);
        } else {
          const vMatch = /<v>([\s\S]*?)<\/v>/.exec(inner);
          if (vMatch) {
            const raw = vMatch[1];
            const num = Number(raw);
            val = !Number.isNaN(num) && raw.trim() !== "" ? num : decodeXml(raw);
          }
        }
        if (val !== "" && !hasFormula) {
          rowObj[col] = val;
          hasData = true;
        }
      }
      if (hasData) rows.push(rowObj);
    }
    return rows;
  }

  return {
    A1: await parseSheetRows("xl/worksheets/sheet3.xml", 300),
    A2: await parseSheetRows("xl/worksheets/sheet4.xml", 400),
    B1: await parseSheetRows("xl/worksheets/sheet5.xml", 400),
    B2_CT: await parseSheetRows("xl/worksheets/sheet6.xml", 400),
    C1: await parseSheetRows("xl/worksheets/sheet8.xml", 200),
    C2: await parseSheetRows("xl/worksheets/sheet9.xml", 200),
    C3: await parseSheetRows("xl/worksheets/sheet10.xml", 200),
    D1: await parseSheetRows("xl/worksheets/sheet11.xml", 300),
    D2: await parseSheetRows("xl/worksheets/sheet12.xml", 500),
  };
}


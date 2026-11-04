import fs from "fs";
import JSZip from "jszip";

async function main() {
  const buf = fs.readFileSync("03_DVSN_XA.xlsx");
  const zip = await JSZip.loadAsync(buf);

  // Load sharedStrings.xml
  const ssXml = await zip.file("xl/sharedStrings.xml").async("string");
  const ssList = [];
  const siRegex = /<si>([\s\S]*?)<\/si>/g;
  let m;
  while ((m = siRegex.exec(ssXml)) !== null) {
    const siContent = m[1];
    const tRegex = /<t[^>]*>([\s\S]*?)<\/t>/g;
    let tMatch;
    let str = "";
    while ((tMatch = tRegex.exec(siContent)) !== null) {
      str += decodeXml(tMatch[1]);
    }
    ssList.push(str);
  }
  console.log("Shared strings count:", ssList.length);

  function decodeXml(s) {
    return s
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");
  }

  async function parseSheet(sheetPath, maxRowLimit = 500, filterFn = null) {
    const xml = await zip.file(sheetPath).async("string");
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
        } else if (t === "str" || t === "e" || t === "b") {
          const vMatch = /<v>([\s\S]*?)<\/v>/.exec(inner);
          if (vMatch) val = decodeXml(vMatch[1]);
        } else {
          const vMatch = /<v>([\s\S]*?)<\/v>/.exec(inner);
          if (vMatch) {
            const raw = vMatch[1];
            const num = Number(raw);
            val = !Number.isNaN(num) && raw.trim() !== "" ? num : decodeXml(raw);
          }
        }
        if (val !== "" && (!hasFormula || col === "A" || col === "B" || col === "C" || col === "D")) {
          // Still store value even if formula if needed, but mark non-formula
        }
        if (val !== "") {
          rowObj[col] = val;
          if (!hasFormula) hasData = true;
        }
      }
      if (hasData) {
        if (!filterFn || filterFn(rowObj)) {
          rows.push(rowObj);
        }
      }
    }
    return rows;
  }

  const A1 = await parseSheet("xl/worksheets/sheet3.xml", 300);
  const A2 = await parseSheet("xl/worksheets/sheet4.xml", 400);
  const B1 = await parseSheet("xl/worksheets/sheet5.xml", 400);
  const B2_CT = await parseSheet("xl/worksheets/sheet6.xml", 400);
  const C1 = await parseSheet("xl/worksheets/sheet8.xml", 200);
  const C2 = await parseSheet("xl/worksheets/sheet9.xml", 200);
  const C3 = await parseSheet("xl/worksheets/sheet10.xml", 200);

  // Get all L codes from B1 + DVSN items from DM_SAN_PHAM (sheet13.xml)
  const b1SpCodes = new Set(B1.map((r) => r.L).filter(Boolean));
  const DM_SAN_PHAM = await parseSheet("xl/worksheets/sheet13.xml", 15000, (r) => {
    return b1SpCodes.has(r.A) || (r.C && String(r.C).includes("ĐƠN VỊ SỰ NGHIỆP CẤP XÃ"));
  });

  console.log({
    A1: A1.length,
    A2: A2.length,
    B1: B1.length,
    B2_CT: B2_CT.length,
    C1: C1.length,
    C2: C2.length,
    C3: C3.length,
    DM_SAN_PHAM: DM_SAN_PHAM.length,
  });

  const data = {
    A1,
    A2,
    B1,
    B2_CT,
    C1,
    C2,
    C3,
    DM_SAN_PHAM,
  };

  fs.mkdirSync("src/data", { recursive: true });
  fs.writeFileSync("src/data/dvsnData.json", JSON.stringify(data, null, 2), "utf8");
  console.log("Saved src/data/dvsnData.json successfully!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

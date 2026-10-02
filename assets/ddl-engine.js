(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.DdlLab = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const LIMITATIONS = "Pemeriksa ini hanya membaca subset CREATE TABLE dan constraint untuk stimulus. Ia bukan server MySQL, tidak mengeksekusi DDL, tidak memeriksa data, indeks fisik, hak akses, atau seluruh tata bahasa MySQL. Verifikasi akhir wajib pada MySQL Community Server 8.4 LTS.";
  const TYPES = new Set(["TINYINT", "SMALLINT", "MEDIUMINT", "INT", "INTEGER", "BIGINT", "DECIMAL", "NUMERIC", "FLOAT", "DOUBLE", "BIT", "BOOLEAN", "BOOL", "CHAR", "VARCHAR", "BINARY", "VARBINARY", "TINYTEXT", "TEXT", "MEDIUMTEXT", "LONGTEXT", "TINYBLOB", "BLOB", "MEDIUMBLOB", "LONGBLOB", "DATE", "TIME", "DATETIME", "TIMESTAMP", "YEAR", "JSON", "ENUM", "SET"]);

  function splitTopLevel(value) {
    const parts = []; let start = 0, depth = 0, quote = "";
    for (let i = 0; i < value.length; i++) {
      const char = value[i];
      if (quote) { if (char === quote && value[i - 1] !== "\\") quote = ""; continue; }
      if (char === "'" || char === '"' || char === "`") { quote = char; continue; }
      if (char === "(") depth++;
      else if (char === ")") depth--;
      else if (char === "," && depth === 0) { parts.push(value.slice(start, i).trim()); start = i + 1; }
    }
    parts.push(value.slice(start).trim());
    return parts;
  }
  function namesInParens(text) {
    const match = text.match(/\(([^)]+)\)/);
    return match ? match[1].split(",").map(v => v.trim().replace(/`/g, "").toLowerCase()) : [];
  }
  function analyze(source) {
    const sql = String(source || "").trim();
    const result = { valid: false, table: "", columns: [], features: [], engine: "", charset: "", errors: [], warnings: [] };
    if (!/^CREATE\s+TABLE\b/i.test(sql)) { result.errors.push("Pemeriksa hanya CREATE TABLE; masukkan satu pernyataan pembuatan tabel."); return result; }
    const head = sql.match(/^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?([A-Za-z_][\w$]*)`?\s*\(/i);
    if (!head) { result.errors.push("Nama tabel atau kurung buka tidak valid."); return result; }
    result.table = head[1];
    const open = sql.indexOf("(", head.index); let depth = 0, quote = "", close = -1;
    for (let i = open; i < sql.length; i++) {
      const char = sql[i];
      if (quote) { if (char === quote && sql[i - 1] !== "\\") quote = ""; continue; }
      if (char === "'" || char === '"' || char === "`") { quote = char; continue; }
      if (char === "(") depth++;
      if (char === ")" && --depth === 0) { close = i; break; }
    }
    if (close < 0) { result.errors.push("Kurung tutup definisi tabel tidak ditemukan."); return result; }
    const body = sql.slice(open + 1, close);
    if (/[,]\s*$/.test(body)) result.errors.push("Ada koma terakhir tanpa definisi kolom atau constraint.");
    const items = splitTopLevel(body); const constraints = []; const seenColumns = new Set();
    for (const item of items) {
      if (!item) continue;
      if (/^(?:CONSTRAINT\s+`?[\w$]+`?\s+)?(?:PRIMARY\s+KEY|FOREIGN\s+KEY|UNIQUE(?:\s+KEY)?|CHECK)\b/i.test(item)) { constraints.push(item); continue; }
      const column = item.match(/^`?([A-Za-z_][\w$]*)`?\s+([A-Za-z]+)/);
      if (!column) { result.errors.push(`Definisi kolom tidak dikenali: ${item}`); continue; }
      const columnKey = column[1].toLowerCase();
      if (seenColumns.has(columnKey)) result.errors.push(`Nama kolom duplikat: ${column[1]}.`);
      seenColumns.add(columnKey);
      const type = column[2].toUpperCase();
      if (!TYPES.has(type)) result.errors.push(`Tipe data ${type} tidak didukung MySQL 8.4 pada pemeriksa ini.`);
      result.columns.push({ name: column[1], type, definition: item });
      for (const feature of ["PRIMARY KEY", "UNIQUE", "NOT NULL", "CHECK", "REFERENCES"]) if (new RegExp(feature.replace(" ", "\\s+"), "i").test(item)) result.features.push(feature === "REFERENCES" ? "FOREIGN KEY" : feature);
    }
    const columnNames = result.columns.map(c => c.name.toLowerCase());
    for (const item of constraints) {
      let feature = "CHECK";
      if (/PRIMARY\s+KEY/i.test(item)) feature = "PRIMARY KEY";
      else if (/FOREIGN\s+KEY/i.test(item)) feature = "FOREIGN KEY";
      else if (/UNIQUE/i.test(item)) feature = "UNIQUE";
      result.features.push(feature);
      if (feature !== "CHECK") for (const name of namesInParens(item)) if (!columnNames.includes(name)) result.errors.push(`Constraint merujuk kolom hilang: ${name}.`);
      if (feature === "FOREIGN KEY" && !/REFERENCES\s+`?[A-Za-z_][\w$]*`?\s*\([^)]+\)/i.test(item)) result.errors.push("FOREIGN KEY harus memiliki REFERENCES tabel(kolom).");
    }
    if (!result.columns.length) result.errors.push("Tabel harus memiliki sedikitnya satu kolom.");
    result.features = [...new Set(result.features)];
    const tail = sql.slice(close + 1);
    if (/;\s*\S/.test(tail)) result.errors.push("Masukkan tepat satu pernyataan CREATE TABLE; pernyataan tambahan ditolak.");
    result.engine = (tail.match(/ENGINE\s*=\s*([A-Za-z0-9_]+)/i) || [])[1] || "";
    result.charset = (tail.match(/(?:DEFAULT\s+)?CHARSET\s*=\s*([A-Za-z0-9_]+)/i) || tail.match(/CHARACTER\s+SET\s+([A-Za-z0-9_]+)/i) || [])[1] || "";
    if (!result.engine) result.warnings.push("ENGINE tidak ditulis eksplisit.");
    if (!result.charset) result.warnings.push("CHARSET tidak ditulis eksplisit.");
    result.valid = result.errors.length === 0;
    return result;
  }
  function runChecks(sql, checks) {
    const analysis = analyze(sql);
    const results = (checks || []).map(check => {
      let pass = false;
      if (check.type === "valid") pass = analysis.valid;
      if (check.type === "feature") pass = analysis.features.includes(check.value);
      if (check.type === "column") pass = analysis.columns.some(c => c.name.toLowerCase() === String(check.value).toLowerCase());
      if (check.type === "type") pass = analysis.columns.some(c => c.name.toLowerCase() === String(check.column).toLowerCase() && c.type === String(check.value).toUpperCase());
      if (check.type === "engine") pass = analysis.engine.toLowerCase() === String(check.value).toLowerCase();
      if (check.type === "charset") pass = analysis.charset.toLowerCase() === String(check.value).toLowerCase();
      if (check.type === "contains") pass = new RegExp(check.value, "i").test(sql);
      return { pass, label: check.label || `${check.type}: ${check.value || "sintaks valid"}` };
    });
    return { passed: analysis.valid && results.every(r => r.pass), analysis, results };
  }
  return { analyze, runChecks, LIMITATIONS };
});

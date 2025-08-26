const fs = require('fs');
const Papa = require('papaparse');

const csvFile = process.argv[2];
let table = ""


if (csvFile === undefined) {
  // No CSV file provided, output default table
  table = `| Pos.  | Beschreibung | Stunden | Betrag |
|:---|:---|:---:|---:|
| 1  |  Tätigkeit |  0  | 0.00 Fr. |`;
  console.log(table);
  process.exit(0);
}

const csvData = fs.readFileSync(csvFile, 'utf8');

// Parse CSV, skip header
const result = Papa.parse(csvData, { header: true });

table = '| Pos. | Beschreibung | Minuten | Betrag |\n';
table += '|:---|:---|:---:|---:|\n';

result.data.forEach((row, idx) => {
  if (row.Beschreibung) { // skip possible empty lines
    table += `| ${idx + 1} | ${row.Beschreibung} | ${row.Minuten} | ${row.Betrag} Fr. |\n`;
  }
});

console.log(table);
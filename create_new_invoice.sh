#!/bin/bash

# Path to your data file
DATA_FILE=$1
CSV_FILE=$2

# Function to extract section by name
extract_section() {
  local section="$1"
  awk -v sec="[$section]" '
    $0 == sec {flag=1; next}
    /^\[.*\]/ {flag=0}
    flag && NF
  ' "$DATA_FILE"
}

# Read sections into variables
client=$(extract_section "client name")
sender=$(extract_section "sender")
receiver=$(extract_section "receiver")
greeting=$(extract_section "greeting")
sender_name=$(extract_section "sender name")
invoice_amount=$(extract_section "invoice amount")
invoice_number=$(extract_section "invoice number")
date=$(date +"%d.%m.%Y")
target_directory=$(extract_section "target directory")

table=$(node parse_csv.js $CSV_FILE)

markdown=$(cat <<EOF
---
export_on_save:
    puppeteer: true # export PDF on save
---

<div class="crossnote markdown-preview  ">

<div style="padding: 0px;">

<div style="overflow: hidden;">

<div style="float: left;">

$sender

</div>

<div style="text-align: right; float: right;">

$receiver

</div> 

</div>

<br>

$date

$greeting

Für die geleisteten Dienstleistungen berechne ich Ihnen wie folgt:

### Rechnung Nr. $invoice_number

$table
| | **Rechnungsbetrag (inkl. MwSt)** | | **CHF $invoice_amount** |

<br>


Vielen Dank für Ihren Auftrag. 
Ich bitte um Überweisung des Rechnungsbetrags innerhalb von 30 Tagen. 

Freundliche Grüsse

$sender_name

</div>
EOF
)

echo writing markdown file
echo "$markdown" > "$client-$invoice_number.md"

echo requesting qr invoice
node --env-file .env qr_rechnung.js $DATA_FILE

echo converting md to pdf
md-to-pdf --stylesheet styles.css $client-$invoice_number.md

echo merging pdf files
./merge_pdf.sh $DATA_FILE

if [ -n "$target_directory" ]; then
    echo copying pdf to $target_directory
    cp "${client}_Rechnung_${invoice_number}.pdf" "$target_directory"
fi

mv $client-$invoice_number.md mrmd_$client-$invoice_number.md 

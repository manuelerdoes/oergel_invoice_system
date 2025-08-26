#!/bin/bash

# Path to your data file
DATA_FILE=$1

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

file_one="${client}-${invoice_number}.pdf"
file_two="${client}_invoice_${invoice_number}.pdf"

cpdf "$file_one" "$file_two" -o "${client}_Rechnung_${invoice_number}.pdf"

open "${client}_Rechnung_${invoice_number}.pdf"
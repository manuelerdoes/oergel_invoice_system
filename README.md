# Oergel Invoice System

This is my personal invoice system. For each client / debitor I create one text file with all the necessary information. A shell script then generates a markdown file and a PDF invoice. The Swiss QR invoice is generated using the API from [livingtech.ch](https://qr.livingtech.ch/).

The list of services that are included in the invoice can be read from a CSV file.


## Prerequisites

- [ ] Node.js (See website for instructions)
- [ ] Papaparse (npm install papaparse)
- [ ] md-to-pdf (npm i -g md-to-pdf)
- [ ] cpdf (brew install cpdf)

Uses API from livingtech.ch to generate QR Invoices.
Get a free API key from https://qr.livingtech.ch/

create a .env file and set your API key there as such:

>LIVINGTECH_API_KEY=<your api key>


## How to use Oergel Invoice System

1. Copy data_example.txt and change it according to your needs
2. If there is a CSV file with stuff you have done, copy it into the folder. Look at the existing example.
3. Run ./create_new_invoice.sh data_example.txt example.csv
4. Now you already have a finished PDF invoice. If you want to change the contents of the invoice, change it in the generated .md file. 
5. create a pdf with: md-to-pdf --stylesheet styles.css <invoice.md>
6. merge the pdfs with: ./merge_pdf.sh data_example.txt
7. if you want you can cleanup the directory with: ./cleanup.sh. use -c to also cleanup the CSV files


## Example csv file

Beschreibung,Minuten,Betrag<br>
Testverrechnung,0.5,1

The first line is important and needs to be exactly these words.


## Result

The finished PDF will be in the current directory and there will be a copy in the specified directory (data file).
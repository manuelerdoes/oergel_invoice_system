const fs = require('fs');
const DATA_FILE = process.argv[2];
let fileName = 'qr_invoice.pdf';


function extractSectionValue(text, sectionName) {
    // Create a regex pattern to match the section header and capture the value below
    const pattern = new RegExp(`\\[${sectionName}\\]\\s*\\n([^\\[]+)`, 'i');
    const match = text.match(pattern);
    
    if (match && match[1]) {
        // Trim whitespace and return the value
        return match[1].trim();
    }
    
    return null; // Return null if section not found
}

function extractFromFile(filePath, sectionName) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return extractSectionValue(fileContent, sectionName);
    } catch (error) {
        console.error('Error reading file:', error);
        return null;
    }
}

// Extract sections
let client_name = extractFromFile(DATA_FILE, "client name");
let invoice_creditor_iban = extractFromFile(DATA_FILE, "invoice creditor iban");
let invoice_creditor_name = extractFromFile(DATA_FILE, "invoice creditor name");
let invoice_creditor_address_1 = extractFromFile(DATA_FILE, "invoice creditor address 1");
let invoice_creditor_address_2 = extractFromFile(DATA_FILE, "invoice creditor address 2");
let invoice_debitor_name = extractFromFile(DATA_FILE, "invoice debitor name");
let invoice_debitor_address_1 = extractFromFile(DATA_FILE, "invoice debitor address 1");
let invoice_debitor_address_2 = extractFromFile(DATA_FILE, "invoice debitor address 2");
let invoice_amount = extractFromFile(DATA_FILE, "invoice amount");
let invoice_number = extractFromFile(DATA_FILE, "invoice number");

fileName = client_name + "_invoice_" + invoice_number + ".pdf";


// Configuration
let myConfiguration  = { 
    "Account" : invoice_creditor_iban,
    "CreditorName" : invoice_creditor_name,
    "CreditorAddress1" : invoice_creditor_address_1,
    "CreditorAddress2" : invoice_creditor_address_2,
    "CreditorCountryCode" : "CH",
    "DebtorName" : invoice_debitor_name,
    "DebtorAddress1" : invoice_debitor_address_1,
    "DebtorAddress2" : invoice_debitor_address_2,
    "DebtorCountryCode" : "CH",
    "Amount" : invoice_amount,
    "ReferenceNr" : invoice_number,
    "UnstructuredMessage" : invoice_number,
    "Currency" : "CHF",
    "QrOnly" : "false",
    "Format" : "PDF",
    "Language" : "DE"
}

// Call function to create invoice
let myFile = generateQrInvoice(myConfiguration);

// Work with binary data
if(myFile != null) {
    // ...
}

async function generateQrInvoice(myRequestConfiguration) {
    // Main configuration
    let myEndpointUrl = "https://v2.qrbillservice.livingtech.ch";
    let myEndpointPath = "/api/qrinvoice/create/";
    let myApiKey = process.env.LIVINGTECH_API_KEY;

    // GET parameters
    let myGetParams = new URLSearchParams(myRequestConfiguration);

    try {
        // Perform request
        const myResponse = await fetch(myEndpointUrl + myEndpointPath + "?" + myGetParams, {
            method: "GET", 
            mode: "cors", 
            cache: "no-cache", 
            headers: {
                "APIKEY": myApiKey, 
                "Accept": "application/json"
            }
        });

        // Check for error
        if(myResponse.headers.get("content-type") && myResponse.headers.get("content-type").indexOf("application/json") === -1) {
            const myPlainText = await myResponse.text();
            
            if(myPlainText && myPlainText.trim() != "") {
                throw new Error(myPlainText);
            } else {
                throw new Error("unknown error getting data from API")
            }
        }

        // JSON body
        const myJsonObject  = await myResponse.json();

        // Check for status != 200
        if(!myResponse.ok) {
            throw new Error("status code " . myResponse.status);
        }

        // Check if error
        if(myJsonObject.isSuccess == true) {
            if(myJsonObject.hasOwnProperty("base64Content") && myJsonObject.base64Content.trim() != "") {
                // E.g. send file to client
                // const myBlob = base64ToBlob(myJsonObject.base64Content, (myRequestConfiguration.Format.toLowerCase() == "pdf" ? "application/pdf" : "image/png"))
                // const myBlobUrl = URL.createObjectURL(myBlob);
                // window.open(myBlobUrl);
                fs.writeFileSync(fileName, Buffer.from(myJsonObject.base64Content, 'base64'));
                console.log("Saved file as " + fileName);

                // Return data
                return atob(myJsonObject.base64Content);
            } else {
                throw new Error("no data provided");
            }
        } else {
            throw new Error(myJsonObject.message);
        }
    } catch(myError) {
        // Handle exception
        console.warn("Error: " + myError.message);
        return null;
    }
}

// Helper function for Base64 to Blob
function base64ToBlob(b64Data, contentType = "", sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
        
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
}
<script>
	import jsPDF from "jspdf";
	import autoTable from "jspdf-autotable";
	import { submitButton } from "./global.svelte";
	import { Download } from "@lucide/svelte";

   import {page} from "$app/state";

   let pageName = page.url.pathname; 

const {fileName = pageName, tableId, buttonName="Download PDF" } = $props();
  
function generatedPdf() {
  const doc = new jsPDF({orientation: 'landscape', unit: 'pt', format: 'a4'});

  autoTable(doc, {
    html: tableId, 
    styles: {
      font: 'helvetica',         
      fontSize: 10,              
      textColor: [40, 40, 40],   
      halign: 'left',            
      valign: 'middle',          
      cellPadding: 4,            
    },
    headStyles: {
      fillColor: [0, 0, 0],  
      textColor: 255,              
      fontStyle: 'bold',           
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],  // Light gray for alternating rows
    },
    tableLineColor: [200, 200, 200], // Table border color
    tableLineWidth: 0.1,            // Table border width
    margin: { top: 20 },            // Top margin of the table
  });

  doc.save(fileName);
}
</script>


    <button class="{submitButton} Capitalize flex flex-row gap-2 justify-center items-center !p-4 z-10" onclick={generatedPdf}> <Download /> {buttonName}</button>

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  generatePDF(htmlContent: string, filename: string) {
    // Créer une nouvelle fenêtre
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>eLibrary Report</title>
          <style>
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
            body { font-family: Arial, sans-serif; margin: 20px; }
          </style>
        </head>
        <body>
          ${htmlContent}
          <div class="no-print" style="position: fixed; top: 10px; right: 10px;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
              📄 Télécharger PDF
            </button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
              ✖ Fermer
            </button>
          </div>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Auto-focus pour permettre Ctrl+P
      printWindow.focus();
    }
  }
}
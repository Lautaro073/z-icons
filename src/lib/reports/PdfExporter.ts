import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ReportExporter } from "./ReportExporter";

/**
 * Concrete Strategy: Exportador PDF visual estilizado.
 */
export class PdfExporter<T> extends ReportExporter<T> {
  /**
   * Helper privado para renderizar un string SVG a un PNG DataURL vía Canvas (Asíncrono).
   */
  private convertSvgToPng(svgString: string, size: number = 64): Promise<string | null> {
    return new Promise((resolve) => {
      try {
        // Sanitización mínima de namespaces si faltaran (algunos SVGs los omiten)
        let finalSvg = svgString;
        if (!finalSvg.includes('xmlns="http://www.w3.org/2000/svg"')) {
          finalSvg = finalSvg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }

        // Crear URL blob del SVG
        const svgBlob = new Blob([finalSvg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        const img = new Image();
        img.crossOrigin = "anonymous";
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          // Escalamos para mantener buena calidad en el PDF (2x retina ratio)
          canvas.width = size * 2;
          canvas.height = size * 2;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            URL.revokeObjectURL(url);
            return resolve(null);
          }
          
          // Dibujar fondo transparente implícito, luego el icono
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const dataUrl = canvas.toDataURL('image/png');
          URL.revokeObjectURL(url);
          resolve(dataUrl);
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(null);
        };

        img.src = url;
      } catch (e) {
        console.warn("Fallo convirtiendo SVG a Imagen", e);
        resolve(null);
      }
    });
  }

  /**
   * Crea un documento PDF con soporte para imágenes SVG embebidas en celdas.
   */
  protected async generateFile(rows: string[][], headers: string[]): Promise<Blob> {
    // 1. Detección y pre-procesamiento de SVGs asíncronos
    // Guardaremos Map con key "rowIdx-colIdx" para saber dónde inyectar la imagen luego.
    const svgImageMap = new Map<string, string>();
    
    // Escaneamos las filas buscando tags SVG
    const svgConversionPromises: Promise<void>[] = [];

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      if (!row) continue;

      for (let c = 0; c < row.length; c++) {
        const cellContent = (row[c] || "").trim();
        
        // Detección heurística de contenido SVG
        if (cellContent.startsWith('<svg') && cellContent.includes('</svg>')) {
          // Convertimos y guardamos el callback en la cola paralela
          const promise = this.convertSvgToPng(cellContent).then((pngDataUrl) => {
            if (pngDataUrl) {
              svgImageMap.set(`${r}-${c}`, pngDataUrl);
            }
          });
          svgConversionPromises.push(promise);
          // Limpiamos el texto de la celda original para que no se imprima el código fuente crudo
          row[c] = ""; 
        }
      }
    }

    // Esperar a que TODAS las conversiones de SVGs terminen antes de seguir
    if (svgConversionPromises.length > 0) {
      await Promise.all(svgConversionPromises);
    }

    // 2. Generar Documento Base
    const isWide = headers.length > 6;
    const doc = new jsPDF({
      orientation: isWide ? "landscape" : "portrait",
      unit: "mm",
      format: "a4",
    });

    // --- HEADER VISUAL ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text(this.title, 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    const currentDate = new Date().toLocaleString();
    doc.text(`Generado el: ${currentDate}`, 14, 27);
    doc.text(`Total registros: ${rows.length}`, 14, 32);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 35, isWide ? 283 : 196, 35);

    // --- TABLA DE CONTENIDO ---
    autoTable(doc, {
      startY: 40,
      head: [headers],
      body: rows,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 3,
        valign: 'middle',
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      margin: { top: 40 },
      
      // El Hook Mágico: Se dispara cuando se dibuja la celda
      didDrawCell: (data) => {
        // Verificamos si esta coordenada de celda tiene una imagen SVG precargada
        if (data.section === 'body') {
          const key = `${data.row.index}-${data.column.index}`;
          const pngBase64 = svgImageMap.get(key);
          
          if (pngBase64) {
            // Calculamos tamaño del icono para que quepa centrado con padding
            const imgSize = Math.min(data.cell.height - 2, data.cell.width - 2, 8);
            const posX = data.cell.x + (data.cell.width - imgSize) / 2;
            const posY = data.cell.y + (data.cell.height - imgSize) / 2;
            
            doc.addImage(pngBase64, 'PNG', posX, posY, imgSize, imgSize);
          }
        }
      },
    });

    return doc.output('blob');
  }
}

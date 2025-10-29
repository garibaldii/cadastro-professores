import { HeaderHtml, professorContent, courseContent } from "./PdfHeaderLayout";

export const shareDataToPdfFile = async (
  data: Record<string, unknown>[],
  type: "professor" | "course",
  selectedColumns: string[]
) => {
  const header = await HeaderHtml();

  const htmlContent = `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          @page { size: A4 landscape; margin: 20px; }
          body { font-family: Verdana, sans-serif; margin: 0; padding: 0; }
          table { width: 100%; border-collapse: collapse; table-layout: fixed; word-wrap: break-word; }
          th, td { border: 1px solid #ccc; padding: 5px; text-align: center; font-size: 11px; }
          th { background-color: #e1e1e1; font-weight: bold; }
        </style>
      </head>
      <body>
        ${header}
        ${type === "professor" ? professorContent(data, selectedColumns) : ""}
        ${type === "course" ? courseContent(data, selectedColumns) : ""}
        <script>
          // Espera todas as imagens carregarem antes de printar
          const images = Array.from(document.images);
          if(images.length === 0){
            window.print();
          } else {
            let loaded = 0;
            images.forEach(img => {
              if(img.complete) loaded++;
              else img.onload = img.onerror = () => {
                loaded++;
                if(loaded === images.length) window.print();
              };
            });
            if(loaded === images.length) window.print();
          }
          window.onafterprint = () => window.close();
        </script>
      </body>
    </html>
  `;

  const newWindow = window.open("", "_blank");
  newWindow?.document.write(htmlContent);
  newWindow?.document.close();
};

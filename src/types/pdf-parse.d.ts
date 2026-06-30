declare module "pdf-parse" {
  interface PDFData {
    text: string;
    numpages: number;
    info: any;
    metadata: any;
    version: string;
  }
  function pdfParse(buffer: Buffer | Uint8Array): Promise<PDFData>;
  export default pdfParse;
}

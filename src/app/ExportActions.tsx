import React, { useState } from 'react';
import { Download, Share2, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ExportActions = ({ issuedTo, grandTotal }) => {
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [pdfInstance, setPdfInstance] = useState(null);

  const generatePDF = async () => {
    const invoice = document.getElementById('invoice-content');
    if (!invoice) return;

    try {
      const canvas = await html2canvas(invoice, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Store PDF instance for later use
      setPdfInstance(pdf);
      
      // Generate preview URL
      const pdfBlob = pdf.output('blob');
      const previewUrl = URL.createObjectURL(pdfBlob);
      setPdfPreviewUrl(previewUrl);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const downloadPDF = () => {
    if (pdfInstance) {
      pdfInstance.save(`Invoice-${issuedTo || 'Untitled'}.pdf`);
      setShowPreview(false);
      URL.revokeObjectURL(pdfPreviewUrl);
    }
  };

  const shareToWhatsApp = () => {
    const text = `Invoice details:\nIssued to: ${issuedTo}\nTotal Amount: RM${grandTotal}\n\nThank you for your business!`;
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t">
        <div className="max-w-3xl mx-auto flex gap-4 justify-end">
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          
          <button
            onClick={shareToWhatsApp}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share WhatsApp
          </button>
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>PDF Preview</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto">
            <iframe
              src={pdfPreviewUrl}
              className="w-full h-full min-h-[60vh]"
              title="PDF Preview"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Cancel
            </Button>
            <Button onClick={downloadPDF}>
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExportActions;
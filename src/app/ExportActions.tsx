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
      
      setPdfInstance(pdf);
      
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
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md p-4 shadow-lg border-t z-50">
        <div className="max-w-sm mx-auto grid grid-cols-2 gap-2">
          <button
            onClick={generatePDF}
            className="flex items-center justify-center gap-2 bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700 transition-colors text-sm"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>

          <button
            onClick={shareToWhatsApp}
            className="flex items-center justify-center gap-2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors text-sm truncate"
          >
            <Share2 className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Share via WhatsApp</span>
          </button>
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-sm h-[70vh] p-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Preview PDF</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto bg-gray-100 rounded-lg">
            <iframe
              src={pdfPreviewUrl}
              className="w-full h-full min-h-[45vh]"
              title="PDF Preview"
            />
          </div>
          
          <DialogFooter className="gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowPreview(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={downloadPDF}
              className="flex-1 bg-teal-600 hover:bg-teal-700"
            >
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Spacing for fixed buttons */}
      <div className="h-24" />
    </>
  );
};

export default ExportActions;
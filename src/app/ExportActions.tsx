import React, { useState } from 'react';
import { Download, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ExportActionsProps {
  issuedTo: string;
  grandTotal: number;
}

const ExportActions = ({ issuedTo, grandTotal }: ExportActionsProps) => {
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [pdfInstance, setPdfInstance] = useState<jsPDF | null>(null);
  const [zoomLevel, setZoomLevel] = useState(75);

  const generatePDF = async () => {
    const invoice = document.getElementById('invoice-content');
    if (!invoice) return;

    try {
      // Create a wrapper div for centering
      const wrapper = document.createElement('div');
      wrapper.style.width = '595px'; // A4 width in pixels
      wrapper.style.margin = '0 auto';
      wrapper.style.padding = '40px 0'; // Add padding for better spacing
      wrapper.style.backgroundColor = '#ffffff';

      const canvas = await html2canvas(invoice, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 595, // A4 width
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('invoice-content');
          if (clonedElement) {
            // Preserve the paper texture and fold effects
            clonedElement.style.margin = '0 auto';
            clonedElement.style.width = '100%';
            clonedElement.style.maxWidth = '500px'; // Slightly smaller than A4 for margins
            clonedElement.style.padding = '20px';
            clonedElement.style.position = 'relative';
            clonedElement.style.backgroundColor = '#ffffff';
            
            // Add paper texture
            clonedElement.style.backgroundImage = `
              linear-gradient(to right, rgba(0,0,0,0.02) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.02) 100%)
            `;
            
            // Add fold effects
            const foldEffect = document.createElement('div');
            foldEffect.style.position = 'absolute';
            foldEffect.style.top = '0';
            foldEffect.style.left = '0';
            foldEffect.style.width = '100%';
            foldEffect.style.height = '100%';
            foldEffect.style.pointerEvents = 'none';
            foldEffect.style.background = `
              linear-gradient(
                rgba(255,255,255,0),
                50%,
                rgba(0,0,0,0.1),
                51%,
                rgba(255,255,255,0)
              ),
              linear-gradient(
                to right,
                rgba(255,255,255,0),
                50%,
                rgba(0,0,0,0.1),
                51%,
                rgba(255,255,255,0)
              )
            `;
            foldEffect.style.zIndex = '3';
            
            clonedElement.appendChild(foldEffect);

            // Remove any box shadows for cleaner PDF
            clonedElement.style.boxShadow = 'none';
            clonedElement.style.borderRadius = '0';
          }
        }
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
        compress: true
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imageWidth = imgProps.width;
      const imageHeight = imgProps.height;

      // Calculate scale to fit height on one page (leaving margins)
      const verticalMargin = 40; // Points
      const availableHeight = pdfHeight - (verticalMargin * 2);
      const heightRatio = availableHeight / imageHeight;

      // Calculate width based on height ratio (maintain aspect ratio)
      const scaledWidth = imageWidth * heightRatio;
      const horizontalMargin = (pdfWidth - scaledWidth) / 2;

      pdf.addImage(
        imgData,
        'PNG',
        horizontalMargin,
        verticalMargin,
        scaledWidth,
        availableHeight,
        undefined,
        'FAST'
      );
      
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
      const date = new Date().toISOString().slice(2, 8);
      const cleanName = issuedTo?.replace(/\s+/g, '') || 'Untitled';
      pdfInstance.save(`Invoice${cleanName}_${date}.pdf`);
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
        <DialogContent className="max-w-sm h-[90vh] sm:h-[70vh] p-4 bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Preview PDF</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col gap-2 h-full">
            <div className="flex-1 overflow-auto bg-gray-100 rounded-lg">
              <iframe
                src={pdfPreviewUrl}
                className="w-full h-full min-h-[60vh] sm:min-h-[45vh]"
                title="PDF Preview"
                style={{ zoom: "75%" }}
              />
            </div>
          </div>
          
          <DialogFooter className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowPreview(false)}
              className="w-full"
            >
              Cancel
            </Button>
            <Button 
              onClick={downloadPDF}
              className="w-full bg-teal-600 hover:bg-teal-700"
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
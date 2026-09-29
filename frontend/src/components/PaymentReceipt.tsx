import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { UserProfile } from '../types';
import { CheckCircle2, Download, Printer, RefreshCw, Building2, ShieldCheck, FileText } from 'lucide-react';

interface PaymentReceiptProps {
  receiptNumber: string;
  user: UserProfile | null;
  planName: string;
  paymentMethod: string;
  amount: number;
  transactionId?: string;
  utrNumber?: string;
  paymentDate: string;
  billingAddress?: string;
  status?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  onGenerateNew: () => void;
  onClose?: () => void;
}

export const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  receiptNumber,
  user,
  planName,
  paymentMethod,
  amount,
  transactionId,
  utrNumber,
  paymentDate,
  billingAddress,
  status = 'pending',
  rejectionReason,
  onGenerateNew,
  onClose
}) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const oklchToRgbStr = (oklchStr: string): string => {
    try {
      const match = oklchStr.match(/oklch\(\s*([\d.%]+)\s+([\d.%]+)\s+([\d.%]+)(?:\s*\/\s*([\d.%]+))?\s*\)/i);
      if (!match) return 'rgb(13, 82, 48)';

      let l = parseFloat(match[1]);
      if (match[1].endsWith('%')) l = l / 100;

      let c = parseFloat(match[2]);
      if (match[2].endsWith('%')) c = c / 100;

      let h = parseFloat(match[3]);

      let a = 1;
      if (match[4]) {
        a = parseFloat(match[4]);
        if (match[4].endsWith('%')) a = a / 100;
      }

      const hRad = (h * Math.PI) / 180;
      const aLab = c * Math.cos(hRad);
      const bLab = c * Math.sin(hRad);

      const l_ = l + 0.3963377774 * aLab + 0.2158037573 * bLab;
      const m_ = l - 0.1055613458 * aLab - 0.0638541728 * bLab;
      const s_ = l - 0.0894841775 * aLab - 1.2914855480 * bLab;

      const l3 = l_ * l_ * l_;
      const m3 = m_ * m_ * m_;
      const s3 = s_ * s_ * s_;

      const rLin = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
      const gLin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
      const bLin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

      const gamma = (val: number) => {
        val = Math.max(0, Math.min(1, val));
        return val <= 0.0031308 ? 12.92 * val : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
      };

      const r = Math.round(gamma(rLin) * 255);
      const g = Math.round(gamma(gLin) * 255);
      const b = Math.round(gamma(bLin) * 255);

      if (a < 1) {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
      }
      return `rgb(${r}, ${g}, ${b})`;
    } catch (err) {
      return 'rgb(13, 82, 48)';
    }
  };

  const oklabToRgbStr = (oklabStr: string): string => {
    try {
      const match = oklabStr.match(/oklab\(\s*([\d.%]+)\s+([-\d.%]+)\s+([-\d.%]+)(?:\s*\/\s*([\d.%]+))?\s*\)/i);
      if (!match) return 'rgb(13, 82, 48)';
      let l = parseFloat(match[1]);
      if (match[1].endsWith('%')) l = l / 100;
      let aLab = parseFloat(match[2]);
      if (match[2].endsWith('%')) aLab = aLab / 100;
      let bLab = parseFloat(match[3]);
      if (match[3].endsWith('%')) bLab = bLab / 100;

      let alpha = 1;
      if (match[4]) {
        alpha = parseFloat(match[4]);
        if (match[4].endsWith('%')) alpha = alpha / 100;
      }

      const l_ = l + 0.3963377774 * aLab + 0.2158037573 * bLab;
      const m_ = l - 0.1055613458 * aLab - 0.0638541728 * bLab;
      const s_ = l - 0.0894841775 * aLab - 1.2914855480 * bLab;

      const l3 = l_ * l_ * l_;
      const m3 = m_ * m_ * m_;
      const s3 = s_ * s_ * s_;

      const rLin = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
      const gLin = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
      const bLin = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

      const gamma = (val: number) => {
        val = Math.max(0, Math.min(1, val));
        return val <= 0.0031308 ? 12.92 * val : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
      };

      const r = Math.round(gamma(rLin) * 255);
      const g = Math.round(gamma(gLin) * 255);
      const b = Math.round(gamma(bLin) * 255);

      return alpha < 1 ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`;
    } catch (err) {
      return 'rgb(13, 82, 48)';
    }
  };

  const replaceModernColors = (text: string): string => {
    if (!text) return text;
    let result = text;
    if (result.includes('oklch')) {
      result = result.replace(/oklch\([^)]+\)/gi, (m) => oklchToRgbStr(m));
    }
    if (result.includes('oklab')) {
      result = result.replace(/oklab\([^)]+\)/gi, (m) => oklabToRgbStr(m));
    }
    if (result.includes('color-mix')) {
      result = result.replace(/color-mix\([^)]+\)/gi, 'rgb(13, 82, 48)');
    }
    if (result.includes('light-dark')) {
      result = result.replace(/light-dark\([^)]+\)/gi, 'rgb(13, 82, 48)');
    }
    if (result.includes('color(')) {
      result = result.replace(/color\([^)]+\)/gi, 'rgb(13, 82, 48)');
    }
    if (result.includes('lab(')) {
      result = result.replace(/lab\([^)]+\)/gi, 'rgb(13, 82, 48)');
    }
    if (result.includes('lch(')) {
      result = result.replace(/lch\([^)]+\)/gi, 'rgb(13, 82, 48)');
    }
    if (result.includes('hwb(')) {
      result = result.replace(/hwb\([^)]+\)/gi, 'rgb(13, 82, 48)');
    }
    return result;
  };

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    setIsGeneratingPDF(true);

    try {
      // Pre-load images inside receipt container to ensure canvas captures them
      const imgElements = receiptRef.current.querySelectorAll('img');
      await Promise.all(
        Array.from(imgElements).map((el) => {
          const img = el as HTMLImageElement;
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // 1. Sanitize all <style> tags in cloned document
          const styleTags = clonedDoc.querySelectorAll('style');
          styleTags.forEach((style) => {
            if (style.textContent) {
              style.textContent = replaceModernColors(style.textContent);
            }
          });

          // 2. Sanitize all inline styles and element style attributes
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            const styleAttr = htmlEl.getAttribute('style');
            if (styleAttr) {
              htmlEl.setAttribute('style', replaceModernColors(styleAttr));
            }
            if (htmlEl.style && htmlEl.style.cssText) {
              htmlEl.style.cssText = replaceModernColors(htmlEl.style.cssText);
            }
          });
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`TBAAK_Receipt_${receiptNumber}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF receipt:', err);
      alert('Could not download PDF directly. You can use the "Print Receipt" button to print or save as PDF.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Banner Notice */}
      <div className={`border-2 p-4 font-sans rounded-none print:hidden shadow-sm ${
        status === 'rejected'
          ? 'bg-red-50 border-red-600'
          : status === 'approved'
            ? 'bg-emerald-50 border-emerald-700'
            : 'bg-[#F0F7F4] border-[#0D5230]'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`h-11 w-11 text-white flex items-center justify-center font-bold text-lg rounded-none shrink-0 shadow-sm ${
              status === 'rejected' ? 'bg-red-700' : status === 'approved' ? 'bg-emerald-800' : 'bg-[#0D5230]'
            }`}>
              <CheckCircle2 className={`h-7 w-7 ${status === 'rejected' ? 'text-red-200' : 'text-emerald-300'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`font-serif font-extrabold text-base sm:text-lg uppercase tracking-tight ${
                  status === 'rejected' ? 'text-red-900' : status === 'approved' ? 'text-emerald-900' : 'text-[#0D5230]'
                }`}>
                  {status === 'rejected' ? 'Application Rejected by Admin' : status === 'approved' ? 'Payment Approved & Active' : 'Payment Submitted'}
                </h3>
                <span className={`text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 font-sans ${
                  status === 'rejected' ? 'bg-red-700' : status === 'approved' ? 'bg-emerald-700' : 'bg-amber-600'
                }`}>
                  {status === 'rejected' ? 'Rejected' : status === 'approved' ? 'Approved' : 'Waiting for Admin Approval'}
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium mt-0.5 leading-relaxed">
                {status === 'rejected'
                  ? `Your renewal payment submission was reviewed and rejected by the Administrator. Reason: ${rejectionReason || 'Invalid UTR/Transaction ID or payment proof could not be verified. You can resubmit with corrected details from the Renewal Portal.'}`
                  : status === 'approved'
                    ? 'Your payment details have been verified and approved by the Administrator. Your standing is fully active.'
                    : 'Your payment details have been submitted successfully. The administrator will verify your UTR/Transaction ID and approve your membership status shortly.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <span className={`px-3 py-1.5 text-white text-xs font-bold uppercase tracking-wider rounded-none font-mono flex items-center gap-1.5 ${
              status === 'rejected' ? 'bg-red-800' : status === 'approved' ? 'bg-emerald-800' : 'bg-[#0D5230]'
            }`}>
              {status === 'pending' && <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>}
              STATUS: {status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* RECEIPT BUTTONS ACTION BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 font-sans print:hidden bg-slate-100 p-3 border border-slate-300">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="bg-[#0D5230] hover:bg-[#0A4025] text-white font-bold py-2 px-4 text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
          >
            <Download className="h-4 w-4 text-amber-300" />
            <span>{isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="bg-white border border-slate-300 hover:border-slate-800 text-slate-800 font-bold py-2 px-4 text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <Printer className="h-4 w-4 text-slate-600" />
            <span>Print Receipt</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onGenerateNew}
          className="bg-slate-800 hover:bg-black text-white font-bold py-2 px-4 text-xs flex items-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Generate New Receipt</span>
        </button>
      </div>

      {/* Printable Receipt Card */}
      <div className="bg-slate-200 p-2 sm:p-6 print:p-0 print:bg-white print:border-none">
        <div
          ref={receiptRef}
          id="receipt-document"
          className="bg-white text-slate-900 border-2 border-[#0D5230] p-6 sm:p-10 shadow-lg relative font-sans print:shadow-none print:border-2 print:border-[#0D5230] print:m-0"
        >
          {/* Header Section */}
          <div className="border-b-2 border-[#0D5230] pb-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Logo & Org Name */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-white p-0.5 flex items-center justify-center border border-[#0D5230]/20 rounded-md shrink-0 overflow-hidden shadow-xs">
                  <img
                    src="https://mxuiikbyhwuzaljajbjo.supabase.co/storage/v1/object/public/logo/taki%20logo.jpeg"
                    alt="TBAAK Official Logo"
                    className="h-full w-full object-contain"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('taki-logo.jpeg')) {
                        target.src = '/taki-logo.jpeg';
                      }
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-extrabold uppercase text-[#0D5230] font-serif tracking-tight leading-snug">
                    TAKI BOYS ALUMNI ASSOCIATION KOLKATA
                  </h1>
                  <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wide mt-0.5 font-sans">
                    Taki House Govt. Sponsored High School Ex-Students Association
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    299B, A.P.C. Road, Sealdah, Kolkata - 700009 • ESTD. 1932
                  </p>
                </div>
              </div>

              {/* Title & Status Badge */}
              <div className="text-left sm:text-right shrink-0">
                <div className="inline-block bg-[#0D5230] text-white px-3 py-1 font-serif font-black text-xs uppercase tracking-widest">
                  PAYMENT RECEIPT
                </div>
                <div className="mt-2 flex items-center justify-start sm:justify-end gap-1.5 text-emerald-700 font-extrabold text-sm uppercase tracking-wider">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>STATUS: PAID</span>
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Top Metadata Bar */}
          <div className="bg-[#F0F7F4] border border-[#0D5230]/30 p-3 mb-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Receipt Number</span>
              <span className="font-mono font-bold text-[#0D5230] text-sm">{receiptNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Payment Date & Time</span>
              <span className="font-bold text-slate-800">{paymentDate}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Transaction ID / Ref</span>
              <span className="font-mono font-bold text-slate-800 break-all">{transactionId || 'TXN-PENDING-REF'}</span>
            </div>
          </div>

          {/* Member Details Table */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0D5230] mb-2 border-b border-[#0D5230]/20 pb-1 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-[#0D5230]" />
              <span>Alumnus / Payer Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 bg-slate-50 p-4 border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Full Name</span>
                <span className="font-bold text-slate-900 text-sm font-serif">{user?.name || 'Alumnus Member'}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Roll No. / Batch Year</span>
                <span className="font-bold text-slate-900">
                  {user?.rollNumber ? `Roll No: ${user.rollNumber} • ` : ''}Batch {user?.batchYear || 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Email Address</span>
                <span className="font-medium text-slate-800 font-mono text-[11px]">{user?.email || 'N/A'}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Phone Number</span>
                <span className="font-medium text-slate-800">{user?.phone || 'Not Provided'}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Billing Address</span>
                <span className="font-medium text-slate-800">{billingAddress || user?.location || 'Kolkata, West Bengal'}</span>
              </div>
            </div>
          </div>

          {/* Payment Particulars Table */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0D5230] mb-2 border-b border-[#0D5230]/20 pb-1 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-[#0D5230]" />
              <span>Payment Details & Breakdown</span>
            </h3>

            <table className="w-full border-collapse border border-slate-300 text-xs text-left">
              <thead>
                <tr className="bg-[#0D5230] text-white font-serif uppercase tracking-wider text-[10px]">
                  <th className="p-2.5 border border-[#0D5230]">Particulars</th>
                  <th className="p-2.5 border border-[#0D5230]">Payment Mode</th>
                  <th className="p-2.5 border border-[#0D5230]">Reference / UTR No.</th>
                  <th className="p-2.5 border border-[#0D5230] text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-2.5 border border-slate-200 font-bold text-slate-900">
                    {planName || 'TBAAK Alumni Membership Renewal'}
                  </td>
                  <td className="p-2.5 border border-slate-200 font-medium text-slate-700">
                    {paymentMethod}
                  </td>
                  <td className="p-2.5 border border-slate-200 font-mono text-slate-800">
                    {utrNumber || transactionId || 'N/A'}
                  </td>
                  <td className="p-2.5 border border-slate-200 font-bold text-slate-900 text-right text-sm">
                    ₹{amount.toLocaleString('en-IN')}
                  </td>
                </tr>

                {/* Subtotal & Total Rows */}
                <tr className="bg-slate-50 font-bold">
                  <td colSpan={3} className="p-2.5 border border-slate-200 text-right uppercase text-[10px] text-slate-600">
                    Grand Total Paid:
                  </td>
                  <td className="p-2.5 border border-slate-200 text-right text-base font-serif font-black text-[#0D5230]">
                    ₹{amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Verification Seal & Notes */}
          <div className="pt-4 border-t border-dashed border-slate-300 flex flex-col sm:flex-row justify-between items-end gap-6">
            <div className="text-[10px] text-slate-500 space-y-1 max-w-sm">
              <p className="font-bold text-[#0D5230] uppercase">Important Note:</p>
              <p>
                This receipt confirms your membership renewal submission to the Taki Boys' Alumni Association Kolkata.
                Please retain this receipt for your records and voting verification during executive committee assemblies.
              </p>
            </div>

            {/* Official Stamp Box */}
            <div className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-[#0D5230] bg-[#F0F7F4] text-[#0D5230] w-48 text-center shrink-0">
              <ShieldCheck className="h-5 w-5 mb-1 text-[#0D5230]" />
              <span className="text-[9px] font-extrabold uppercase tracking-widest block">TBAAK OFFICIAL SEAL</span>
              <span className="text-[8px] font-mono text-slate-600 block mt-0.5">Digitally Verified Document</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-600 font-sans">
            <p className="font-serif font-bold text-[#0D5230]">Thank you for your payment.</p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
              Taki Boys' Alumni Association Kolkata (TBAAK) • www.takiboysalumni.org
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt;

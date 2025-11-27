
import React, { useState, useRef } from 'react';
import { Calculator, HelpCircle, Building2, Ruler, Layers, ArrowDown, User, Phone, AlertCircle, HardHat, Mail } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { InputState, CalculationResult } from './types';
import { SERVICE_OPTIONS, FOUNDATION_OPTIONS, ROOF_OPTIONS, BASEMENT_OPTIONS, GOOGLE_SHEETS_API_URL } from './constants';
import { calculateEstimate } from './utils/calculator';
import { ResultSection } from './components/ResultSection';
import { PrintModal } from './components/PrintModal';
import { HouseModel } from './components/HouseModel';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<InputState>({
    servicePrice: SERVICE_OPTIONS[0].value,
    floorArea: 80,
    floors: 2,
    foundationCoeff: FOUNDATION_OPTIONS[0].value,
    roofCoeff: ROOF_OPTIONS[0].value,
    basementCoeff: BASEMENT_OPTIONS[0].value,
    hasContingency: true,
    hasTum: false,
    customerName: '',
    email: '',
    zaloNumber: '',
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [phoneError, setPhoneError] = useState<string>('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isResultLocked, setIsResultLocked] = useState(false); // New lock state
  
  const resultRef = useRef<HTMLDivElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const validatePhone = (phone: string) => {
    // VN Phone regex: Starts with 03, 05, 07, 08, 09 and has exactly 10 digits total
    const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Only allow numbers
    if (!/^\d*$/.test(val)) return;

    let error = '';
    if (val.length > 10) {
      error = 'Số điện thoại không đúng (quá 10 số)';
    }

    setPhoneError(error);
    setInputs({ ...inputs, zaloNumber: val });
    
    // If user changes phone after calculating, reset
    if (result) {
        setResult(null); 
    }
  };

  const handleCalculate = () => {
    // 1. Check if phone is empty
    if (!inputs.zaloNumber) {
        setPhoneError('Vui lòng nhập số điện thoại để xem báo giá.');
        phoneInputRef.current?.focus();
        return;
    }

    // 2. Check length and format
    if (inputs.zaloNumber.length !== 10 || !validatePhone(inputs.zaloNumber)) {
        setPhoneError('Số điện thoại không đúng định dạng (phải có 10 số hợp lệ).');
        phoneInputRef.current?.focus();
        return;
    }

    // Clear error if valid
    setPhoneError('');

    const calculated = calculateEstimate(inputs);
    setResult(calculated);
    setIsResultLocked(true); // Lock the result initially
    
    // Smooth scroll to result
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Function to send data to Google Sheets
  const saveToGoogleSheet = async (name: string, email: string, phone: string) => {
    if (!GOOGLE_SHEETS_API_URL) return;

    try {
      const payload = JSON.stringify({ 
        timestamp: new Date().toLocaleString('vi-VN'),
        name: name || "Khách hàng", 
        email: email || "",
        phone: phone 
      });

      await fetch(GOOGLE_SHEETS_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', 
        },
        body: payload,
      });
    } catch (error) {
      console.error("Error saving to Google Sheet:", error);
    }
  };

  const generateAndDownloadPDF = async () => {
    try {
        const element = document.getElementById('pdf-content');
        if (!element) throw new Error("Could not find content to print");

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            onclone: (clonedDoc) => {
                const pdfHeader = clonedDoc.querySelector('.pdf-header');
                if (pdfHeader) {
                    (pdfHeader as HTMLElement).style.display = 'block';
                    (pdfHeader as HTMLElement).classList.remove('hidden');
                }
            }
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`Bao_Gia_AZGROUP_${inputs.zaloNumber}.pdf`);
        setIsSuccessModalOpen(true);

    } catch (error) {
        console.error("PDF generation error:", error);
        alert("Có lỗi khi tạo file PDF.");
    } finally {
        setIsGeneratingPdf(false);
    }
  };

  const handleUnlockAndDownload = async () => {
    if (!result) return;
    
    // Start Loading state on button
    setIsGeneratingPdf(true);

    // 1. Save Data
    saveToGoogleSheet(inputs.customerName, inputs.email, inputs.zaloNumber);

    // 2. Open Zalo (Simulated Auth)
    const zaloUrl = `https://zalo.me/${inputs.zaloNumber}`;
    // Using setTimeout to prevent popup blockers slightly, though click is best
    const zaloWindow = window.open(zaloUrl, '_blank');

    // 3. Unlock View Logic
    setIsResultLocked(false);

    // 4. Wait for state update (Un-blur) to render, then capture PDF
    setTimeout(() => {
        generateAndDownloadPDF();
    }, 1500); // 1.5s delay to allow user to switch tabs or see the unlock animation
  };

  return (
    <div className="min-h-screen pb-12 bg-neutral-950 font-sans">
      {/* Header with Black & Gold Theme */}
      <header className="bg-gradient-to-b from-neutral-900 to-neutral-950 border-b border-amber-500/30 py-8 px-4 shadow-2xl relative overflow-hidden no-print">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="flex flex-col items-center justify-center mb-2">
            <div className="bg-neutral-800 p-3 rounded-2xl border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] mb-4">
               <HardHat className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white uppercase mb-2">
              Dự Toán Xây Dựng <span className="text-amber-500">Tự Động</span>
            </h1>
          </div>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto border-t border-neutral-800 pt-4 mt-2">
            Công cụ dự toán chi phí xây dựng nhanh chóng được <span className="font-bold text-amber-400">AZGROUP</span> phát triển
          </p>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 -mt-8 relative z-20">
        {/* Input Form Card - Dark Theme */}
        <div className="bg-neutral-900/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 mb-8 border border-neutral-800 no-print">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Left Side: Inputs (Takes up 2 columns) */}
             <div className="lg:col-span-2 space-y-8">
                
                {/* Contact Info Section */}
                <div className="border-b border-neutral-800 pb-6">
                   <h2 className="text-xl font-bold text-amber-500 mb-6 flex items-center gap-2">
                      <div className="p-1 bg-amber-500/10 rounded">
                          <User size={20} className="text-amber-500" />
                      </div>
                      Thông Tin Khách Hàng
                   </h2>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                         {/* Name Input */}
                         <div>
                             <label className="block text-sm font-semibold text-neutral-300 mb-2">Họ và tên</label>
                             <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <User size={18} className="text-neutral-500 group-focus-within:text-amber-500 transition-colors" />
                                </div>
                                <input 
                                  type="text"
                                  placeholder="Ví dụ: Nguyễn Văn A"
                                  className="w-full pl-10 p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-white placeholder-neutral-500 transition-all"
                                  value={inputs.customerName}
                                  onChange={(e) => setInputs({...inputs, customerName: e.target.value})}
                                />
                             </div>
                         </div>

                         {/* Email Input */}
                         <div>
                             <label className="block text-sm font-semibold text-neutral-300 mb-2">Email</label>
                             <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Mail size={18} className="text-neutral-500 group-focus-within:text-amber-500 transition-colors" />
                                </div>
                                <input 
                                  type="email"
                                  placeholder="email@example.com"
                                  className="w-full pl-10 p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-white placeholder-neutral-500 transition-all"
                                  value={inputs.email}
                                  onChange={(e) => setInputs({...inputs, email: e.target.value})}
                                />
                             </div>
                         </div>
                      </div>

                      {/* Phone Input */}
                      <div>
                         <label className="block text-sm font-semibold text-neutral-300 mb-2">Số điện thoại Zalo <span className="text-red-500">*</span></label>
                         <div className="relative group h-[52px]"> {/* Match height for alignment */}
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone size={18} className="text-neutral-500 group-focus-within:text-amber-500 transition-colors" />
                            </div>
                            <input 
                              ref={phoneInputRef}
                              type="tel"
                              placeholder="09..."
                              className={`w-full h-full pl-10 p-3 bg-neutral-800 border rounded-lg focus:ring-2 outline-none text-white placeholder-neutral-500 font-medium transition-all ${phoneError ? 'border-red-500 focus:ring-red-500/50' : 'border-neutral-700 focus:ring-amber-500 focus:border-transparent'}`}
                              value={inputs.zaloNumber}
                              onChange={handlePhoneChange}
                            />
                         </div>
                         {phoneError ? (
                             <div className="flex items-center gap-1 mt-2 text-red-500 text-sm font-medium animate-pulse">
                                 <AlertCircle size={14} />
                                 <span>{phoneError}</span>
                             </div>
                         ) : (
                             <p className="text-xs text-neutral-500 mt-2 italic">Kết quả sẽ hiển thị sau khi nhập đúng SĐT.</p>
                         )}
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Service & Dimensions */}
                  <div className="space-y-6">
                    <div className="form-group">
                      <label className="block text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
                         Gói dịch vụ
                         <div className="group relative">
                            <HelpCircle size={16} className="text-neutral-500 hover:text-amber-500 cursor-help transition-colors" />
                            <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs p-3 rounded shadow-xl z-10 text-center">
                              Gói trọn gói bao gồm cả vật tư thô và nhân công.
                            </div>
                         </div>
                      </label>
                      <select 
                        className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-white font-medium transition-all"
                        value={inputs.servicePrice}
                        onChange={(e) => setInputs({...inputs, servicePrice: Number(e.target.value)})}
                      >
                        {SERVICE_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value} className="bg-neutral-800">{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
                          <Ruler size={16} className="text-neutral-500"/> Diện tích sàn (m²)
                        </label>
                        <input 
                          type="number" 
                          min="1"
                          className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-white font-medium transition-all"
                          value={inputs.floorArea}
                          onChange={(e) => setInputs({...inputs, floorArea: Number(e.target.value)})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
                          <Layers size={16} className="text-neutral-500"/> Số tầng
                        </label>
                        <input 
                          type="number" 
                          min="1"
                          max="20"
                          className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-white font-medium transition-all"
                          value={inputs.floors}
                          onChange={(e) => setInputs({...inputs, floors: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Coefficients */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-300 mb-2">Loại móng</label>
                      <select 
                        className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-white font-medium transition-all"
                        value={inputs.foundationCoeff}
                        onChange={(e) => setInputs({...inputs, foundationCoeff: Number(e.target.value)})}
                      >
                        {FOUNDATION_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value} className="bg-neutral-800">{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-300 mb-2">Loại mái</label>
                      <select 
                        className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-white font-medium transition-all"
                        value={inputs.roofCoeff}
                        onChange={(e) => setInputs({...inputs, roofCoeff: Number(e.target.value)})}
                      >
                        {ROOF_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value} className="bg-neutral-800">{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-4 items-end">
                       <div className="flex-1">
                          <label className="block text-sm font-semibold text-neutral-300 mb-2">Tầng hầm</label>
                          <select 
                            className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-white font-medium transition-all"
                            value={inputs.basementCoeff}
                            onChange={(e) => setInputs({...inputs, basementCoeff: Number(e.target.value)})}
                          >
                            {BASEMENT_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value} className="bg-neutral-800">{opt.label}</option>
                            ))}
                          </select>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 cursor-pointer bg-neutral-800 px-5 py-3 rounded-lg border border-neutral-700 w-full hover:bg-neutral-750 hover:border-amber-500/50 transition-all group">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 accent-amber-500 rounded focus:ring-amber-500 bg-neutral-900 border-neutral-600"
                          checked={inputs.hasTum}
                          onChange={(e) => setInputs({...inputs, hasTum: e.target.checked})}
                        />
                        <span className="text-neutral-300 font-medium group-hover:text-amber-500 transition-colors">Có tầng Tum (50%)</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer bg-neutral-800 px-5 py-3 rounded-lg border border-neutral-700 w-full hover:bg-neutral-750 hover:border-amber-500/50 transition-all group">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 accent-amber-500 rounded focus:ring-amber-500 bg-neutral-900 border-neutral-600"
                          checked={inputs.hasContingency}
                          onChange={(e) => setInputs({...inputs, hasContingency: e.target.checked})}
                        />
                        <span className="text-neutral-300 font-medium group-hover:text-amber-500 transition-colors">Dự trù phát sinh (5%)</span>
                    </label>
                </div>
             </div>

             {/* Right Side: House Visualization */}
             <div className="lg:col-span-1 min-h-[500px]">
                <HouseModel 
                   floors={inputs.floors} 
                   hasBasement={inputs.basementCoeff > 0} 
                   hasTum={inputs.hasTum}
                   foundationCoeff={inputs.foundationCoeff}
                   roofType={inputs.roofCoeff}
                />
             </div>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-800 flex justify-center">
             <button 
                onClick={handleCalculate}
                className="w-full md:w-auto flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-400 text-black text-lg font-bold py-4 px-12 rounded-lg shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] hover:-translate-y-1 transition-all uppercase tracking-wide"
             >
                <Calculator size={24} strokeWidth={2.5} />
                Tính Dự Toán Ngay
             </button>
          </div>
        </div>

        {/* Results */}
        <div ref={resultRef}>
          {result && (
            <ResultSection 
                result={result} 
                customerInfo={{ name: inputs.customerName, phone: inputs.zaloNumber, email: inputs.email }}
                onSendZalo={handleUnlockAndDownload}
                onUnlock={handleUnlockAndDownload}
                isGeneratingPdf={isGeneratingPdf}
                isLocked={isResultLocked}
            />
          )}
        </div>

        {/* Floating Indicator */}
        {result && (
             <button 
                onClick={() => resultRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="fixed bottom-6 right-6 bg-amber-500 text-black p-4 rounded-full shadow-lg hover:bg-amber-400 animate-bounce md:hidden z-40 no-print"
             >
                <ArrowDown size={24} />
             </button>
        )}
      </main>

      <PrintModal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)} 
        phone={inputs.zaloNumber}
      />
      
      <footer className="mt-16 text-center text-neutral-500 font-medium text-sm pb-8 no-print border-t border-neutral-900 pt-8">
         <div className="flex justify-center items-center gap-2 mb-2">
            <span className="font-bold text-amber-500">AZGROUP</span>
            <span>&copy; {new Date().getFullYear()}</span>
         </div>
         <p>Hệ thống dự toán xây dựng chuyên nghiệp</p>
      </footer>
    </div>
  );
};

export default App;

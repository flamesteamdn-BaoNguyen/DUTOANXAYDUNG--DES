
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FileDown, MessageCircle, Loader2, Lock, Smartphone, CheckCircle2 } from 'lucide-react';
import { CalculationResult, CustomerInfo } from '../types';
import { formatCurrency } from '../utils/calculator';

interface ResultSectionProps {
  result: CalculationResult | null;
  customerInfo: CustomerInfo;
  onSendZalo: () => void; // Used for the "Chat" button
  onUnlock: () => void;   // Used for the "Unlock & Download" button
  isGeneratingPdf?: boolean;
  isLocked?: boolean;
}

const COLORS = ['#d97706', '#059669', '#2563eb', '#7c3aed', '#dc2626']; 

export const ResultSection: React.FC<ResultSectionProps> = ({ 
  result, 
  customerInfo, 
  onSendZalo, 
  onUnlock,
  isGeneratingPdf = false,
  isLocked = false
}) => {
  if (!result) return null;

  const chartData = [
    { name: 'Móng', value: result.breakdown.foundation },
    { name: 'Thân', value: result.breakdown.body },
    { name: 'Mái', value: result.breakdown.roof },
  ];

  if (result.breakdown.basement > 0) {
    chartData.push({ name: 'Hầm', value: result.breakdown.basement });
  }
  if (result.breakdown.contingency > 0) {
    chartData.push({ name: 'Dự phòng', value: result.breakdown.contingency });
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 relative">
      
      {/* 
          Paper Container 
          We keep this background WHITE to resemble a real document/quote.
      */}
      <div 
        id="pdf-content" 
        className={`bg-white p-6 md:p-8 rounded-sm shadow-2xl relative transition-all duration-500 ${isLocked ? 'overflow-hidden select-none' : ''}`}
      > 
        {/* Decorative Gold Top Border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 z-10"></div>

        {/* ================= LOCK OVERLAY ================= */}
        {isLocked && (
          <div className="absolute inset-0 z-50 backdrop-blur-md bg-white/60 flex items-center justify-center p-4">
             <div className="bg-neutral-900 border border-amber-500/50 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden animate-in zoom-in duration-300">
                {/* Glow effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
                    <Lock size={32} className="text-amber-500" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2 uppercase">Kết Quả Đã Sẵn Sàng</h3>
                  <p className="text-neutral-400 mb-6 text-sm">
                    Bảng dự toán chi tiết cho căn nhà của bạn đã được tính toán xong.
                    <br/>Vui lòng xác thực qua Zalo để mở khóa và tải về miễn phí.
                  </p>

                  <button 
                    onClick={onUnlock}
                    disabled={isGeneratingPdf}
                    className="w-full flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-400 text-black text-lg font-bold py-4 px-6 rounded-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] group"
                  >
                     {isGeneratingPdf ? (
                        <>
                           <Loader2 size={24} className="animate-spin" />
                           Đang xử lý...
                        </>
                     ) : (
                        <>
                           <Smartphone size={24} className="group-hover:rotate-12 transition-transform"/>
                           Kết Nối Zalo & Tải Về
                        </>
                     )}
                  </button>

                  <p className="mt-4 text-xs text-neutral-500 flex items-center justify-center gap-1">
                    <CheckCircle2 size={12} className="text-green-500"/>
                    Hoàn toàn miễn phí & Bảo mật
                  </p>
                </div>
             </div>
          </div>
        )}

        {/* ================= CONTENT (BLURRED IF LOCKED) ================= */}
        <div className={isLocked ? 'filter blur-sm pointer-events-none opacity-50' : ''}>
          
          {/* Print Header - Visible only in PDF/Print */}
          <div className="hidden print-only pdf-header mb-8 pb-6 border-b-4 border-amber-500">
             <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                 <div className="flex-1">
                     <h2 className="text-lg font-extrabold text-amber-600 uppercase mb-2 leading-tight">
                        TẬP ĐOÀN ĐẦU TƯ VÀ PHÁT TRIỂN ĐÔ THỊ AZGROUP
                     </h2>
                     <div className="text-sm text-gray-800 space-y-1 font-medium">
                        <p>📞 Hotline: 1900.232.327</p>
                        <p>📧 Email: info@azg.com.vn</p>
                        <p>🌐 Website: azg.com.vn</p>
                     </div>
                 </div>
                 
                 <div className="text-right">
                     <h1 className="text-2xl font-bold text-black uppercase tracking-tight">BẢNG DỰ TOÁN</h1>
                     <div className="mt-2">
                        <span className="text-xs text-gray-500 uppercase tracking-wider block">Ngày lập</span>
                        <span className="text-base font-bold text-black">{new Date().toLocaleDateString('vi-VN')}</span>
                     </div>
                 </div>
             </div>
          </div>

          {/* Screen Header */}
          <div className="mb-6 print:hidden border-b border-gray-200 pb-4">
              <h3 className="text-xl font-bold text-black flex items-center gap-2">
                  <span className="w-2 h-8 bg-amber-500 rounded-sm"></span>
                  KẾT QUẢ DỰ TOÁN CHI TIẾT
              </h3>
          </div>

          {/* Customer Info Box */}
          {(customerInfo.phone || customerInfo.name) && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-8 print:block print:bg-transparent print:border-gray-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base text-gray-800">
                    <div className="space-y-1">
                        <span className="font-bold text-gray-500 uppercase text-xs block">Khách hàng</span> 
                        <span className="text-lg font-semibold block">{customerInfo.name || "Khách hàng"}</span>
                    </div>
                    
                    <div className="space-y-1">
                        <span className="font-bold text-gray-500 uppercase text-xs block">Điện thoại Zalo</span> 
                        <span className="text-lg font-semibold block">{customerInfo.phone || "..."}</span>
                    </div>

                    {customerInfo.email && (
                        <div className="space-y-1 md:col-span-2">
                            <span className="font-bold text-gray-500 uppercase text-xs block">Email</span> 
                            <span className="text-lg font-semibold block">{customerInfo.email}</span>
                        </div>
                    )}
                </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block">
            
            {/* Chart Section */}
            <div className="lg:col-span-1 bg-white p-4 rounded-xl border border-gray-100 print:hidden flex flex-col items-center justify-center">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 text-center">Biểu đồ phân bổ ngân sách</h3>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ color: '#000', fontWeight: 600 }}
                    />
                    <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-slate-600 text-xs font-medium">{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table Section */}
            <div className="lg:col-span-2 print:w-full">
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-amber-500 text-white font-bold uppercase print:bg-gray-100 print:text-black">
                            <tr>
                                <th className="px-4 py-4">Hạng mục</th>
                                <th className="px-4 py-4 text-right whitespace-nowrap">Diện tích (m²)</th>
                                <th className="px-4 py-4 text-right hidden sm:table-cell">Đơn giá</th>
                                <th className="px-4 py-4 text-right">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {result.items.map((item, index) => (
                                <tr key={index} className={item.isHighlight ? 'bg-amber-50 font-medium' : 'hover:bg-gray-50'}>
                                    <td className="px-4 py-4 text-gray-800">
                                        {item.name}
                                        {item.note && <span className="block text-xs text-gray-500 italic font-normal mt-1">{item.note}</span>}
                                    </td>
                                    <td className="px-4 py-4 text-right text-gray-600">
                                        {item.area > 0 ? item.area.toFixed(1) : '-'}
                                    </td>
                                    <td className="px-4 py-4 text-right text-gray-600 hidden sm:table-cell">
                                        {item.price > 0 ? formatCurrency(item.price) : '-'}
                                    </td>
                                    <td className="px-4 py-4 text-right font-bold text-gray-900 text-base">
                                        {formatCurrency(item.total)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-900 text-white print:bg-gray-100 print:text-black print:border-t-2 print:border-black">
                            <tr>
                                <td colSpan={2} className="px-4 py-5 text-right font-bold uppercase text-amber-500 print:text-black">
                                    Tổng Cộng
                                </td>
                                <td colSpan={2} className="px-4 py-5 text-right font-extrabold text-amber-400 text-xl print:text-black">
                                    {formatCurrency(result.totalCost)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                <div className="mt-6 p-3 bg-amber-50 border-l-4 border-amber-500 text-xs text-gray-600 italic">
                    <strong>Lưu ý:</strong> Đơn giá trên chỉ mang tính chất tham khảo tại thời điểm hiện tại. Giá thực tế phụ thuộc vào vị trí thi công, thời điểm và chủng loại vật tư cụ thể được thỏa thuận trong hợp đồng.
                </div>
            </div>
          </div>
        </div>

      </div>

      {/* Actions - Only visible if UNLOCKED */}
      {!isLocked && (
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 no-print animate-in fade-in duration-500">
            <a 
                href="https://zalo.me/0982777111" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-neutral-800 border border-neutral-700 text-white hover:text-amber-500 hover:border-amber-500 font-bold rounded-lg transition-all"
            >
                <MessageCircle size={20} />
                Chat Tư Vấn
            </a>
            <button 
                onClick={onUnlock} // Re-trigger PDF generation if needed
                disabled={isGeneratingPdf}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-all shadow-lg hover:shadow-amber-500/20 uppercase tracking-wide"
            >
                {isGeneratingPdf ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Đang xử lý...
                    </>
                ) : (
                    <>
                      <FileDown size={20} />
                      Tải lại PDF
                    </>
                )}
            </button>
        </div>
      )}
    </div>
  );
};

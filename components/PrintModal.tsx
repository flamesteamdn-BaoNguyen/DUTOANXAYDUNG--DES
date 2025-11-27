import React from 'react';
import { X, CheckCircle, Phone } from 'lucide-react';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
}

export const PrintModal: React.FC<PrintModalProps> = ({ isOpen, onClose, phone }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden animate-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:bg-gray-100 rounded-full p-1 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          
          <h3 className="text-2xl font-bold text-black mb-2">Đã Tải Báo Giá</h3>
          <p className="text-black font-medium mb-6">
            File PDF chi tiết đã được tải về thiết bị của bạn. Cảm ơn bạn đã kết nối với chúng tôi.
          </p>

          <div className="bg-gray-100 rounded-lg p-4 mb-6 flex items-center justify-center gap-3">
             <Phone size={20} className="text-black" />
             <span className="text-xl font-bold text-black">{phone}</span>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-lg transition-all"
          >
            ĐÓNG
          </button>
        </div>
      </div>
    </div>
  );
};
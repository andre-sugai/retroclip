
import React from 'react';
import { X, Coffee, QrCode, Heart } from 'lucide-react';
import { Button } from './ui/Button';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import ReactDOM from 'react-dom';

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('18e7f381-df00-4cc3-99df-9b0ad4565d7e');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative overflow-hidden">
        
        {/* Decorative Header Background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors z-10"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="p-8 flex flex-col items-center text-center relative z-0">
          
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-4 ring-primary/5">
            <Coffee className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Gostou do Groovio?</h2>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed max-w-xs">
            Se esse projeto trouxe boas memórias, novidades ou mesmo um pouco de diversão em meio a tanta correria do dia a dia e você quiser apoiar o desenvolvimento, considere me pagar um cafézinho! ☕
            Você pode contribuir com o valor que desejar, desde que seja pelo menos R$ 1,00.
          </p>

          <div className="bg-white dark:bg-black p-4 rounded-xl shadow-inner border border-zinc-200 dark:border-zinc-800 mb-6 group relative">
             {/* QR Code Image */}
             <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/pix-qrcode.png" 
                  alt="QR Code PIX" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    console.error('Erro ao carregar QR Code');
                    e.currentTarget.style.display = 'none';
                  }}
                />
             </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <div 
              onClick={handleCopy}
              className="text-xs font-mono text-muted-foreground bg-zinc-100 dark:bg-zinc-800/50 py-2 px-4 rounded-lg cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
            >
                <span className="truncate">18e7f381-df00-4cc3-99df-9b0ad4565d7e</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ml-auto transition-colors ${copied ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>
                  {copied ? 'COPIADO!' : 'COPIAR'}
                </span>
            </div>
            
            <p className="text-[10px] text-muted-foreground mt-2">
              <Heart className="w-3 h-3 inline-block mr-1 text-red-500 fill-current animate-pulse" />
              Toda contribuição incentiva novas features! Envie sua ideia através da mensagem do Pix.
            </p>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
};

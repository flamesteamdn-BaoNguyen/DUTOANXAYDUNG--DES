import React from 'react';
import { Layers, ArrowUp } from 'lucide-react';

interface HouseModelProps {
  floors: number;
  hasBasement: boolean;
  hasTum: boolean;
  foundationCoeff: number;
  roofType: number;
}

export const HouseModel: React.FC<HouseModelProps> = ({ floors, hasBasement, hasTum, foundationCoeff, roofType }) => {
  // Limit max visual floors to avoid breaking layout
  const visualFloors = Math.min(floors, 10);
  const isTooTall = floors > 10;

  // Determine Foundation Name for Tooltip
  const getFoundationName = () => {
      if (foundationCoeff === 0.3) return "Móng Đơn";
      if (foundationCoeff === 0.4) return "Móng Cọc";
      if (foundationCoeff === 0.6) return "Móng Băng";
      if (foundationCoeff === 1.0) return "Móng Bè";
      return "Móng";
  }

  return (
    <div className="h-full flex flex-col items-center justify-center bg-neutral-900/50 rounded-xl border-2 border-dashed border-neutral-800 p-6 relative overflow-hidden min-h-[500px]">
      
      <div className="absolute top-4 right-4 bg-neutral-800 px-3 py-1 rounded border border-neutral-700 text-xs text-neutral-400">
        Mô phỏng
      </div>

      {/* Ground Line */}
      <div className="absolute bottom-24 w-full h-0.5 bg-amber-500/30 z-0"></div>
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-b from-neutral-800 to-neutral-950 z-0"></div>

      <div className="relative z-10 flex flex-col items-center w-48 transition-all duration-500 mb-8">
        
        {/* Height Indicator */}
        <div className="absolute -left-12 top-10 bottom-0 w-px bg-amber-500/50 flex flex-col justify-between items-center py-2">
            <div className="w-2 h-px bg-amber-500"></div>
            <div className="text-[10px] text-amber-500 rotate-270 whitespace-nowrap font-mono">
                {floors} TẦNG {hasTum ? '+ TUM' : ''} {hasBasement ? '+ HẦM' : ''}
            </div>
            <div className="w-2 h-px bg-amber-500"></div>
        </div>

        {/* Roof */}
        <div className="w-52 h-16 relative z-20 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
           {/* Roof Shape */}
           <div className="absolute bottom-0 w-full h-full bg-neutral-800 border-t-2 border-l-2 border-r-2 border-amber-500" 
                style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}>
           </div>
           {/* Roof Detail */}
           <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-amber-500 font-bold uppercase tracking-widest">
              Mái
           </div>
        </div>

        {/* Tum (Attic) - Only if selected */}
        {hasTum && (
            <div className="h-12 w-24 bg-neutral-800 border-x-2 border-b border-amber-500/50 relative flex justify-center items-center px-2 animate-in slide-in-from-bottom-2 fade-in">
                 <div className="w-4 h-6 bg-neutral-900 border border-amber-500/30 rounded-t-sm"></div>
                 <div className="absolute bottom-1 right-2 text-[8px] text-neutral-500 uppercase">Tum</div>
            </div>
        )}

        {/* Floors Loop */}
        <div className="flex flex-col-reverse w-40">
           {Array.from({ length: visualFloors }).map((_, index) => (
             <div key={index} className="h-14 w-full bg-neutral-800 border-x-2 border-b border-amber-500/50 relative flex justify-around items-center px-4 animate-in slide-in-from-bottom-2 fade-in duration-500" style={{ animationDelay: `${index * 50}ms` }}>
                
                {/* Windows */}
                <div className="w-6 h-8 bg-neutral-900 border border-amber-500/30 rounded-t-sm"></div>
                
                {/* Floor Label */}
                <div className="text-xs font-mono text-neutral-500">
                    T{index + 1}
                </div>
                
                <div className="w-6 h-8 bg-neutral-900 border border-amber-500/30 rounded-t-sm"></div>

                {/* Balcony hint */}
                <div className="absolute bottom-0 left-[-4px] right-[-4px] h-1 bg-amber-500/40 rounded-full"></div>
             </div>
           ))}
        </div>

        {isTooTall && (
            <div className="text-amber-500 text-xs py-1 animate-bounce">
                <ArrowUp size={12} /> +{floors - 10} tầng nữa
            </div>
        )}

        {/* Basement (Conditional) */}
        {hasBasement && (
          <div className="h-14 w-40 bg-neutral-800/80 border-x-2 border-b-2 border-dashed border-amber-500/30 relative flex justify-center items-center mt-0.5 animate-in slide-in-from-top-2 fade-in">
             <div className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
                Tầng Hầm
             </div>
             {/* Hatch pattern */}
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]"></div>
          </div>
        )}

        {/* Foundation Visuals - Based on Type */}
        <div className="mt-1 flex flex-col items-center animate-in fade-in duration-700">
            {/* Label */}
            <div className="mb-1 text-[10px] text-amber-500 uppercase font-bold tracking-widest">{getFoundationName()}</div>
            
            {/* 1. Móng Đơn (Spot Foundation - 0.3) */}
            {foundationCoeff === 0.3 && (
                <div className="flex justify-between w-44 px-2">
                    <div className="flex flex-col items-center">
                         <div className="w-10 h-6 bg-neutral-700 rounded-sm border border-neutral-600" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }}></div>
                    </div>
                    <div className="flex flex-col items-center">
                         <div className="w-10 h-6 bg-neutral-700 rounded-sm border border-neutral-600" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }}></div>
                    </div>
                </div>
            )}

            {/* 2. Móng Cọc (Pile Foundation - 0.4) */}
            {foundationCoeff === 0.4 && (
                <div className="flex justify-between w-44 px-2">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-4 bg-neutral-700 rounded-sm border border-neutral-600"></div>
                        <div className="flex gap-2 mt-0.5">
                            <div className="w-1 h-8 bg-neutral-600"></div>
                            <div className="w-1 h-8 bg-neutral-600"></div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-4 bg-neutral-700 rounded-sm border border-neutral-600"></div>
                        <div className="flex gap-2 mt-0.5">
                            <div className="w-1 h-8 bg-neutral-600"></div>
                            <div className="w-1 h-8 bg-neutral-600"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Móng Băng (Strip Foundation - 0.6) */}
            {foundationCoeff === 0.6 && (
                <div className="w-48">
                    <div className="h-6 w-full bg-neutral-700 border border-neutral-600 flex justify-center items-center rounded-sm">
                         <div className="w-full h-1 bg-black/20"></div>
                    </div>
                </div>
            )}

            {/* 4. Móng Bè (Raft Foundation - 1.0) */}
            {foundationCoeff === 1.0 && (
                <div className="w-52">
                    <div className="h-8 w-full bg-neutral-600 border-2 border-neutral-500 rounded-sm relative overflow-hidden">
                        {/* Concrete pattern */}
                        <div className="absolute inset-0 opacity-30 flex flex-wrap content-center justify-center gap-1 p-1">
                             {Array.from({length: 12}).map((_,i) => (
                                 <div key={i} className="w-1 h-1 bg-black rounded-full"></div>
                             ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
        
      </div>

      <div className="absolute bottom-4 right-4 text-right">
         <div className="flex items-center gap-1 text-xs text-neutral-500">
            <Layers size={12} />
            <span>Kết cấu</span>
         </div>
      </div>
    </div>
  );
};
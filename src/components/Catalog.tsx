import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Tag, ArrowRight } from 'lucide-react';

interface Scrap {
  id: string;
  imageUrl: string;
  material: string;
  size: number;
  color: string;
  description: string;
  ownerEmail: string;
}

export function Catalog({ scraps }: { scraps: Scrap[] }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const materials = ['All', 'Silk', 'Cotton', 'Wool', 'Linen', 'Polyester'];

  const filteredScraps = scraps.filter(s => {
    const matchesFilter = filter === 'All' || s.material === filter;
    const matchesSearch = s.material.toLowerCase().includes(search.toLowerCase()) || 
                          s.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A5A40]/50" size={18} />
          <input 
            type="text"
            placeholder="Search material or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-full border border-[#5A5A40]/10 focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 transition-all font-sans"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
          <Filter size={18} className="text-[#5A5A40] shrink-0" />
          {materials.map(m => (
            <button
              key={m}
              onClick={() => setFilter(m)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium ${
                filter === m ? 'bg-[#5A5A40] text-white shadow-md' : 'bg-white text-[#5A5A40] border border-[#5A5A40]/10 hover:bg-[#5A5A40]/5'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence>
          {filteredScraps.map((scrap) => (
            <motion.div
              key={scrap.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-[#5A5A40]/5 group"
            >
              <div className="aspect-square relative overflow-hidden bg-[#f0f0f0]">
                <img 
                  src={scrap.imageUrl} 
                  alt={scrap.material}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#5A5A40] flex items-center gap-1.5 shadow-sm">
                  <Tag size={12} />
                  {scrap.material}
                </div>
                <div className="absolute bottom-4 right-4 bg-[#5A5A40] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {scrap.size}m
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: scrap.color.toLowerCase() }}></div>
                    <span className="text-sm font-semibold text-[#1a1a1a]">{scrap.color}</span>
                  </div>
                </div>
                <p className="text-[#5A5A40] text-sm line-clamp-2 mb-4 italic">
                  "{scrap.description}"
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-[#f5f5f0]">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#5A5A40]/50 truncate max-w-[120px]">
                    {scrap.ownerEmail}
                  </span>
                  <button className="flex items-center gap-1 text-[#5A5A40] text-xs font-bold group-hover:gap-2 transition-all underline underline-offset-4 decoration-[#5A5A40]/20 hover:decoration-[#5A5A40]">
                    Details <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredScraps.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-[#5A5A40]/20">
          <p className="text-[#5A5A40] font-serif italic text-xl">No scraps found matching your search.</p>
        </div>
      )}
    </div>
  );
}

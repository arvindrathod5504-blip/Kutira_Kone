import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Lightbulb, Scissors, Sparkles, Wand2 } from 'lucide-react';
import { generateDesignIdeas, DesignIdea } from '../lib/gemini';

export function DesignIdeas() {
  const [ideas, setIdeas] = useState<DesignIdea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIdeas() {
      // Default sample ideas for the page
      const result = await generateDesignIdeas("Cotton & Mixed Scraps", 0.5);
      setIdeas(result);
      setLoading(false);
    }
    loadIdeas();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-[32px] p-8 h-64 animate-pulse border border-[#5A5A40]/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ideas.map((idea, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-white p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all border border-[#5A5A40]/5"
          >
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#5A5A40] text-white rounded-2xl flex items-center justify-center rotate-12 shadow-lg group-hover:rotate-0 transition-transform">
              <Sparkles size={20} />
            </div>
            
            <div className="mb-6 inline-flex p-3 bg-[#f5f5f0] text-[#5A5A40] rounded-2xl">
              <Scissors size={24} />
            </div>

            <h3 className="text-xl font-serif font-bold text-[#1a1a1a] mb-3">{idea.title}</h3>
            <p className="text-[#5A5A40] italic mb-6 leading-relaxed">
              "{idea.description}"
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-[#f5f5f0]">
              <div className="flex items-center gap-1.5 opacity-50">
                <Wand2 size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40]">Auto-Generated</span>
              </div>
              <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                idea.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                idea.difficulty === 'Medium' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {idea.difficulty}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Featured Suggestion Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="bg-[#5A5A40] text-white p-12 rounded-[48px] overflow-hidden relative shadow-2xl"
      >
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-3xl font-serif mb-4 italic">Zero-Waste Tip</h3>
          <p className="text-lg opacity-80 leading-relaxed mb-8">
            "Did you know? Even the smallest snippets of fabric can be used as high-quality stuffing for toys or pincushions. Nothing goes to waste in a circular economy!"
          </p>
          <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
            <Recycle size={18} />
            <span>Kutira-Kone Community Invariant</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <Recycle size={300} className="rotate-12 translate-x-20 -translate-y-20" />
        </div>
      </motion.div>
    </div>
  );
}

function Recycle({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M7 11l5-5 5 5M7 21l5-5 5 5M12 6v10" />
    </svg>
  );
}

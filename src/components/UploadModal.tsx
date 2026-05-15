import { useState, useRef, FormEvent } from 'react';
import { motion } from 'motion/react';
import { X, Camera, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { generateDesignIdeas, DesignIdea } from '../lib/gemini';

interface UploadModalProps {
  onClose: () => void;
  userId: string;
  userEmail: string;
}

export function UploadModal({ onClose, userId, userEmail }: UploadModalProps) {
  const [step, setStep] = useState<'form' | 'loading' | 'success'>('form');
  const [formData, setFormData] = useState({
    material: 'Cotton',
    size: 0.5,
    color: 'Red',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000' // Placeholder for now
  });
  const [ideas, setIdeas] = useState<DesignIdea[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStep('loading');

    try {
      // In a real app, we'd upload the image to Firebase Storage first.
      // For this demo, we use a placeholder if no URL is provided.
      
      const scrapData = {
        ...formData,
        ownerId: userId,
        ownerEmail: userEmail,
        status: 'available',
        location: {
          lat: 12.9716 + (Math.random() - 0.5) * 0.1, // Near Bangalore
          lng: 77.5946 + (Math.random() - 0.5) * 0.1
        },
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'scraps'), scrapData);
      
      // Generate AI ideas
      const suggestedIdeas = await generateDesignIdeas(formData.material, formData.size);
      setIdeas(suggestedIdeas);
      
      setStep('success');
    } catch (error) {
      console.error("Upload error:", error);
      setStep('form');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1a1a]/40 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#5A5A40]/40 hover:text-[#5A5A40] transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8 md:p-12 overflow-y-auto">
          {step === 'form' && (
            <>
              <h2 className="text-3xl font-serif text-[#1a1a1a] mb-2">Share Your Scraps</h2>
              <p className="text-[#5A5A40] italic mb-8">Give your leftovers a new life.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-2">Material</label>
                    <select 
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      className="w-full px-4 py-3 bg-[#f5f5f0] rounded-2xl focus:ring-2 focus:ring-[#5A5A40]/20 outline-none"
                    >
                      <option>Cotton</option>
                      <option>Silk</option>
                      <option>Wool</option>
                      <option>Linen</option>
                      <option>Polyester</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-2">Approx. Size (meters)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 bg-[#f5f5f0] rounded-2xl focus:ring-2 focus:ring-[#5A5A40]/20 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-2">Color</label>
                    <input 
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full px-4 py-3 bg-[#f5f5f0] rounded-2xl focus:ring-2 focus:ring-[#5A5A40]/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-2">Photo URL (Required)</label>
                    <div className="relative">
                      <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A5A40]/40" size={18} />
                      <input 
                        required
                        type="url"
                        placeholder="Paste image address..."
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-[#f5f5f0] rounded-2xl focus:ring-2 focus:ring-[#5A5A40]/20 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-2">Description</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-[#f5f5f0] rounded-2xl focus:ring-2 focus:ring-[#5A5A40]/20 outline-none resize-none"
                    placeholder="Tell us about the fabric..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#5A5A40] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                >
                  <Upload size={20} />
                  List Scrap
                </button>
              </form>
            </>
          )}

          {step === 'loading' && (
            <div className="py-20 flex flex-col items-center justify-center gap-6">
              <Loader2 size={64} className="text-[#5A5A40] animate-spin" />
              <p className="text-2xl font-serif text-[#1a1a1a]">Listing your fabric...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col h-full">
              <div className="mb-8 text-center">
                <div className="flex justify-center mb-4 text-green-600">
                  <CheckCircle2 size={64} />
                </div>
                <h2 className="text-3xl font-serif text-[#1a1a1a] mb-2">Listed Successfully!</h2>
                <p className="text-[#5A5A40]">Your fabric is now in the marketplace.</p>
              </div>

              <div className="flex-1">
                <h3 className="text-xs font-bold text-[#5A5A40] uppercase tracking-[0.2em] mb-4 text-center">AI Design Suggestions</h3>
                <div className="space-y-4">
                  {ideas.map((idea, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={i} 
                      className="bg-[#f5f5f0] p-6 rounded-3xl"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-[#1a1a1a]">{idea.title}</h4>
                        <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[#5A5A40]">
                          {idea.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-[#5A5A40] italic">"{idea.description}"</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <button 
                onClick={onClose}
                className="mt-8 w-full bg-[#5A5A40] text-white py-4 rounded-2xl font-bold shadow-lg"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

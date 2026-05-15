import { ReactNode } from 'react';
import { User } from 'firebase/auth';
import { Grid, Map as MapIcon, Lightbulb, Plus, LogOut, Recycle } from 'lucide-react';
import { motion } from 'motion/react';

interface LayoutProps {
  children: ReactNode;
  user: User;
  onLogout: () => void;
  activeView: 'catalog' | 'map' | 'ideas';
  onViewChange: (view: 'catalog' | 'map' | 'ideas') => void;
  onUploadClick: () => void;
}

export function Layout({ children, user, onLogout, activeView, onViewChange, onUploadClick }: LayoutProps) {
  const navItems = [
    { id: 'catalog', icon: Grid, label: 'Catalog' },
    { id: 'map', icon: MapIcon, label: 'Nearby Map' },
    { id: 'ideas', icon: Lightbulb, label: 'Design Ideas' },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f5f5f0] font-sans selection:bg-[#5A5A40] selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#f5f5f0]/80 backdrop-blur-md border-b border-[#5A5A40]/10">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#5A5A40] text-white rounded-xl shadow-lg">
              <Recycle size={28} />
            </div>
            <h1 className="text-2xl font-serif font-bold tracking-tight text-[#1a1a1a]">Kutira-Kone</h1>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  activeView === item.id 
                    ? 'bg-[#5A5A40] text-white shadow-md' 
                    : 'text-[#5A5A40] hover:bg-[#5A5A40]/5'
                }`}
              >
                <item.icon size={18} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={onUploadClick}
              className="bg-[#5A5A40] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95"
              title="Upload Scrap"
            >
              <Plus size={24} />
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-[#5A5A40]/10">
              <img 
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                alt="Profile"
              />
              <button 
                onClick={onLogout}
                className="text-[#5A5A40] hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24">
        {children}
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-[#5A5A40]/10 px-4 py-3 rounded-full shadow-2xl z-50 flex items-center gap-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`p-3 rounded-full transition-all ${
              activeView === item.id 
                ? 'bg-[#5A5A40] text-white scale-110' 
                : 'text-[#5A5A40] hover:bg-[#5A5A40]/5'
            }`}
          >
            <item.icon size={22} />
          </button>
        ))}
      </nav>
    </div>
  );
}

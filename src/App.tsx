/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { signInWithGoogle, logout, db } from './lib/firebase';
import { collection, query, onSnapshot, orderBy, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { Layout } from './components/Layout';
import { Catalog } from './components/Catalog';
import { ScrapMap } from './components/ScrapMap';
import { UploadModal } from './components/UploadModal';
import { DesignIdeas } from './components/DesignIdeas';
import { Plus, Map as MapIcon, Grid, Lightbulb, LogIn, LogOut, Recycle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'MY_MAPS_KEY';

function MainApp() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<'catalog' | 'map' | 'ideas'>('catalog');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [scraps, setScraps] = useState<any[]>([]);
  const [radius, setRadius] = useState(5); // 5km default

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'scraps'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setScraps(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Firestore Error:", error);
    });
    return unsubscribe;
  }, [user]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f5f5f0]">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-[#5A5A40] flex flex-col items-center gap-4"
        >
          <Recycle size={48} className="animate-spin" />
          <p className="font-serif italic">Loading Kutira-Kone...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f5f5f0] p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md"
        >
          <div className="flex justify-center mb-6 text-[#5A5A40]">
            <Recycle size={80} />
          </div>
          <h1 className="text-5xl font-serif text-[#1a1a1a] mb-4">Kutira-Kone</h1>
          <p className="text-xl text-[#5A5A40] italic mb-8">Zero-Waste Fabric Exchange for Local Artisans</p>
          <button 
            onClick={signInWithGoogle}
            className="flex items-center gap-3 bg-[#5A5A40] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#4a4a34] transition-colors shadow-lg"
          >
            <LogIn size={24} />
            Enter Marketplace
          </button>
        </motion.div>
      </div>
    );
  }

  if (!hasValidKey && view === 'map') {
    return (
      <Layout 
        user={user} 
        onLogout={logout} 
        activeView={view} 
        onViewChange={setView}
        onUploadClick={() => setIsUploadOpen(true)}
      >
        <div className="flex items-center justify-center h-[calc(100vh-180px)] font-sans p-6">
          <div className="text-center max-w-lg bg-white p-8 rounded-[32px] shadow-sm">
            <h2 className="text-2xl font-serif mb-4">Google Maps API Key Required</h2>
            <p className="text-[#5A5A40] mb-6">To see fabric scraps in your neighborhood, please add your Google Maps API key.</p>
            <ol className="text-left space-y-4 text-sm text-[#5A5A40] bg-[#f5f5f0] p-6 rounded-2xl mb-6">
              <li>1. Get an API key from Google Cloud Console.</li>
              <li>2. Open <strong>Settings</strong> (⚙️) → <strong>Secrets</strong></li>
              <li>3. Add <code>GOOGLE_MAPS_PLATFORM_KEY</code> and paste your key.</li>
            </ol>
            <p className="text-xs text-gray-400">The map will appear once the key is configured.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      user={user} 
      onLogout={logout} 
      activeView={view} 
      onViewChange={setView}
      onUploadClick={() => setIsUploadOpen(true)}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {view === 'catalog' && (
            <motion.div
              key="catalog"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-3xl font-serif text-[#1a1a1a]">Fabric Catalog</h2>
                  <p className="text-[#5A5A40] italic">Explore leftovers from local tailors</p>
                </div>
              </div>
              <Catalog scraps={scraps} />
            </motion.div>
          )}

          {view === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-[600px] rounded-[32px] overflow-hidden shadow-inner border-4 border-white"
            >
              <ScrapMap scraps={scraps} radius={radius} onRadiusChange={setRadius} />
            </motion.div>
          )}

          {view === 'ideas' && (
            <motion.div
              key="ideas"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
               <div className="mb-8">
                <h2 className="text-3xl font-serif text-[#1a1a1a]">Design Ideas</h2>
                <p className="text-[#5A5A40] italic">AI-powered projects for your small scraps</p>
              </div>
              <DesignIdeas />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isUploadOpen && (
        <UploadModal 
          onClose={() => setIsUploadOpen(false)} 
          userId={user.uid}
          userEmail={user.email || ''}
        />
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

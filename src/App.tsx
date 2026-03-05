import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollyCanvas from './components/animations/ScrollyCanvas';
import Dishes from './components/Dishes';
import SearchRecipes from './components/SearchRecipes';
import UserProfile from './components/UserProfile';
import { ChefHat, Search, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Turn header opaque only after leaving the hero section (~80% scroll)
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="text-black selection:bg-orange-500 selection:text-white scroll-smooth transition-colors duration-500">
      {/* Dynamic Top Gradient for readability at scroll 0 */}
      <div className={`fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-black/20 to-transparent z-[90] pointer-events-none transition-opacity duration-700 ${scrolled ? 'opacity-0' : 'opacity-100'}`} />

      {/* Navigation Header - Adaptive Pill Design */}
      <nav className={`fixed left-1/2 -translate-x-1/2 z-[100] flex justify-between items-center transition-all duration-700 ease-[0.19, 1, 0.22, 1] ${scrolled
        ? 'top-6 w-[90%] md:w-[60%] bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] py-4 px-8 rounded-full'
        : 'top-0 w-full bg-transparent border-transparent py-6 px-12 rounded-none'
        }`}>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <ChefHat className={`transition-all duration-500 ${scrolled ? 'text-orange-500' : 'text-white'}`} size={scrolled ? 24 : 32} />
          <span className={`text-2xl md:text-3xl logo-font tracking-tight flex items-center transition-colors duration-500 ${scrolled ? '' : 'text-white'}`}>
            <span className="text-orange-500">Noodle</span>
            <span className={`${scrolled ? 'text-gray-900' : 'text-white/90'} ml-2`}>Artistry</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#recipe-search" className={`text-[10px] font-bold transition-all duration-500 flex items-center gap-2 uppercase tracking-[0.2em] ${scrolled ? 'text-gray-400 hover:text-orange-500' : 'text-white/80 hover:text-white'}`}>
            <Search size={14} /> Recipes
          </a>
          <a href="#user-profile" className={`text-[10px] font-bold transition-all duration-500 flex items-center gap-2 uppercase tracking-[0.2em] ${scrolled ? 'text-gray-400 hover:text-orange-500' : 'text-white/80 hover:text-white'}`}>
            <UserIcon size={14} /> Profile
          </a>
          <button className={`transition-all duration-500 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] active:scale-95 ${scrolled
            ? 'bg-orange-500 text-white px-8 py-3 shadow-lg shadow-orange-500/20'
            : 'bg-white text-orange-500 px-10 py-4 hover:shadow-2xl shadow-white/10'
            }`}>
            Experience
          </button>
        </div>
      </nav>

      {/* Cinematic Scrollytelling Section */}
      <section className="relative z-10">
        <ScrollyCanvas />
      </section>

      {/* Signature Dishes - Higher z-index to cover fixed hero elements */}
      <section id="dishes" className="relative z-30 py-20 bg-white">
        <div className="section-divider opacity-50 mb-20" />
        <Dishes />
      </section>

      {/* Decorative Gap 1 */}
      <div className="relative h-40 bg-white overflow-hidden pointer-events-none">
        <div className="section-divider" />
        <motion.div
          animate={{ x: [0, 50, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/4 -translate-y-1/2 text-9xl font-black text-gray-50 italic opacity-20"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          ESSENCE
        </motion.div>
      </div>

      {/* Recipe Management System */}
      <section id="recipe-search" className="relative z-30 py-20 luxury-blur">
        <SearchRecipes />
      </section>

      {/* Decorative Gap 2 */}
      <div className="relative h-40 bg-white overflow-hidden pointer-events-none">
        <div className="section-divider" />
        <motion.div
          animate={{ x: [0, -50, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-1/4 -translate-y-1/2 text-9xl font-black text-gray-50 italic opacity-20"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          CRAFT
        </motion.div>
      </div>

      {/* User Preferences */}
      <section id="user-profile" className="relative z-30 py-20 bg-white">
        <UserProfile />
      </section>

      {/* Basic Footer */}
      <footer className="relative z-30 py-24 border-t border-gray-100 text-center flex flex-col items-center gap-6 bg-gray-50">
        <div className="flex items-center gap-2">
          <ChefHat size={32} className="text-orange-500" />
          <span className="text-3xl logo-font text-orange-500">Noodle Artistry</span>
        </div>
        <p className="text-gray-400 text-sm font-light max-w-md">
          A cinematic experience blending the art of cooking with modern technology. Explore our recipes, customize your journey, and taste the passion.
        </p>
        <div className="flex gap-8 text-gray-400 text-xs font-bold uppercase tracking-widest mt-4">
          <a href="#" className="hover:text-orange-500 transition-colors">Privacy</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Terms</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Contact</a>
        </div>
        <p className="text-gray-300 text-[10px] mt-8 font-light italic">
          &copy; 2024 Noodle Artistry. All images via Unsplash. Built with React & Framer Motion.
        </p>
      </footer>
    </main>
  );
};

export default App;

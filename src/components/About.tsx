import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const About: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress, scrollY } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const contentOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
    
    // Global Scroll Synchronization:
    const animEnd = vh * 5.8;
    const plateOpacity = useTransform(scrollY, [animEnd - 2, animEnd], [0, 1]);
    
    // Plate shadow only appears AFTER landing ( rukne ke baad )
    const shadowOpacity = useTransform(scrollY, [animEnd, animEnd + vh * 0.1], [0, 0.3]);

    return (
        <section 
            id="about" 
            ref={containerRef}
            style={{ marginTop: '-120vh' }}
            className="relative min-h-[160vh] w-full bg-white flex items-center justify-center px-6 md:px-12 py-60 overflow-hidden z-[110]"
        >
            {/* Background Narrative Element */}
            <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[35vw] font-black text-gray-900/[0.015] pointer-events-none select-none italic whitespace-nowrap"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
                CRAFTED SOUL
            </div>

            <div className="max-w-7xl mx-auto w-full relative z-10 px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                    
                    {/* LEFT: Clean Typography Column */}
                    <motion.div 
                        style={{ opacity: contentOpacity }}
                        className="relative"
                    >
                        <header className="mb-12">
                            <h3 className="text-orange-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4">Philosophy</h3>
                            <h2 className="text-6xl md:text-7xl text-gray-900 leading-tight tracking-tighter" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
                                Where Tradition <br />
                                <span className="italic text-gray-400">Meets Future</span>
                            </h2>
                        </header>

                        <div className="space-y-10 max-w-lg">
                            <p className="text-gray-500 text-xl font-light leading-relaxed italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                "At Noodle Artistry, we view every bowl as a canvas and every noodle as a brushstroke."
                            </p>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] leading-relaxed">
                                Bridging ancient culinary wisdom and modern digital expression. Pure artistry, delivered with intention.
                            </p>
                            
                            <div className="pt-12 grid grid-cols-3 gap-8 border-t border-gray-100">
                                <div>
                                    <div className="text-3xl text-gray-900 mb-1 font-serif" style={{ fontFamily: "'Cormorant Garamond', serif" }}>12</div>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-orange-500/50">Grains</div>
                                </div>
                                <div>
                                    <div className="text-3xl text-gray-900 mb-1 font-serif" style={{ fontFamily: "'Cormorant Garamond', serif" }}>48h</div>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-orange-500/50">Broth</div>
                                </div>
                                <div>
                                    <div className="text-3xl text-gray-900 mb-1 font-serif" style={{ fontFamily: "'Cormorant Garamond', serif" }}>01</div>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-orange-500/50">Vision</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT: Landing Zone */}
                    <motion.div 
                        style={{ opacity: contentOpacity }}
                        className="flex flex-col items-center"
                    >
                        <div className="relative group">
                            {/* Museum Landing Slot - EXACTLY 320px to match FloatingPlate */}
                            <div className="relative z-20 w-[320px] h-[320px]">
                                <div 
                                    id="plate-destination"
                                    className="w-full h-full rounded-full relative overflow-visible"
                                >
                                    {/* Landing Shadow - Appears AFTER plate sticks (rukne ke baad) */}
                                    <motion.div
                                        style={{ 
                                            opacity: shadowOpacity,
                                            scale: 0.9
                                        }}
                                        className="absolute inset-x-0 bottom-0 h-4 bg-black/40 blur-2xl rounded-[50%] translate-y-4"
                                    />

                                    {/* Handover Plate Image - 1.4x Balanced Zoom */}
                                    <motion.div
                                        style={{ 
                                            opacity: plateOpacity,
                                            scale: 0.85 
                                        }}
                                        className="w-full h-full flex items-center justify-center relative z-10"
                                    >
                                        <div className="w-[320px] h-[320px] rounded-full overflow-hidden border border-gray-100 bg-white shadow-sm flex items-center justify-center">
                                            <img
                                                src="/food-sequence/frame_119_delay-0.066s.png"
                                                alt="Signature Dish"
                                                className="w-full h-full object-cover"
                                                style={{
                                                    objectPosition: 'center 40%',
                                                    transform: 'scale(1.4)', // Balanced zoom
                                                    transformOrigin: 'center 40%',
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Floating Masterpiece text fixed to the right of section */}
                                <div className="absolute -right-20 top-1/2 -translate-y-1/2 rotate-90 whitespace-nowrap">
                                    <span className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-200">Current Masterpiece</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Floating Ornaments */}
            <motion.div 
                style={{ y }}
                className="absolute top-20 right-[15%] w-32 h-32 border border-orange-500/5 rounded-full blur-3xl" 
            />
            <motion.div 
                style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]) }}
                className="absolute bottom-40 left-[10%] w-64 h-64 bg-orange-500/[0.02] rounded-full blur-3xl" 
            />
        </section>
    );
};

export default About;

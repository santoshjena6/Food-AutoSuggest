import React, { useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from 'framer-motion';

const FloatingPlate: React.FC = () => {
    const { scrollY } = useScroll();
    
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
    
    const plateSize = 320;

    const slotVpX = useMotionValue(0);
    const slotVpY = useMotionValue(0);
    const [hasSlot, setHasSlot] = useState(false);

    useAnimationFrame(() => {
        const el = document.getElementById('plate-destination');
        if (!el) return;
        if (!hasSlot) setHasSlot(true);

        const rect = el.getBoundingClientRect();
        slotVpX.set(rect.left + rect.width / 2 - vw / 2);
        slotVpY.set(rect.top + rect.height / 2 - vh / 2);
    });

    // ─── Animation Progress ──────────────────────────────────────────────────
    // Start EXACTLY when video animation stops (500vh)
    const animStart = vh * 5.0;
    const animEnd   = vh * 5.8;

    const rawProgress = useTransform(scrollY, [animStart, animEnd], [0, 1], { clamp: true });
    // Ultra-snappy lift for zero latency feel
    const progress = useSpring(rawProgress, { stiffness: 180, damping: 30, mass: 1 });

    // ─── Transformation Logic ───────────────────────────────────────────────
    const x = useTransform([progress, slotVpX], ([p, sx]) => (p as number) * (sx as number));
    const y = useTransform([progress, slotVpY], ([p, sy]) => (p as number) * (sy as number));
    const scale = useTransform(progress, [0, 1], [1.1, 0.85]);

    // Handover Opacity: 
    // Wait until video stops (500vh). Fade out instantly at animEnd.
    const opacity = useTransform(
        scrollY,
        [vh * 5.0 - 5, vh * 5.0, animEnd - 0.5, animEnd],
        [0, 1, 1, 0]
    );

    // Cinematic tilts and spinning
    const rotateX = useTransform(progress, [0, 0.2, 1], [0, 25, 0]);
    const rotateY = useTransform(progress, [0, 0.2, 1], [0, -15, 0]);
    const rotateZ = useTransform(progress, [0, 1], [-45, 0]); // Subtle start rotation
    const rotate = useTransform(progress, [0, 1], [0, 360]); // Full spin animation
    const z = useTransform(progress, [0, 0.4, 1], [0, 250, 0]);

    return (
        <div
            className="fixed inset-0 pointer-events-none z-[120] flex items-center justify-center overflow-visible"
            style={{ perspective: 2000 }}
        >
            <motion.div
                style={{
                    opacity: hasSlot ? opacity : 0,
                    x,
                    y,
                    scale,
                    rotateX,
                    rotateY,
                    rotate,
                    z,
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Landing Shadow */}
                <motion.div 
                    style={{
                        opacity: useTransform(progress, [0.8, 0.98], [0, 0.35]),
                        y: 45,
                        scale: 0.9,
                        filter: 'blur(24px)',
                    }}
                    className="absolute inset-4 bg-black/40 rounded-full -z-10"
                />

                <div
                    style={{
                        width:        plateSize,
                        height:       plateSize,
                        borderRadius: '50%',
                        overflow:     'hidden',
                        boxShadow:    '0 40px 100px -20px rgba(0,0,0,0.35)',
                        backgroundColor: 'white' // Ensure white plate
                    }}
                >
                    <img
                        src="/food-sequence/frame_119_delay-0.066s.png"
                        alt="Signature Noodle Dish"
                        style={{
                            width:           '100%',
                            height:          '100%',
                            objectFit:       'cover',
                            objectPosition:  'center 40%',
                            transform:       'scale(1.4)', // Match 1.4x zoom
                            transformOrigin: 'center 40%',
                            display:         'block',
                        }}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default FloatingPlate;

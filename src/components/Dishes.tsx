import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';

interface Dish {
    id: number;
    name: string;
    description: string;
    shortDesc: string;
    rating: number;
    image: string;
    color: string;
}

const dishes: Dish[] = [
    {
        id: 1,
        name: "Zen Garden Ramen",
        description: "A meditative balance of slow-simmered shoyu broth, hand-pulled rye noodles, and charred seasonal greens. Each element is placed with singular intention.",
        shortDesc: "The Essence of Balance",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=1200",
        color: "orange"
    },
    {
        id: 2,
        name: "Velvet Chili Silk",
        description: "Infused with cold-pressed chili oil and toasted sesame, these artisanal noodles offer a complex, multi-layered heat that dances across the palate.",
        shortDesc: "A Sensation of Heat",
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=1200",
        color: "red"
    },
    {
        id: 3,
        name: "Harvest Umami Bowl",
        description: "Fragrant heirloom rice tossed with wild forest mushrooms, organic miso, and a hint of truffle oil. A tribute to the earth's deepest flavors.",
        shortDesc: "Deep Forest Notes",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=1200",
        color: "amber"
    }
];

const DishSpotlight: React.FC<{ dish: Dish, index: number }> = ({ dish, index }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.1]);
    const imageOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);
    const textY = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);
    const textOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0]);

    return (
        <div ref={sectionRef} className="h-screen w-full flex items-center justify-center sticky top-0 overflow-hidden">
            {/* Fullscreen Backdrop Image */}
            <motion.div 
                style={{ scale: imageScale, opacity: imageOpacity }}
                className="absolute inset-0 z-0"
            >
                <img 
                    src={dish.image} 
                    alt={dish.name} 
                    className="w-full h-full object-cover filter brightness-[0.4] contrast-[1.1]" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
            </motion.div>

            {/* Content Overlay */}
            <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row items-end justify-between h-full pb-32">
                <motion.div 
                    style={{ y: textY, opacity: textOpacity }}
                    className="max-w-2xl text-white"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px w-12 bg-orange-500" />
                        <span className="text-xs font-bold uppercase tracking-[0.5em] text-orange-500">{dish.shortDesc}</span>
                    </div>
                    
                    <h2 className="text-7xl md:text-9xl mb-8 leading-none tracking-tighter" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {dish.name}
                    </h2>
                    
                    <p className="text-white/60 text-xl font-light italic leading-relaxed mb-12 max-w-lg" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        "{dish.description}"
                    </p>

                    <button className="flex items-center gap-6 group">
                        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-500">
                            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80 group-hover:text-white transition-colors">Experience Masterpiece</span>
                    </button>
                </motion.div>

                <motion.div 
                    style={{ opacity: textOpacity }}
                    className="hidden md:flex flex-col items-end text-white/40"
                >
                    <div className="text-8xl font-black mb-4 opacity-10 leading-none">0{index + 1}</div>
                    <div className="flex items-center gap-2">
                        <Star size={16} className="text-orange-500 fill-orange-500" />
                        <span className="text-sm font-bold tracking-widest text-white">{dish.rating} / 5.0</span>
                    </div>
                </motion.div>
            </div>

            {/* Visual Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-20 noise-bg" />
        </div>
    );
};

const Dishes: React.FC = () => {
    return (
        <div id="dishes" className="relative z-20 bg-black">
            {/* Selection Header */}
            <div className="bg-white py-40 px-6 text-center border-b border-gray-100">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-orange-500 text-xs font-bold uppercase tracking-[0.6em] mb-8">Curated Series</h3>
                    <h2 className="text-7xl md:text-8xl text-gray-900 mb-12 tracking-tighter" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Signature Showcase
                    </h2>
                    <div className="w-px h-24 bg-gray-200 mx-auto" />
                </motion.div>
            </div>

            {/* Spotlight Reel */}
            <div className="relative">
                {dishes.map((dish, index) => (
                    <DishSpotlight key={dish.id} dish={dish} index={index} />
                ))}
            </div>

            {/* Ending Transition */}
            <div className="h-[50vh] bg-black flex items-center justify-center overflow-hidden">
                <div className="atmospheric-text text-white opacity-5 text-[20vw] italic pointer-events-none select-none">
                    ENDLESS
                </div>
            </div>
        </div>
    );
};

export default Dishes;

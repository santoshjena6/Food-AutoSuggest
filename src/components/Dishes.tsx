import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Dish {
    id: number;
    name: string;
    description: string;
    rating: number;
    image: string;
}

const dishes: Dish[] = [
    {
        id: 1,
        name: "Veg Noodles",
        description: "Classic stir-fried noodles with crisp seasonal vegetables.",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        name: "Chili Garlic Noodles",
        description: "Spicy and aromatic noodles infused with roasted garlic and chili oil.",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        name: "Fried Rice",
        description: "Fragrant jasmine rice tossed with fresh greens and savory soy sauce.",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 4,
        name: "Vegetable Stir Fry",
        description: "A colorful medley of garden-fresh vegetables in a light ginger glaze.",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800"
    }
];

const Dishes: React.FC = () => {
    return (
        <div className="relative z-20 w-full bg-white py-32 px-6 md:px-12 overflow-hidden">
            {/* Atmospheric Background Element */}
            <div className="atmospheric-text -top-20 -left-20 opacity-[0.03]">
                CRAFT
            </div>
            <div className="atmospheric-text -bottom-20 -right-20 opacity-[0.03]">
                KITCHEN
            </div>

            <div className="max-w-wide mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-24 text-center"
                >
                    <h2 className="text-5xl md:text-7xl mb-6 tracking-tight text-gray-900" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
                        Signature Creations
                    </h2>
                    <div className="w-20 h-[1px] bg-orange-500 mx-auto mb-8 opacity-50" />
                    <p className="text-gray-400 text-xl md:text-2xl font-light italic tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        A curated selection of cinematic culinary art.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-12">
                    {dishes.map((dish, index) => (
                        <motion.div
                            key={dish.id}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.15, ease: [0.19, 1, 0.22, 1] }}
                            viewport={{ once: true, margin: "-50px" }}
                            className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col h-full group hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={dish.image}
                                    alt={dish.name}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                    <Star size={12} className="text-orange-500 fill-orange-500" />
                                    <span className="text-xs font-bold text-gray-800">{dish.rating}</span>
                                </div>
                            </div>
                            <div className="p-8 flex flex-col flex-grow bg-white">
                                <h3 className="text-2xl mb-3 tracking-tight text-gray-900" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
                                    {dish.name}
                                </h3>
                                <p className="text-gray-400 text-sm font-light leading-relaxed mb-8">
                                    {dish.description}
                                </p>
                                <div className="mt-auto">
                                    <button className="w-full py-3.5 rounded-full bg-white text-gray-900 border border-gray-100 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-500 font-bold text-xs uppercase tracking-[0.2em]">
                                        Explore Taste
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dishes;

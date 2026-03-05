import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, BarChart } from 'lucide-react';
import StarRating from './StarRating';

interface Review {
    name: string;
    comment: string;
    rating: number;
}

interface Recipe {
    id: number;
    name: string;
    mealType: string;
    diet: string;
    cuisine: string;
    cookTime: number;
    rating: number;
    image: string;
    prepTime: string;
    difficulty: string;
    nutrition?: {
        calories: string;
        protein: string;
        carbs: string;
        fat: string;
    };
    ingredients: string[];
    instructions: string[];
    reviews?: Review[];
}

interface RecipeDetailsProps {
    recipe: Recipe | null;
    onClose: () => void;
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({ recipe, onClose }) => {
    const [localReviews, setLocalReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState({ name: '', comment: '', rating: 5 });
    const [userRating, setUserRating] = useState<number>(0);
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {
        const savedProfile = localStorage.getItem("userProfile");
        if (savedProfile) setUserProfile(JSON.parse(savedProfile));

        if (recipe) {
            // Merge hardcoded reviews with localStorage reviews
            const savedReviews = localStorage.getItem(`reviews_${recipe.id}`);
            const localStored = savedReviews ? JSON.parse(savedReviews) : [];
            setLocalReviews([...(recipe.reviews || []), ...localStored]);

            const savedRating = localStorage.getItem(`rating_${recipe.id}`);
            if (savedRating) setUserRating(Number(savedRating));
        }
    }, [recipe]);

    const getSkillMatch = () => {
        if (!recipe || !userProfile) return null;
        const levels: Record<string, number> = { "Novice": 1, "Intermediate": 2, "Master Chef": 3 };
        const recipeLvls: Record<string, number> = { "Easy": 1, "Medium": 2, "Hard": 3 };

        const userVal = levels[userProfile.cookingLevel] || 1;
        const recipeVal = recipeLvls[recipe.difficulty] || 1;

        if (userVal >= recipeVal) return "Perfect Match";
        if (userVal === recipeVal - 1) return "Challenge Mode";
        return "Advanced Project";
    };

    const handleAddReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReview.name || !newReview.comment || !recipe) return;

        const updatedLocal = [...(JSON.parse(localStorage.getItem(`reviews_${recipe.id}`) || '[]')), newReview];
        localStorage.setItem(`reviews_${recipe.id}`, JSON.stringify(updatedLocal));
        setLocalReviews([...(recipe.reviews || []), ...updatedLocal]);
        setNewReview({ name: '', comment: '', rating: 5 });
    };

    const handleRate = (rating: number) => {
        if (!recipe) return;
        setUserRating(rating);
        localStorage.setItem(`rating_${recipe.id}`, rating.toString());
    };

    if (!recipe) return null;

    const skillMatch = getSkillMatch();

    return (
        <AnimatePresence>
            {recipe && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-white/40 backdrop-blur-2xl"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white border border-gray-100 shadow-[0_32px_128px_rgba(0,0,0,0.1)] rounded-[3rem] p-8 md:p-16 scrollbar-hide"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-10 right-10 p-3 hover:bg-gray-100 rounded-full transition-all group"
                        >
                            <X size={24} className="text-gray-400 group-hover:text-gray-900 group-hover:rotate-90 transition-transform" />
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                            {/* Left Column: Visuals & Nutrition (5 cols) */}
                            <div className="lg:col-span-5 space-y-12">
                                <div className="rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-2xl relative group">
                                    <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                    {skillMatch && (
                                        <div className="absolute bottom-6 left-6 bg-white/20 backdrop-blur-xl border border-white/30 text-white text-[9px] font-bold px-4 py-2 rounded-full uppercase tracking-widest">
                                            {skillMatch}
                                        </div>
                                    )}
                                </div>

                                {recipe.nutrition && (
                                    <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100">
                                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-8 flex items-center gap-2">
                                            <BarChart size={14} className="text-orange-500" /> Nutritional Narrative
                                        </h3>
                                        <div className="grid grid-cols-2 gap-8">
                                            {Object.entries(recipe.nutrition).map(([key, value]) => (
                                                <div key={key} className="flex flex-col">
                                                    <span className="text-[10px] uppercase font-bold text-gray-300 tracking-widest mb-1">{key}</span>
                                                    <span className="text-3xl text-gray-900 font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-xl mb-6 text-gray-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Essence of Ingredients</h3>
                                    <ul className="space-y-4">
                                        {recipe.ingredients.map((ing, i) => (
                                            <li key={i} className="flex items-center gap-4 text-gray-500 font-light text-sm italic">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500/30" />
                                                <span>{ing}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Right Column: Narrative & Interaction (7 cols) */}
                            <div className="lg:col-span-7 flex flex-col">
                                <header className="mb-16">
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="text-[10px] bg-gray-900 text-white px-4 py-1.5 rounded-full font-bold uppercase tracking-widest">{recipe.cuisine}</span>
                                        <span className="text-[10px] border border-gray-100 text-gray-400 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest">{recipe.diet}</span>
                                        <div className="flex items-center gap-2 text-orange-500 text-[10px] font-bold uppercase tracking-widest ml-auto">
                                            <Clock size={14} /> {recipe.cookTime} MINS • {recipe.difficulty}
                                        </div>
                                    </div>
                                    <h2 className="text-6xl md:text-7xl mb-8 tracking-tight text-gray-900 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>{recipe.name}</h2>
                                    <div className="flex flex-wrap items-center gap-10">
                                        <div className="flex items-center gap-4">
                                            <StarRating rating={recipe.rating} />
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Studio Average</span>
                                        </div>
                                        <div className="flex items-center gap-5 px-8 py-4 bg-gray-50 rounded-full border border-gray-100">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Personal Rating</span>
                                            <StarRating rating={userRating || 0} interactive onRate={handleRate} />
                                        </div>
                                    </div>
                                </header>

                                <div className="space-y-12 mb-16">
                                    <div>
                                        <h3 className="text-xl mb-8 text-gray-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Methodic Steps</h3>
                                        <div className="space-y-8">
                                            {recipe.instructions.map((step, i) => (
                                                <div key={i} className="flex gap-6 group">
                                                    <span className="flex-shrink-0 text-3xl text-orange-200 font-serif italic transition-colors group-hover:text-orange-500 duration-500">
                                                        {String(i + 1).padStart(2, '0')}
                                                    </span>
                                                    <p className="text-gray-500 leading-relaxed font-light text-sm pt-2 italic">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Review Vault */}
                                <div className="mt-auto pt-16 border-t border-gray-50">
                                    <h3 className="text-xl mb-8 text-gray-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Member Impressions ({localReviews.length})</h3>

                                    <div className="space-y-6 mb-10 max-h-80 overflow-y-auto pr-4 scrollbar-hide">
                                        {localReviews.map((rev, i) => (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                key={i}
                                                className="p-6 bg-white border border-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-all"
                                            >
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">{rev.name}</span>
                                                    <StarRating rating={rev.rating} />
                                                </div>
                                                <p className="text-gray-400 text-sm italic font-light leading-relaxed">"{rev.comment}"</p>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <form onSubmit={handleAddReview} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Your Identity"
                                                value={newReview.name}
                                                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                                className="w-full bg-gray-50 border border-transparent rounded-full py-4 px-8 text-xs focus:outline-none focus:bg-white focus:border-orange-500 transition-all font-light"
                                            />
                                            <div className="flex items-center gap-4 px-6 bg-gray-50 rounded-full">
                                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Rating</span>
                                                <StarRating rating={newReview.rating} interactive onRate={(r) => setNewReview({ ...newReview, rating: r })} />
                                            </div>
                                        </div>
                                        <textarea
                                            placeholder="Document your experience..."
                                            rows={2}
                                            value={newReview.comment}
                                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                            className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] py-4 px-8 text-xs focus:outline-none focus:bg-white focus:border-orange-500 transition-all font-light resize-none"
                                        />
                                        <button
                                            type="submit"
                                            className="w-full py-4 bg-orange-500 text-white rounded-full font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95"
                                        >
                                            Broadcast Impression
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RecipeDetails;

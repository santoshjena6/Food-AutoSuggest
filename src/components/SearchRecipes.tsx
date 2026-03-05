import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, Clock } from 'lucide-react';
import recipesData from '../data/recipes.json';
import RecipeDetails from './RecipeDetails';

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
    ingredients: string[];
    instructions: string[];
    nutrition?: {
        calories: string;
        protein: string;
        carbs: string;
        fat: string;
    };
    reviews?: { name: string; comment: string; rating: number; }[];
}

const mealTypes = ["All", "Breakfast", "Lunch", "Dinner"];
const diets = ["All", "Vegetarian", "Vegan", "Gluten-Free"];
const cuisines = ["All", "Indian", "Chinese", "Continental"];
const timeLimits = [
    { label: "Any Time", value: 999 },
    { label: "< 15m", value: 15 },
    { label: "< 30m", value: 30 },
    { label: "< 45m", value: 45 }
];

const FilterButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] transition-all border ${active
            ? 'bg-orange-500 border-orange-500 text-white shadow-xl shadow-orange-500/20'
            : 'bg-white border-gray-100 text-gray-400 hover:border-orange-500 hover:text-orange-500'
            }`}
    >
        {children}
    </button>
);

const SearchRecipes: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchMode, setSearchMode] = useState<"Name" | "Fridge">("Name");
    const [selectedMealType, setSelectedMealType] = useState("All");
    const [selectedDiet, setSelectedDiet] = useState("All");
    const [selectedCuisine, setSelectedCuisine] = useState("All");
    const [selectedTimeLimit, setSelectedTimeLimit] = useState(999);
    const [avoidedIngredients, setAvoidedIngredients] = useState<string[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [userProfile, setUserProfile] = useState<any>(null);

    useEffect(() => {
        const savedProfile = localStorage.getItem("userProfile");
        if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            setUserProfile(profile);
            if (profile.avoidedIngredients) {
                const profileAvoids = profile.avoidedIngredients.split(',').map((s: string) => s.trim()).filter((s: string) => s);
                setAvoidedIngredients(prev => Array.from(new Set([...prev, ...profileAvoids])));
            }
        }
    }, []);

    const filteredRecipes = useMemo(() => {
        return (recipesData as Recipe[]).filter(recipe => {
            let matchesSearch = false;
            const normalizedQuery = searchQuery.trim().toLowerCase();

            if (searchMode === "Name") {
                matchesSearch = recipe.name.toLowerCase().includes(normalizedQuery);
            } else {
                const availableIngredients = normalizedQuery.split(',').map(s => s.trim()).filter(s => s);
                if (availableIngredients.length === 0) {
                    matchesSearch = true;
                } else {
                    matchesSearch = availableIngredients.some(avail =>
                        recipe.ingredients.some(ing => {
                            const normalizedIng = ing.toLowerCase();
                            return normalizedIng.includes(avail) || avail.includes(normalizedIng) ||
                                (avail.length > 3 && normalizedIng.startsWith(avail.substring(0, 4)));
                        })
                    );
                }
            }

            const matchesMeal = selectedMealType === "All" || recipe.mealType === selectedMealType;
            const matchesDiet = selectedDiet === "All" || recipe.diet === selectedDiet;
            const matchesCuisine = selectedCuisine === "All" || recipe.cuisine === selectedCuisine;
            const matchesTime = (recipe.cookTime || 0) <= selectedTimeLimit;

            const hasAvoided = avoidedIngredients.some(avoid =>
                recipe.ingredients.some(ing => ing.toLowerCase().includes(avoid.toLowerCase()))
            );

            return matchesSearch && matchesMeal && matchesDiet && matchesCuisine && matchesTime && !hasAvoided;
        });
    }, [searchQuery, searchMode, selectedMealType, selectedDiet, selectedCuisine, selectedTimeLimit, avoidedIngredients]);

    const hasFilterConflict = useMemo(() => {
        if (filteredRecipes.length > 0 || !searchQuery) return false;
        return (recipesData as Recipe[]).some(recipe => {
            const normalizedQuery = searchQuery.trim().toLowerCase();
            let matchesSearch = false;
            if (searchMode === "Name") {
                matchesSearch = recipe.name.toLowerCase().includes(normalizedQuery);
            } else {
                const availableIngredients = normalizedQuery.split(',').map(s => s.trim()).filter(s => s);
                matchesSearch = availableIngredients.some(avail =>
                    recipe.ingredients.some(ing => ing.toLowerCase().includes(avail) || (avail.length > 3 && ing.toLowerCase().startsWith(avail.substring(0, 4))))
                );
            }
            return matchesSearch;
        });
    }, [filteredRecipes, searchQuery, searchMode]);

    const isRecommended = (recipe: Recipe) => {
        if (!userProfile?.dietPreference) return false;
        return recipe.diet === userProfile.dietPreference;
    };

    return (
        <div id="recipe-search" className="w-full bg-white py-12 px-6 md:px-12 relative overflow-hidden">
            {/* Atmospheric Depth Layers */}
            <div className="atmospheric-text top-0 -left-64 opacity-[0.015] pointer-events-none select-none">
                STUDIO
            </div>
            <div className="atmospheric-text bottom-0 -right-64 opacity-[0.015] pointer-events-none select-none" style={{ fontSize: '15rem' }}>
                CUISINE
            </div>

            <div className="max-w-wide mx-auto relative z-10">
                <header className="relative z-10 mb-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-4 mb-6 justify-center">
                            <button
                                onClick={() => setSearchMode("Name")}
                                className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${searchMode === "Name" ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20' : 'bg-gray-50 text-gray-400 hover:text-orange-500'}`}
                            >
                                Search by Name
                            </button>
                            <button
                                onClick={() => setSearchMode("Fridge")}
                                className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${searchMode === "Fridge" ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20' : 'bg-gray-50 text-gray-400 hover:text-orange-500'}`}
                            >
                                Fridge Mode
                            </button>
                        </div>
                        <h2 className="text-5xl md:text-6xl mb-4 tracking-tighter text-gray-900" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
                            Gourmet Studio
                        </h2>
                        <div className="w-12 h-px bg-orange-500/30 mx-auto mb-6" />
                        <p className="text-gray-400 text-sm font-light uppercase tracking-[0.4em] mb-10">Recipe Discovery Hub</p>

                        <div className="relative group max-w-2xl mx-auto">
                            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={24} />
                            <input
                                type="text"
                                placeholder={searchMode === "Name" ? "Search our signature library..." : "List ingredients (e.g. Poha, Chili, Paneer)..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-gray-100 rounded-full py-6 pl-16 pr-10 text-lg text-black focus:outline-none focus:border-orange-500 transition-all font-light placeholder:text-gray-300 shadow-sm"
                            />
                        </div>
                    </motion.div>
                </header>

                {/* Advanced Multi-Filter Control Center */}
                <div className="noise-texture premium-glass hover-glow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 p-6 rounded-[2rem] border-orange-500/10 shadow-xl">
                    <div className="radial-glow absolute inset-0 rounded-[2rem] pointer-events-none" />
                    <div className="space-y-4">
                        <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 px-4">Cuisine Art</label>
                        <div className="flex flex-wrap gap-1.5">
                            {cuisines.map(c => (
                                <FilterButton key={c} active={selectedCuisine === c} onClick={() => setSelectedCuisine(c)}>{c}</FilterButton>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 px-4">Meal Course</label>
                        <div className="flex flex-wrap gap-1.5">
                            {mealTypes.map(m => (
                                <FilterButton key={m} active={selectedMealType === m} onClick={() => setSelectedMealType(m)}>{m}</FilterButton>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 px-4">Time Investment</label>
                        <div className="flex flex-wrap gap-1.5">
                            {timeLimits.map(t => (
                                <FilterButton key={t.label} active={selectedTimeLimit === t.value} onClick={() => setSelectedTimeLimit(t.value)}>{t.label}</FilterButton>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 px-4">Dietary Ethos</label>
                        <div className="flex flex-wrap gap-1.5">
                            {diets.map(d => (
                                <FilterButton key={d} active={selectedDiet === d} onClick={() => setSelectedDiet(d)}>{d}</FilterButton>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Smart Pantry (compact) */}
                <div className="mb-8 flex flex-wrap items-center gap-3 px-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 whitespace-nowrap">Smart Pantry (Avoid):</span>
                    <div className="flex-1 flex flex-wrap gap-2 items-center bg-gray-50 rounded-full border border-gray-100 px-5 py-2">
                        <input
                            type="text"
                            placeholder="Type item and press Enter to exclude..."
                            className="flex-grow bg-transparent border-none focus:outline-none text-xs font-light italic text-gray-500 placeholder:text-gray-300"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const val = e.currentTarget.value.trim();
                                    if (val && !avoidedIngredients.includes(val)) {
                                        setAvoidedIngredients([...avoidedIngredients, val]);
                                        e.currentTarget.value = "";
                                    }
                                }
                            }}
                        />
                        {avoidedIngredients.map(ing => (
                            <span key={ing} className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                {ing} <button onClick={() => setAvoidedIngredients(avoidedIngredients.filter(a => a !== ing))} className="hover:text-white/70">×</button>
                            </span>
                        ))}
                    </div>
                </div>

                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 lg:gap-14"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredRecipes.map((recipe, index) => (
                            <motion.div
                                key={recipe.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.6, delay: index * 0.05 }}
                                whileHover={{ y: -16 }}
                                onClick={() => setSelectedRecipe(recipe)}
                                className="bg-white group rounded-[2.5rem] overflow-hidden flex flex-col h-full transition-all duration-500 cursor-pointer shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border border-gray-100"
                            >
                                {isRecommended(recipe) && (
                                    <div className="absolute top-8 left-8 z-20 bg-orange-600 text-white text-[10px] font-black px-5 py-2 rounded-full shadow-2xl uppercase tracking-[0.2em] transform -rotate-1">
                                        Signature Tailored
                                    </div>
                                )}

                                {/* Image Pedestal */}
                                <div className="p-4 bg-gray-50/50">
                                    <div className="relative h-72 rounded-[2rem] overflow-hidden shadow-inner group-hover:shadow-2xl transition-all duration-500">
                                        <img
                                            src={recipe.image}
                                            alt={recipe.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

                                        <div className="absolute top-6 right-6">
                                            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2">
                                                <Clock size={14} className="text-orange-600" />
                                                <span className="text-[11px] font-black text-gray-900">{recipe.cookTime}m</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Narrative */}
                                <div className="p-10 flex flex-col flex-grow bg-white relative">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600/80">
                                            {recipe.cuisine} • {recipe.mealType}
                                        </span>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-3xl md:text-3.5xl text-gray-900 leading-tight group-hover:text-orange-600 transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
                                            {recipe.name}
                                        </h3>
                                        <div className="h-px w-8 bg-orange-500/20 mt-3 group-hover:w-full transition-all duration-700" />
                                    </div>

                                    <div className="mb-10 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Core Essence</span>
                                            <span className="text-[11px] font-bold text-gray-300">Target: {recipe.difficulty}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {recipe.ingredients.slice(0, 3).map((ing, i) => (
                                                <span key={i} className="px-4 py-2 rounded-xl bg-orange-50 text-orange-700 text-[11px] font-black uppercase tracking-widest border border-orange-100/50">
                                                    {ing}
                                                </span>
                                            ))}
                                            {recipe.ingredients.length > 3 && (
                                                <span className="px-4 py-2 rounded-xl bg-gray-50 text-gray-400 text-[11px] font-bold">
                                                    +{recipe.ingredients.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-8 border-t border-gray-100 flex items-center justify-between group/action">
                                        <span className="text-xs font-black uppercase tracking-[0.25em] text-gray-900 group-hover/action:text-orange-600 transition-colors">Manifest Artistry</span>
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover/action:bg-orange-600 group-hover/action:text-white transition-all duration-500">
                                            <ChevronRight size={18} className="translate-x-0 group-hover/action:translate-x-1" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredRecipes.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-32 flex flex-col items-center text-center"
                    >
                        <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-12 relative">
                            <Search size={40} className="text-gray-200" />
                            <div className="absolute inset-0 border border-dashed border-gray-200 rounded-full animate-spin-slow" />
                        </div>
                        <h3 className="text-4xl md:text-5xl text-gray-900 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            The Studio is Silent
                        </h3>
                        <p className="text-gray-400 max-w-sm mb-12 italic text-lg">
                            {hasFilterConflict
                                ? "We found a match, but your active filters are hiding it."
                                : "No culinary narratives match your current palette."}
                        </p>
                        <div className="flex flex-col items-center gap-4">
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedMealType("All");
                                    setSelectedDiet("All");
                                    setSelectedCuisine("All");
                                    setSelectedTimeLimit(999);
                                    setAvoidedIngredients([]);
                                }}
                                className="group relative px-12 py-5 bg-gray-900 text-white rounded-full font-bold uppercase tracking-[0.3em] text-[10px] overflow-hidden transition-all hover:pr-16 shadow-2xl"
                            >
                                <span className="relative z-10">Reset Studio</span>
                                <div className="absolute right-0 top-0 bottom-0 w-12 bg-orange-500 translate-x-full group-hover:translate-x-0 transition-transform duration-500 flex items-center justify-center">
                                    <ChevronRight size={16} />
                                </div>
                            </button>
                            {hasFilterConflict && (
                                <button
                                    onClick={() => {
                                        setSelectedMealType("All");
                                        setSelectedDiet("All");
                                        setSelectedCuisine("All");
                                        setSelectedTimeLimit(999);
                                    }}
                                    className="text-orange-500 text-[9px] font-bold uppercase tracking-widest hover:underline"
                                >
                                    Clear Active Filters only
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>

            <RecipeDetails
                recipe={selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
            />
        </div>
    );
};

export default SearchRecipes;

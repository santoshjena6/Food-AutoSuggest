import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutGrid, ChevronRight, Clock } from 'lucide-react';
import recipesData from '../data/recipes.json';
import StarRating from './StarRating';
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
                            // Flexible matching: check if either contains the other 
                            // or if they are very similar (basic robustness)
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
        // Check if the recipe exists but is hidden by other filters
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
            <div className="atmospheric-text top-0 -left-64 opacity-5 pointer-events-none select-none">
                STUDIO
            </div>
            <div className="atmospheric-text bottom-0 -right-64 opacity-5 pointer-events-none select-none" style={{ fontSize: '15rem' }}>
                CUISINE
            </div>

            <div className="max-w-wide mx-auto relative z-10">
                <header className="relative z-10 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-8"
                    >
                        <div className="flex-1 max-w-2xl">
                            <h2 className="text-6xl md:text-7xl mb-10 tracking-tight text-gray-900" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
                                Gourmet Studio
                            </h2>
                            <div className="flex items-center gap-4 mb-6">
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
                                    What's in my fridge?
                                </button>
                            </div>
                            <div className="relative group">
                                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={24} />
                                <input
                                    type="text"
                                    placeholder={searchMode === "Name" ? "Search our signature library..." : "List ingredients (e.g. Poha, Chili, Paneer)..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white border border-gray-100 rounded-full py-6 pl-16 pr-10 text-lg text-black focus:outline-none focus:border-orange-500 transition-all font-light placeholder:text-gray-300 shadow-sm"
                                />
                            </div>
                        </div>
                    </motion.div>
                </header>

                {/* Advanced Multi-Filter Control Center */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6 p-6 bg-gray-50/30 backdrop-blur-md rounded-[2rem] border border-gray-100/50 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.05)]">
                    <div className="space-y-4">
                        <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-400 px-4">Cuisine Art</label>
                        <div className="flex flex-wrap gap-1.5">
                            {cuisines.map(c => (
                                <FilterButton key={c} active={selectedCuisine === c} onClick={() => setSelectedCuisine(c)}>{c}</FilterButton>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-400 px-4">Meal Course</label>
                        <div className="flex flex-wrap gap-1.5">
                            {mealTypes.map(m => (
                                <FilterButton key={m} active={selectedMealType === m} onClick={() => setSelectedMealType(m)}>{m}</FilterButton>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-400 px-4">Time Investment</label>
                        <div className="flex flex-wrap gap-1.5">
                            {timeLimits.map(t => (
                                <FilterButton key={t.label} active={selectedTimeLimit === t.value} onClick={() => setSelectedTimeLimit(t.value)}>{t.label}</FilterButton>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-400 px-4">Dietary Ethos</label>
                        <div className="flex flex-wrap gap-1.5">
                            {diets.map(d => (
                                <FilterButton key={d} active={selectedDiet === d} onClick={() => setSelectedDiet(d)}>{d}</FilterButton>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Smart Pantry (compact) */}
                <div className="mb-6 flex flex-wrap items-center gap-3 px-2">
                    <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-gray-400 whitespace-nowrap">Smart Pantry (Avoid):</span>
                    <div className="flex-1 flex flex-wrap gap-2 items-center bg-gray-50 rounded-full border border-gray-100 px-5 py-2">
                        <input
                            type="text"
                            placeholder="Type item and press Enter to exclude..."
                            className="flex-grow bg-transparent border-none focus:outline-none text-[11px] font-light italic text-gray-500 placeholder:text-gray-300"
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
                            <span key={ing} className="bg-orange-500 text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                {ing} <button onClick={() => setAvoidedIngredients(avoidedIngredients.filter(a => a !== ing))} className="hover:text-white/70">×</button>
                            </span>
                        ))}
                    </div>
                </div>

                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 lg:gap-16"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredRecipes.map((recipe, index) => (
                            <motion.div
                                layout
                                key={recipe.id}
                                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 1, delay: index * 0.05, ease: [0.19, 1, 0.22, 1] }}
                                whileHover={{ y: -16 }}
                                onClick={() => setSelectedRecipe(recipe)}
                                className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden flex flex-col h-full group hover:shadow-[0_64px_128px_rgba(0,0,0,0.07)] transition-all duration-1000 cursor-pointer"
                            >
                                {isRecommended(recipe) && (
                                    <div className="absolute top-8 left-8 z-20 bg-orange-500 text-white text-[10px] font-bold px-5 py-2.5 rounded-full shadow-2xl uppercase tracking-[0.25em] transform -rotate-2">
                                        Signature Match
                                    </div>
                                )}

                                <div className="relative h-96 overflow-hidden">
                                    <img
                                        src={recipe.image}
                                        alt={recipe.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-95 group-hover:opacity-100 transition-opacity duration-700" />
                                    <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                                        <div>
                                            <div className="flex items-center gap-4 mb-4">
                                                <span className="text-[10px] text-white/90 font-bold uppercase tracking-[0.25em] bg-white/15 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-full text-center">
                                                    {recipe.cuisine}
                                                </span>
                                                <span className="text-[10px] text-orange-400 font-bold uppercase tracking-[0.25em]">
                                                    {recipe.mealType}
                                                </span>
                                            </div>
                                            <h3 className="text-5xl tracking-tight text-white mb-3 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
                                                {recipe.name}
                                            </h3>
                                            <div className="flex items-center gap-5">
                                                <StarRating rating={recipe.rating} />
                                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{recipe.reviews?.length || 0} REVIEWS</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-12 flex flex-col flex-grow">
                                    <div className="flex flex-wrap items-center gap-x-10 gap-y-5 text-gray-400 text-[10px] mb-12">
                                        <span className="flex items-center gap-3 tracking-[0.2em] uppercase font-bold text-gray-900 bg-gray-50 px-4 py-2 rounded-full">
                                            <LayoutGrid size={15} className="text-orange-500" /> {recipe.diet}
                                        </span>
                                        <span className="flex items-center gap-3 tracking-[0.2em] uppercase font-bold text-gray-500">
                                            <Clock size={15} className="text-orange-500" /> {recipe.cookTime} MINS
                                        </span>
                                        <span className="flex items-center gap-3 tracking-[0.2em] uppercase font-bold text-gray-300">
                                            {recipe.difficulty}
                                        </span>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="flex items-center justify-between group/btn">
                                            <div className="space-y-1.5">
                                                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.35em] block opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 text-center">Discover</span>
                                                <span className="text-xs font-bold text-gray-900 uppercase tracking-[0.25em] block text-center">Explore Creation</span>
                                            </div>
                                            <div className="w-16 h-16 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 group-hover:shadow-[0_20px_40px_rgba(249,115,22,0.3)] transition-all duration-700">
                                                <ChevronRight size={26} className="transition-transform duration-500 group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredRecipes.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="py-40 text-center"
                    >
                        <div className="text-orange-500/20 mb-8 flex justify-center">
                            <Search size={80} strokeWidth={0.5} />
                        </div>
                        <p className="text-gray-400 text-3xl font-light italic mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
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

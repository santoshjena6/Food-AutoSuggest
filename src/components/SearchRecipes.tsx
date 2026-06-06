import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Search, Clock, ChevronRight, Star, Flame, Filter } from 'lucide-react';
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
    nutrition?: { calories: string; protein: string; carbs: string; fat: string; };
    reviews?: { name: string; comment: string; rating: number; }[];
}

const mealTypes = ["All", "Breakfast", "Lunch", "Dinner"];
const diets = ["All", "Vegetarian", "Vegan", "Gluten-Free"];
const cuisines = ["All", "Indian", "Chinese", "Continental"];
const timeLimits = [
    { label: "Any", value: 999 },
    { label: "< 15m", value: 15 },
    { label: "< 30m", value: 30 },
    { label: "< 45m", value: 45 }
];

// 3D Tilt card with light theme
const TiltCard: React.FC<{ recipe: Recipe; onClick: () => void; index: number }> = ({ recipe, onClick, index }) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: index * 0.06 }}
            viewport={{ once: true }}
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            onClick={onClick}
            style={{ perspective: 1000 }}
            className="cursor-pointer group"
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.15)] transition-shadow duration-500"
            >
                {/* Image */}
                <div className="relative h-56 overflow-hidden" style={{ transform: 'translateZ(0px)' }}>
                    <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-md text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 px-3 py-1.5 rounded-full shadow-sm">
                            {recipe.cuisine}
                        </span>
                    </div>
                    <div className="absolute top-4 right-4">
                        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                            <Clock size={11} className="text-orange-500" />
                            <span className="text-[10px] font-black text-gray-800">{recipe.cookTime}m</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-7" style={{ transform: 'translateZ(15px)' }}>
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-orange-500 mb-2">{recipe.mealType} • {recipe.difficulty}</div>
                            <h3 className="text-xl text-gray-900 leading-snug group-hover:text-orange-600 transition-colors duration-300"
                                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
                                {recipe.name}
                            </h3>
                        </div>
                        <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                            <Star size={12} className="text-orange-400 fill-orange-400" />
                            <span className="text-xs font-black text-gray-700">{recipe.rating}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                        {recipe.ingredients.slice(0, 3).map((ing, i) => (
                            <span key={i} className="text-[9px] font-bold uppercase tracking-wide text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                                {ing}
                            </span>
                        ))}
                        {recipe.ingredients.length > 3 && (
                            <span className="text-[9px] text-gray-300 px-2 py-1">+{recipe.ingredients.length - 3}</span>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-orange-500 transition-colors">Explore</span>
                        <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-400">
                            <ChevronRight size={14} className="text-gray-400 group-hover:text-white transition-colors" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const FilterBtn: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.18em] transition-all duration-300 border ${active
            ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200'
            : 'bg-white border-gray-100 text-gray-400 hover:border-orange-300 hover:text-orange-500'
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
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const avoidedIngredients: string[] = [];

    const filteredRecipes = useMemo(() => {
        return (recipesData as Recipe[]).filter(recipe => {
            const q = searchQuery.trim().toLowerCase();
            let matchesSearch = searchMode === "Name"
                ? recipe.name.toLowerCase().includes(q)
                : !q || q.split(',').map(s => s.trim()).some(a => recipe.ingredients.some(i => i.toLowerCase().includes(a)));
            const matchesMeal = selectedMealType === "All" || recipe.mealType === selectedMealType;
            const matchesDiet = selectedDiet === "All" || recipe.diet === selectedDiet;
            const matchesCuisine = selectedCuisine === "All" || recipe.cuisine === selectedCuisine;
            const matchesTime = (recipe.cookTime || 0) <= selectedTimeLimit;
            const hasAvoided = avoidedIngredients.some(a => recipe.ingredients.some(i => i.toLowerCase().includes(a.toLowerCase())));
            return matchesSearch && matchesMeal && matchesDiet && matchesCuisine && matchesTime && !hasAvoided;
        });
    }, [searchQuery, searchMode, selectedMealType, selectedDiet, selectedCuisine, selectedTimeLimit]);

    return (
        <div id="recipe-search" className="w-full bg-[#f9f8f6] py-32 px-6 md:px-12 relative overflow-hidden">
            {/* Subtle background orbs */}
            <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-orange-500/[0.03] blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[35vw] h-[35vw] rounded-full bg-amber-200/20 blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <div className="inline-flex items-center gap-2 mb-6">
                        <div className="h-px w-8 bg-orange-300" />
                        <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.5em]">Discovery</span>
                        <div className="h-px w-8 bg-orange-300" />
                    </div>
                    <h2 className="text-5xl md:text-6xl text-gray-900 mb-4 tracking-tight"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
                        The Gourmet Archive
                    </h2>
                    <p className="text-gray-400 text-sm font-light tracking-widest">A curated collection of culinary masterpieces</p>

                    {/* Search */}
                    <div className="relative max-w-2xl mx-auto mt-10 group">
                        <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-400 transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder={searchMode === "Name" ? "Search recipes..." : "List ingredients (e.g. Rice, Garlic)..."}
                            className="w-full bg-white border border-gray-100 rounded-2xl py-5 pl-14 pr-40 text-gray-800 text-base font-light focus:outline-none focus:border-orange-300 transition-all shadow-sm placeholder:text-gray-300"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                            {(['Name', 'Fridge'] as const).map(m => (
                                <button key={m} onClick={() => setSearchMode(m)}
                                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${searchMode === m ? 'bg-orange-500 text-white' : 'text-gray-300 hover:text-gray-600'}`}>
                                    {m === 'Name' ? 'Library' : 'Pantry'}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.header>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-14 p-7 bg-white rounded-[2rem] border border-gray-100 shadow-sm"
                >
                    {[
                        { label: 'Cuisine', icon: <Flame size={11} />, options: cuisines, selected: selectedCuisine, set: setSelectedCuisine },
                        { label: 'Meal Type', icon: <Clock size={11} />, options: mealTypes, selected: selectedMealType, set: setSelectedMealType },
                        { label: 'Dietary', icon: <Filter size={11} />, options: diets, selected: selectedDiet, set: setSelectedDiet },
                        { label: 'Prep Time', icon: <Clock size={11} />, options: timeLimits.map(t => t.label), selected: timeLimits.find(t => t.value === selectedTimeLimit)?.label ?? 'Any', set: (v: string) => setSelectedTimeLimit(timeLimits.find(t => t.label === v)?.value ?? 999) },
                    ].map(({ label, icon, options, selected, set }) => (
                        <div key={label}>
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-300 uppercase tracking-[0.35em] mb-3 ml-1">
                                {icon} {label}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {options.map(opt => (
                                    <FilterBtn key={opt} active={selected === opt} onClick={() => set(opt)}>{opt}</FilterBtn>
                                ))}
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Results count */}
                <div className="mb-8 flex items-center gap-4">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">{filteredRecipes.length} recipes</span>
                    <div className="h-px flex-1 bg-gray-100" />
                </div>

                {/* Recipe Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredRecipes.map((recipe, index) => (
                            <TiltCard key={recipe.id} recipe={recipe} index={index} onClick={() => setSelectedRecipe(recipe)} />
                        ))}
                    </AnimatePresence>
                </div>

                {filteredRecipes.length === 0 && (
                    <div className="py-32 text-center">
                        <p className="text-5xl italic text-gray-200 mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Nothing Found</p>
                        <p className="text-gray-300 text-xs uppercase tracking-widest">Try adjusting your filters</p>
                    </div>
                )}
            </div>

            <RecipeDetails recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
        </div>
    );
};

export default SearchRecipes;

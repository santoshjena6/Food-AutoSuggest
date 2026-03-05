import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Award, Save, Sparkles, ChefHat, Dna, Mail, Heart, ShieldAlert } from 'lucide-react';

interface UserProfile {
    name: string;
    email: string;
    dietPreference: string;
    allergies: string;
    cookingLevel: string;
    preferredIngredients: string;
    avoidedIngredients: string;
}

const diets = ["Vegetarian", "Vegan", "Gluten-Free", "None"];
const skillLevels = [
    { name: "Novice", icon: <ChefHat size={18} />, desc: "Learning the basics" },
    { name: "Intermediate", icon: <Sparkles size={18} />, desc: "Exploring flavors" },
    { name: "Master Chef", icon: <Award size={18} />, desc: "Culinary artist" }
];

const UserProfile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile>({
        name: '',
        email: '',
        dietPreference: 'None',
        allergies: '',
        cookingLevel: 'Novice',
        preferredIngredients: '',
        avoidedIngredients: ''
    });
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const savedProfile = localStorage.getItem("userProfile");
        if (savedProfile) setProfile(JSON.parse(savedProfile));
    }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem("userProfile", JSON.stringify(profile));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
        window.dispatchEvent(new Event('storage'));
    };

    const toggleTag = (field: keyof UserProfile, tag: string) => {
        if (!tag.trim()) return;
        const current = (profile[field] as string).split(',').map(s => s.trim()).filter(s => s);
        const exists = current.includes(tag.trim());
        const updated = exists
            ? current.filter(t => t !== tag.trim()).join(', ')
            : [...current, tag.trim()].join(', ');
        setProfile({ ...profile, [field]: updated });
    };

    const TagInput: React.FC<{ label: string, icon: React.ReactNode, field: keyof UserProfile, placeholder: string }> = ({ label, icon, field, placeholder }) => {
        const [input, setInput] = useState("");
        const tags = (profile[field] as string).split(',').map(s => s.trim()).filter(s => s);

        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                        {icon}
                    </div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">{label}</label>
                </div>
                <div className="relative group/input">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                toggleTag(field, input);
                                setInput("");
                            }
                        }}
                        className="w-full bg-white border border-gray-100 rounded-2xl py-6 px-8 text-gray-900 focus:outline-none focus:border-orange-500 transition-all font-light placeholder:text-gray-300 shadow-sm pr-24"
                        placeholder={placeholder}
                    />
                    <AnimatePresence>
                        {input && (
                            <motion.button
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                type="button"
                                onClick={() => { toggleTag(field, input); setInput(""); }}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-50 px-4 py-2 rounded-full"
                            >
                                Add
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
                <div className="flex flex-wrap gap-2.5 min-h-[40px]">
                    <AnimatePresence mode="popLayout">
                        {tags.map(t => (
                            <motion.button
                                layout
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                type="button"
                                key={t}
                                onClick={() => toggleTag(field, t)}
                                className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center gap-3 group/tag shadow-lg shadow-black/5"
                            >
                                {t} <span className="text-white/30 group-hover/tag:text-white/60 transition-colors">×</span>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        );
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] }
        }
    };

    return (
        <div id="user-profile" className="w-full bg-white py-32 px-6 md:px-12 relative overflow-hidden">
            {/* Atmospheric Depth */}
            <div className="atmospheric-text top-40 -left-48 opacity-5 -rotate-12 pointer-events-none select-none">
                IDENTITY
            </div>
            <div className="atmospheric-text bottom-40 -right-48 opacity-5 rotate-12 pointer-events-none select-none" style={{ fontSize: '15rem' }}>
                ESSENCE
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="max-w-wide mx-auto relative z-10"
            >
                <header className="mb-24 flex flex-col items-center text-center">
                    <motion.div
                        variants={cardVariants}
                        className="w-32 h-32 rounded-[3rem] bg-orange-500 flex items-center justify-center text-white shadow-[0_32px_64px_rgba(249,115,22,0.3)] mb-12 transform -rotate-3"
                    >
                        <User size={64} strokeWidth={1} />
                    </motion.div>
                    <motion.h2
                        variants={cardVariants}
                        className="text-7xl md:text-9xl mb-8 tracking-tighter text-gray-900"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}
                    >
                        Culinary Identity
                    </motion.h2>
                    <motion.p
                        variants={cardVariants}
                        className="text-gray-400 font-light italic max-w-2xl tracking-wide"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem' }}
                    >
                        Master your palette. Curate your dining philosophy and track your journey toward gastronomic excellence.
                    </motion.p>
                </header>

                <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-12 gap-12 lg:gap-20">

                    {/* Column 1: Personal Essence */}
                    <div className="xl:col-span-4 space-y-12">
                        <motion.div variants={cardVariants} className="p-12 bg-gray-50/50 backdrop-blur-xl rounded-[3.5rem] border border-gray-100/50 shadow-2xl shadow-black/[0.02]">
                            <div className="flex items-center gap-4 mb-12">
                                <div className="p-3 bg-white rounded-2xl shadow-sm text-gray-400">
                                    <Dna size={24} />
                                </div>
                                <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-gray-900">Personal Essence</h3>
                            </div>

                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400 ml-1">
                                        <User size={14} /> Full Expression
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full bg-white border border-gray-100 rounded-2xl py-6 px-8 text-gray-900 focus:outline-none focus:border-orange-500 transition-all font-medium placeholder:text-gray-300 shadow-sm"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-gray-400 ml-1">
                                        <Mail size={14} /> Digital Letterbox
                                    </label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="w-full bg-white border border-gray-100 rounded-2xl py-6 px-8 text-gray-900 focus:outline-none focus:border-orange-500 transition-all font-medium placeholder:text-gray-300 shadow-sm"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={cardVariants} className="p-12 bg-gray-900 text-white rounded-[3.5rem] shadow-3xl shadow-orange-500/10 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="relative z-10">
                                <Save className="mb-8 text-orange-500" size={40} />
                                <h4 className="text-3xl mb-6 font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Preserve Progress</h4>
                                <button
                                    type="submit"
                                    className="w-full py-6 bg-white text-gray-900 rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-orange-500 hover:text-white transition-all active:scale-95 shadow-xl"
                                >
                                    {isSaved ? "Identity Synced" : "Preserve Identity"}
                                </button>
                                {isSaved && (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-orange-500 text-[9px] font-bold uppercase tracking-widest text-center mt-6">
                                        Synced to neural core
                                    </motion.p>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Column 2: Culinary Mastery */}
                    <div className="xl:col-span-8 space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                            <motion.div variants={cardVariants} className="p-12 bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-black/[0.02] flex flex-col">
                                <div className="flex items-center gap-4 mb-12">
                                    <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl shadow-sm">
                                        <ChefHat size={24} />
                                    </div>
                                    <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-gray-900">Culinary Mastery</h3>
                                </div>
                                <div className="space-y-6 flex-grow">
                                    {skillLevels.map((lvl) => (
                                        <button
                                            key={lvl.name}
                                            type="button"
                                            onClick={() => setProfile({ ...profile, cookingLevel: lvl.name })}
                                            className={`w-full p-6 rounded-3xl border text-left transition-all duration-500 group relative overflow-hidden ${profile.cookingLevel === lvl.name
                                                    ? 'bg-orange-500 border-orange-500 text-white shadow-xl shadow-orange-500/20'
                                                    : 'bg-white border-gray-100 text-gray-400 hover:border-orange-500/30'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between relative z-10">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2 rounded-xl ${profile.cookingLevel === lvl.name ? 'bg-white/20' : 'bg-gray-50'}`}>
                                                        {lvl.icon}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[10px] uppercase tracking-widest">{lvl.name}</p>
                                                        <p className={`text-[9px] mt-1 ${profile.cookingLevel === lvl.name ? 'text-white/70' : 'text-gray-300'}`}>{lvl.desc}</p>
                                                    </div>
                                                </div>
                                                {profile.cookingLevel === lvl.name && (
                                                    <motion.div layoutId="skillActive" className="text-white">
                                                        <Sparkles size={16} />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div variants={cardVariants} className="p-12 bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-black/[0.02] flex flex-col">
                                <div className="flex items-center gap-4 mb-12">
                                    <div className="p-3 bg-gray-900 text-white rounded-2xl shadow-sm">
                                        <Heart size={24} />
                                    </div>
                                    <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-gray-900">Dietary Ethos</h3>
                                </div>
                                <div className="space-y-6">
                                    {diets.map((d) => (
                                        <button
                                            key={d}
                                            type="button"
                                            onClick={() => setProfile({ ...profile, dietPreference: d })}
                                            className={`w-full p-6 rounded-3xl border text-left transition-all duration-500 group ${profile.dietPreference === d
                                                    ? 'bg-gray-900 border-gray-900 text-white shadow-xl rotate-1 scale-[1.02]'
                                                    : 'bg-white border-gray-100 text-gray-400 hover:border-gray-900/30'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-[10px] uppercase tracking-widest">{d}</span>
                                                {profile.dietPreference === d && <Award size={16} className="text-orange-500" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        <motion.div variants={cardVariants} className="p-12 lg:p-20 bg-white rounded-[4.5rem] border border-gray-100 shadow-4xl shadow-black/[0.02]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 mb-20">
                                <TagInput
                                    label="Preferred Canvas"
                                    icon={<Heart size={16} />}
                                    field="preferredIngredients"
                                    placeholder="Add e.g. Avocado..."
                                />
                                <TagInput
                                    label="Restricted Textures"
                                    icon={<ShieldAlert size={16} />}
                                    field="avoidedIngredients"
                                    placeholder="Add e.g. Peanuts..."
                                />
                            </div>
                            <div className="pt-20 border-t border-gray-50">
                                <TagInput
                                    label="Biological Sensitivities"
                                    icon={<Sparkles size={16} />}
                                    field="allergies"
                                    placeholder="Add e.g. Shellfish..."
                                />
                            </div>
                        </motion.div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default UserProfile;

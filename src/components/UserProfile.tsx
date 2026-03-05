import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { User, Award, Save, Sparkles, ChefHat, Mail, Heart, ShieldAlert } from 'lucide-react';

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
                    <label className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">{label}</label>
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
                        className="w-full bg-white border border-gray-200 rounded-2xl py-6 px-8 text-gray-900 focus:outline-none focus:border-orange-500 transition-all font-medium placeholder:text-gray-300 shadow-sm pr-24"
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
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-orange-500 uppercase tracking-widest bg-orange-50 px-5 py-2.5 rounded-full"
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
                                className="px-5 py-2.5 bg-gray-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center gap-3 group/tag shadow-lg shadow-black/5"
                            >
                                {t} <span className="text-white/30 group-hover/tag:text-white/60 transition-colors">×</span>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        );
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <div id="user-profile" className="w-full bg-white py-40 md:py-60 px-6 md:px-12 relative overflow-hidden">
            {/* Atmospheric Depth */}
            <div className="atmospheric-text top-40 -left-64 opacity-[0.015] -rotate-6 pointer-events-none select-none">
                IDENTITY
            </div>
            <div className="atmospheric-text bottom-40 -right-64 opacity-[0.015] rotate-6 pointer-events-none select-none text-[12rem]">
                ESSENCE
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="max-w-wide mx-auto relative z-10"
            >
                <header className="relative z-10 mb-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="inline-block"
                    >
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="h-px w-12 bg-orange-500/20" />
                            <ChefHat className="text-orange-500" size={24} />
                            <div className="h-px w-12 bg-orange-500/20" />
                        </div>
                        <h2 className="text-6xl md:text-7xl mb-6 tracking-tighter text-gray-900 leading-none" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
                            Culinary Identity
                        </h2>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.5em] max-w-xs mx-auto">The Digital Blueprint of Your Palette</p>
                    </motion.div>
                </header>

                <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-12 gap-12 lg:gap-24">

                    {/* Column 1: Personal Essence */}
                    <div className="lg:col-span-4 space-y-12">
                        <motion.div variants={cardVariants} className="noise-texture premium-glass hover-glow p-12 lg:p-14 rounded-[3.5rem] border border-gray-100 shadow-xl">
                            <div className="radial-glow absolute inset-0 rounded-[3.5rem] pointer-events-none" />
                            <div className="flex items-center gap-6 mb-12">
                                <div className="p-5 bg-gray-900 text-white rounded-3xl shadow-2xl">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl tracking-tight text-gray-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Personal Essence</h3>
                                    <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Avatar & Contact</p>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                                        <User size={14} className="text-orange-500" /> Full Expression
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-2xl py-6 px-8 text-gray-900 focus:outline-none focus:border-orange-500 transition-all font-medium placeholder:text-gray-300 shadow-sm"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">
                                        <Mail size={14} className="text-orange-500" /> Digital Letterbox
                                    </label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-2xl py-6 px-8 text-gray-900 focus:outline-none focus:border-orange-500 transition-all font-medium placeholder:text-gray-300 shadow-sm"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={cardVariants} className="p-12 bg-gray-900 text-white rounded-[3.5rem] shadow-3xl shadow-orange-500/10 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="relative z-10 text-center">
                                <Save className="mx-auto mb-8 text-orange-500" size={40} />
                                <h4 className="text-3xl mb-8 font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Preserve Progress</h4>
                                <button
                                    type="submit"
                                    className="w-full py-6 bg-white text-gray-900 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-orange-500 hover:text-white transition-all active:scale-95 shadow-xl"
                                >
                                    {isSaved ? "Identity Synced" : "Preserve Identity"}
                                </button>
                                {isSaved && (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-orange-500 text-xs font-bold uppercase tracking-widest text-center mt-8">
                                        Synced to neural core
                                    </motion.p>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Column 2: Culinary Mastery */}
                    <div className="lg:col-span-8 space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-12">
                            <motion.div variants={cardVariants} className="noise-texture premium-glass hover-glow p-12 lg:p-20 rounded-[4rem] border border-gray-100 shadow-xl">
                                <div className="radial-glow absolute inset-0 rounded-[4rem] pointer-events-none" />
                                <div className="flex items-center justify-between mb-16">
                                    <div className="flex items-center gap-6">
                                        <div className="p-6 bg-gray-900 text-white rounded-[2.5rem] shadow-2xl">
                                            <Sparkles size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-4xl tracking-tight text-gray-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Culinary Mastery</h3>
                                            <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Skill Acquisition Path</p>
                                        </div>
                                    </div>
                                    <div className="h-px w-24 bg-gray-100 hidden md:block" />
                                </div>
                                <div className="space-y-6 flex-grow">
                                    {skillLevels.map((lvl) => (
                                        <button
                                            key={lvl.name}
                                            type="button"
                                            onClick={() => setProfile({ ...profile, cookingLevel: lvl.name })}
                                            className={`w-full p-8 rounded-[2.5rem] border text-left transition-all duration-500 group relative overflow-hidden ${profile.cookingLevel === lvl.name
                                                ? 'bg-orange-500 border-orange-500 text-white shadow-xl shadow-orange-500/20 scale-[1.02]'
                                                : 'bg-white border-gray-100 text-gray-400 hover:border-orange-500/30'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between relative z-10">
                                                <div className="flex items-center gap-6">
                                                    <div className={`p-4 rounded-2xl ${profile.cookingLevel === lvl.name ? 'bg-white/20' : 'bg-orange-50 text-orange-500'}`}>
                                                        {lvl.icon}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-xs uppercase tracking-widest">{lvl.name}</p>
                                                        <p className={`text-[11px] mt-1 ${profile.cookingLevel === lvl.name ? 'text-white/70' : 'text-gray-400'}`}>{lvl.desc}</p>
                                                    </div>
                                                </div>
                                                {profile.cookingLevel === lvl.name && (
                                                    <motion.div layoutId="skillActive" className="text-white">
                                                        <Sparkles size={20} />
                                                    </motion.div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div variants={cardVariants} className="noise-texture premium-glass hover-glow p-12 lg:p-14 rounded-[3.5rem] border border-gray-100 shadow-xl">
                                <div className="radial-glow absolute inset-0 rounded-[3.5rem] pointer-events-none" />
                                <div className="flex items-center gap-6 mb-12">
                                    <div className="p-5 bg-orange-500 text-white rounded-3xl shadow-2xl shadow-orange-500/20">
                                        <Award size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl tracking-tight text-gray-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Dietary Philosphy</h3>
                                        <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Health & Ethics</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {diets.map((d) => (
                                        <button
                                            key={d}
                                            type="button"
                                            onClick={() => setProfile({ ...profile, dietPreference: d })}
                                            className={`w-full p-8 rounded-3xl border text-left transition-all duration-500 group ${profile.dietPreference === d
                                                ? 'bg-gray-900 border-gray-900 text-white shadow-xl rotate-1 scale-[1.02]'
                                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-900/30'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-xs uppercase tracking-widest">{d}</span>
                                                {profile.dietPreference === d && <Award size={18} className="text-orange-500" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        <motion.div variants={cardVariants} className="noise-texture premium-glass hover-glow p-12 lg:p-20 rounded-[4rem] border border-gray-100 shadow-xl">
                            <div className="radial-glow absolute inset-0 rounded-[4rem] pointer-events-none" />
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
                            <div className="pt-20 border-t border-gray-100/30">
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

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Award, Sparkles, ChefHat, Heart, ShieldAlert, Check } from 'lucide-react';

interface UserProfile {
    name: string;
    email: string;
    dietPreference: string;
    allergies: string;
    cookingLevel: string;
    preferredIngredients: string;
    avoidedIngredients: string;
}

const skillLevels = [
    { name: "Novice", icon: <ChefHat size={22} />, desc: "Laying the Foundation", color: "emerald", bg: "bg-emerald-50", border: "border-emerald-200", activeBg: "bg-emerald-500", iconColor: "text-emerald-600" },
    { name: "Intermediate", icon: <Sparkles size={22} />, desc: "Architect of Flavor", color: "orange", bg: "bg-orange-50", border: "border-orange-200", activeBg: "bg-orange-500", iconColor: "text-orange-500" },
    { name: "Master Chef", icon: <Award size={22} />, desc: "Culinary Visionary", color: "violet", bg: "bg-violet-50", border: "border-violet-200", activeBg: "bg-violet-600", iconColor: "text-violet-600" }
];

const diets = [
    { name: "Vegetarian", emoji: "🥦" },
    { name: "Vegan", emoji: "🌱" },
    { name: "Gluten-Free", emoji: "🌾" },
    { name: "None", emoji: "✦" }
];

// 3D Tilt panel (light) - Removed for cleaner UI

const TagInput: React.FC<{
    label: string; icon: React.ReactNode; field: keyof UserProfile;
    placeholder: string; profile: UserProfile; onToggle: (f: keyof UserProfile, t: string) => void;
}> = ({ label, icon, field, placeholder, profile, onToggle }) => {
    const [input, setInput] = useState("");
    const tags = (profile[field] || "").split(',').map(s => s.trim()).filter(Boolean).map((t, i) => ({ id: `${t}-${i}`, text: t }));

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-orange-50 text-orange-500 rounded-lg">{icon}</div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{label}</label>
            </div>
            <div className="relative">
                <input
                    type="text" value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && input.trim()) { e.preventDefault(); onToggle(field, input); setInput(""); } }}
                    placeholder={placeholder}
                    className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-gray-800 font-light focus:outline-none focus:border-orange-300 transition-all shadow-sm placeholder:text-gray-200"
                />
                <AnimatePresence>
                    {input && (
                        <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            type="button" onClick={() => { onToggle(field, input); setInput(""); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-2 rounded-xl">
                            <Check size={15} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
            <div className="flex flex-wrap gap-2">
                <AnimatePresence mode="popLayout">
                    {tags.map(tag => (
                        <motion.button layout key={tag.id}
                            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                            type="button" onClick={() => onToggle(field, tag.text)}
                            className="px-4 py-2 bg-gray-900 text-white rounded-full text-[10px] font-bold tracking-wider hover:bg-orange-500 transition-all flex items-center gap-2">
                            {tag.text} <span className="opacity-40">×</span>
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

const UserProfile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile>({
        name: '', email: '', dietPreference: 'None',
        allergies: '', cookingLevel: 'Novice',
        preferredIngredients: '', avoidedIngredients: ''
    });
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("userProfile");
        if (saved) { try { setProfile(p => ({ ...p, ...JSON.parse(saved) })); } catch {} }
    }, []);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem("userProfile", JSON.stringify(profile));
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
        window.dispatchEvent(new Event('storage'));
    };

    const toggleTag = (field: keyof UserProfile, tag: string) => {
        if (!tag.trim()) return;
        const current = (profile[field] || "").split(',').map(s => s.trim()).filter(Boolean);
        const exists = current.includes(tag.trim());
        setProfile({ ...profile, [field]: exists ? current.filter(t => t !== tag.trim()).join(', ') : [...current, tag.trim()].join(', ') });
    };

    return (
        <div id="user-profile" className="w-full bg-white py-32 px-6 md:px-12 relative overflow-hidden">
            {/* Background detail */}
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-orange-50/60 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-amber-50/40 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/4" />

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-32"
                >
                    <div className="inline-flex items-center gap-4 mb-6">
                        <div className="h-px w-12 bg-orange-200" />
                        <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.5em]">Identity</span>
                        <div className="h-px w-12 bg-orange-200" />
                    </div>
                    <h2 className="text-6xl md:text-8xl text-gray-900 tracking-tighter"
                        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
                        Your <span className="italic text-gray-300">Taste Profile</span>
                    </h2>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mt-8">Personalising the culinary manuscript</p>
                </motion.header>

                <form onSubmit={handleSave} className="space-y-8">
                    {/* Row 1: Personal + Diet */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Personal Info */}
                        <div className="bg-white border border-gray-100 rounded-[3rem] p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.02)]">
                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h4 className="text-2xl text-gray-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Personal Details</h4>
                                    <p className="text-[9px] text-gray-300 uppercase tracking-widest font-black">Authentication of Self</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                {[{ label: 'Your Name', field: 'name', type: 'text', ph: 'Enter your name' }, { label: 'Email Address', field: 'email', type: 'email', ph: 'chef@domain.com' }].map(f => (
                                    <div key={f.field} className="space-y-3">
                                        <label className="text-[9px] font-black text-gray-300 uppercase tracking-[0.45em] ml-1">{f.label}</label>
                                        <input type={f.type} value={profile[f.field as keyof UserProfile]}
                                            onChange={e => setProfile({ ...profile, [f.field]: e.target.value })}
                                            placeholder={f.ph}
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-5 px-6 text-gray-800 font-light focus:outline-none focus:border-orange-200 transition-all placeholder:text-gray-200 text-sm" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Diet Preference */}
                        <div className="bg-white border border-gray-100 rounded-[3rem] p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.02)]">
                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-14 h-14 bg-orange-50/60 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-100">
                                    <Award size={20} />
                                </div>
                                <div>
                                    <h4 className="text-2xl text-gray-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Dietary Style</h4>
                                    <p className="text-[9px] text-gray-300 uppercase tracking-widest font-black">Guidelines of Essence</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {diets.map(d => (
                                    <button key={d.name} type="button"
                                        onClick={() => setProfile({ ...profile, dietPreference: d.name })}
                                        className={`py-6 px-4 rounded-3xl border-2 text-center transition-all duration-500 ${profile.dietPreference === d.name
                                            ? 'border-orange-500 bg-orange-50/50 shadow-lg shadow-orange-100'
                                            : 'border-gray-50 bg-gray-50/20 hover:border-gray-100'}`}
                                    >
                                        <div className="text-2xl mb-2">{d.emoji}</div>
                                        <div className={`text-[10px] font-black uppercase tracking-widest ${profile.dietPreference === d.name ? 'text-orange-600' : 'text-gray-300'}`}>{d.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Skill Level */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
                        <div className="text-center mb-12">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">Culinary Proficiency</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {skillLevels.map(lvl => {
                                const isActive = profile.cookingLevel === lvl.name;
                                return (
                                    <div key={lvl.name} 
                                        onClick={() => setProfile({ ...profile, cookingLevel: lvl.name })}
                                        className={`rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer p-10 text-center ${isActive 
                                            ? `${lvl.border} ${lvl.bg} shadow-xl shadow-${lvl.color}-100` 
                                            : 'border-gray-50 bg-white hover:border-gray-100'}`}>
                                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-8 transition-all duration-500 ${isActive ? `${lvl.activeBg} text-white shadow-lg` : `bg-gray-50 ${lvl.iconColor} border border-gray-100 opacity-40`}`}>
                                            {lvl.icon}
                                        </div>
                                        <h5 className={`text-2xl mb-2 ${isActive ? 'text-gray-900' : 'text-gray-400 font-light'}`}
                                            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                            {lvl.name}
                                        </h5>
                                        <p className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-gray-500' : 'text-gray-300'}`}>{lvl.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Tag Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-gray-50/50 rounded-[2rem] border border-gray-100">
                        <TagInput label="Favourite Ingredients" icon={<Heart size={14} />} field="preferredIngredients"
                            placeholder="e.g. Avocado, Truffle..." profile={profile} onToggle={toggleTag} />
                        <TagInput label="Avoid Ingredients" icon={<ShieldAlert size={14} />} field="avoidedIngredients"
                            placeholder="e.g. Peanuts, Shellfish..." profile={profile} onToggle={toggleTag} />
                    </div>

                    {/* Save */}
                    <div className="flex justify-center pt-6">
                        <button type="submit"
                            className="group relative px-16 py-5 bg-gray-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] overflow-hidden hover:bg-orange-500 transition-all duration-500 shadow-xl shadow-gray-200">
                            <span className="relative z-10 flex items-center gap-3">
                                <Check size={16} className={isSaved ? 'text-emerald-400' : 'text-white/50'} />
                                {isSaved ? 'Profile Saved!' : 'Save Profile'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;

<div align="center">

# 🍜 Food AutoSuggest & Culinary Discovery Engine
### *A Smart, Lightning-Fast Recipe Search Engine with 3D Tilt Cards & Cinematic Scrollytelling*

[![GitHub Stars](https://img.shields.io/github/stars/santoshjena6/Food-AutoSuggest?style=for-the-badge&logo=github&color=f97316&logoColor=white)](https://github.com/santoshjena6/Food-AutoSuggest/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/santoshjena6/Food-AutoSuggest?style=for-the-badge&logo=github&color=111827&logoColor=white)](https://github.com/santoshjena6/Food-AutoSuggest/network/members)
[![Follow @santoshjena6](https://img.shields.io/github/followers/santoshjena6?label=Follow%20%40santoshjena6&style=for-the-badge&logo=github&color=f97316&logoColor=white)](https://github.com/santoshjena6)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

<br />

<p align="center">
  <b>An interactive, production-ready recipe discovery and intelligent auto-suggestion engine.</b><br />
  Designed for food-tech platforms, cloud kitchens, culinary blogs, restaurants, and dietary apps.
</p>

[✨ Key Features](#-key-features) •
[🚀 Quick Start](#-quick-start) •
[🔍 Search Architecture](#-how-the-autosuggest-engine-works) •
[🎨 Customization Guide](#-customization-guide-plug-in-your-own-recipes) •
[📂 Project Structure](#-project-structure) •
[🗺️ Roadmap](#️-roadmap--upcoming-features) •
[⭐ Support](#-show-your-support--follow-for-upcoming-projects)

---

</div>

> [!IMPORTANT]
> ### 🌟 Support The Developer & Stay Tuned For Upcoming Projects!
> If you are using this search engine or component in your food app, restaurant portal, or portfolio:
> 1. ⭐ **Star this repository** to help other developers discover modern food UI solutions!
> 2. 👤 **Follow [@santoshjena6](https://github.com/santoshjena6) on GitHub** to stay updated on upcoming open-source releases:
>    - 🛒 **Full-Stack Restaurant POS & Online Ordering Engine** (Cart + Stripe/Razorpay)
>    - 🤖 **AI Recipe Generator & Ingredient Image Scanner** (Vision AI + Nutrition Estimator)
>    - ☁️ **AWS Serverless Cloud Kitchen Backend** (AWS Lambda, DynamoDB & AppSync GraphQL)
>
> 👉 **[Click here to follow @santoshjena6 on GitHub](https://github.com/santoshjena6)** 👈

---

## 📸 Overview

**Food-AutoSuggest** solves a common problem in food delivery and culinary applications: **boring, sluggish search bars**. 

Instead of simple text queries, this engine combines **instant multi-criteria auto-suggestions** (filtering by meal type, dietary restriction, cuisine, and preparation time) with **high-end 3D physics-based tilt cards**, **cinematic scrollytelling**, and **deep recipe modal analytics** (complete nutritional breakdowns, ingredient checklists, and step-by-step instructions).

The project is built on **React 19, TypeScript, Tailwind CSS, and Framer Motion**, offering ultra-smooth 60fps micro-interactions and clean, type-safe architecture.

---

## ✨ Key Features

- ⚡ **Real-Time Auto-Suggest & Faceted Filter Engine**:
  - Instant fuzzy search across dish names, ingredients, and cuisines.
  - Multi-dimensional filtering by:
    - **Meal Type**: Breakfast, Lunch, Dinner, Snacks.
    - **Dietary Preferences**: Vegetarian, Vegan, Gluten-Free, Keto.
    - **Cuisines**: Indian, Chinese, Continental, Italian, Mexican, etc.
    - **Prep & Cook Time**: Under 15m, 30m, 45m, or Any.
- 🎴 **Physics-Based 3D Mouse Parallax Tilt Cards**:
  - Interactive recipe cards that tilt dynamically in 3D space according to cursor position, powered by Framer Motion springs (`useMotionValue`, `useTransform`, `useSpring`).
- 🎬 **Cinematic Scrollytelling Experience**:
  - Smooth HTML5 canvas-driven scroll animation with an adaptive glassmorphic pill navbar that transforms dynamically as the user navigates down the page.
- 🥗 **Comprehensive Recipe Details & Nutrition Drawer**:
  - Detailed modal view displaying macro nutrients (**Calories**, **Protein**, **Carbs**, **Fat**), ingredient checklists with serving sizes, cooking instructions, and verified user ratings.
- 👤 **Interactive User Profile & Bookmarking**:
  - Save favorite dishes, track culinary milestones, and customize personal diet preferences.
- 📱 **Mobile-First & Responsive**:
  - Fully responsive grid layout styled with Tailwind CSS, supporting fluid animations across desktop, tablet, and mobile browsers.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **[React 19](https://react.dev/)** | Modern UI library with latest React 19 architecture |
| **[TypeScript](https://www.typescriptlang.org/)** | Strict type safety and clear component interfaces |
| **[Vite](https://vitejs.dev/)** | Next-generation frontend tooling with instant HMR |
| **[Tailwind CSS](https://tailwindcss.com/)** | Utility-first responsive styling and typography |
| **[Framer Motion](https://www.framer.com/motion/)** | 3D spring physics, scroll listeners, and exit animations |
| **[Lucide React](https://lucide.dev/)** | Clean, lightweight icon suite |

---

## 🚀 Quick Start

### Prerequisites
- Node.js (version 18+ recommended)
- npm, pnpm, or yarn

### 1. Clone the repository
```bash
git clone https://github.com/santoshjena6/Food-AutoSuggest.git
cd Food-AutoSuggest
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start local development server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for production
```bash
npm run build
```
Generates a type-checked, optimized production bundle inside the `dist/` directory.

---

## 🔍 How the AutoSuggest Engine Works

The search engine performs instantaneous client-side filtering via `useMemo`, ensuring **sub-millisecond search latencies** even across extensive datasets:

```typescript
const filteredRecipes = useMemo(() => {
  return recipesData.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          recipe.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMeal = selectedMeal === "All" || recipe.mealType === selectedMeal;
    const matchesDiet = selectedDiet === "All" || recipe.diet === selectedDiet;
    const matchesCuisine = selectedCuisine === "All" || recipe.cuisine === selectedCuisine;
    const matchesTime = recipe.cookTime <= maxTime;

    return matchesSearch && matchesMeal && matchesDiet && matchesCuisine && matchesTime;
  });
}, [searchQuery, selectedMeal, selectedDiet, selectedCuisine, maxTime]);
```

---

## 🎨 Customization Guide (Plug In Your Own Recipes)

### 1. Adding or Modifying Dishes
All recipe data lives in a clean, structured JSON file at `src/data/recipes.json`. Simply add or edit entries:

```json
{
  "id": 101,
  "name": "Paneer Tikka Masala",
  "mealType": "Dinner",
  "diet": "Vegetarian",
  "cuisine": "Indian",
  "cookTime": 30,
  "rating": 4.9,
  "image": "https://images.unsplash.com/photo-example",
  "prepTime": "15 mins",
  "difficulty": "Medium",
  "nutrition": {
    "calories": "420 kcal",
    "protein": "18g",
    "carbs": "22g",
    "fat": "28g"
  },
  "ingredients": [
    "200g Fresh Paneer cubes",
    "1 cup Bell Peppers",
    "2 tbsp Greek Yogurt",
    "1 tbsp Garam Masala"
  ],
  "instructions": [
    "Marinate paneer and bell peppers in spiced yogurt for 20 mins.",
    "Grill until golden edges appear.",
    "Simmer in rich onion-tomato gravy."
  ],
  "reviews": [
    { "name": "Rahul S.", "comment": "Restaurant-grade taste!", "rating": 5 }
  ]
}
```

### 2. Customizing Filter Categories
Open `src/components/SearchRecipes.tsx` to add your custom cuisines, diets, or meal categories:

```typescript
const mealTypes = ["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Late Night"];
const diets = ["All", "Vegetarian", "Vegan", "Gluten-Free", "Keto", "High-Protein"];
const cuisines = ["All", "Indian", "Chinese", "Continental", "Italian", "Mexican"];
```

### 3. Integrating with a REST or GraphQL API
To connect with an external API (like Spoonacular, Edamam, or your custom AWS backend), simply replace the static JSON import with a `fetch` or `tanstack-query` hook inside `src/components/SearchRecipes.tsx`.

---

## 📂 Project Structure

```text
Food-AutoSuggest/
├── public/                    # Static assets & public icons
├── src/
│   ├── assets/                # App images & SVG icons
│   ├── components/
│   │   ├── animations/
│   │   │   ├── FloatingPlate.tsx   # Floating food visual physics
│   │   │   └── ScrollyCanvas.tsx   # Canvas-driven scrollytelling hero
│   │   ├── About.tsx               # Brand narrative & culinary philosophy
│   │   ├── Dishes.tsx              # Featured dish highlights
│   │   ├── Overlay.tsx             # Modal backdrop overlay
│   │   ├── RecipeDetails.tsx       # Nutrition, ingredients & instruction modal
│   │   ├── SearchRecipes.tsx       # Auto-suggest search & 3D tilt cards
│   │   ├── StarRating.tsx          # Star rating component
│   │   └── UserProfile.tsx         # User preferences & bookmarks
│   ├── data/
│   │   └── recipes.json            # Curated recipe database
│   ├── App.tsx                     # Main layout & adaptive pill navbar
│   ├── App.css                     # Component styling overrides
│   ├── index.css                   # Tailwind imports & custom utilities
│   └── main.tsx                    # Application entry point
├── index.html                      # HTML root template
├── package.json                    # Dependencies & build scripts
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript compiler configuration
└── vite.config.ts                  # Vite config
```

---

## 🗺️ Roadmap & Upcoming Features

- [ ] 🤖 **AI-Powered Ingredient Search**: "Type what's in your fridge" to discover matching recipes.
- [ ] 🛒 **One-Click Grocery Cart**: Add missing ingredients straight to a shopping cart.
- [ ] 🌓 **Dark Mode / Light Mode Switcher**: Seamless theme toggling with Tailwind dark variant.
- [ ] ☁️ **AWS Serverless Backend Integration**: Cloud-hosted DynamoDB recipe store with AWS Lambda API endpoints.
- [ ] 🌐 **Multi-Language Support (i18n)**: English, Hindi, Spanish, and Mandarin translations.

---

## 🤝 Contributing

Contributions are warmly welcomed! If you have an idea, optimization, or bug fix:

1. Fork the repository
2. Create your branch (`git checkout -b feature/CoolFeature`)
3. Commit your changes (`git commit -m 'feat: Add CoolFeature'`)
4. Push to your branch (`git push origin feature/CoolFeature`)
5. Open a Pull Request

---

## ⭐ Show Your Support & Follow For Upcoming Projects

If this project gave you inspiration, helped your food startup, or taught you React animation techniques:

- ⭐️ **Star this repo on GitHub!**
- 👤 **Follow [@santoshjena6](https://github.com/santoshjena6)** on GitHub to get notified whenever new food-tech, UI components, and full-stack projects are released!
- 💬 **Drop feedback or feature requests** on the [Issues page](https://github.com/santoshjena6/Food-AutoSuggest/issues)!

---

## 👨‍💻 Author

**Santosh Jena**
- GitHub: [@santoshjena6](https://github.com/santoshjena6)
- Email: santoshjena7991@gmail.com

---

## 📄 License

This project is open-source under the **[MIT License](LICENSE)**. Feel free to use it for personal, commercial, and client projects!

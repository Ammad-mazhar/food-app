"use client";

import { useMemo, useState } from "react";
import { menuCategories, menuItems } from "@/lib/data";
import MenuItemCard from "@/components/MenuItemCard";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchesVeg = !vegOnly || item.isVeg;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesCategory && matchesVeg && matchesSearch;
    });
  }, [activeCategory, vegOnly, search]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">
          The Menu
        </span>
        <h1 className="mt-1 font-display text-3xl font-bold text-cream">
          Fire-Grilled Favorites
        </h1>
        <p className="mt-1 text-muted">
          Freshly prepared, available for delivery, pickup, or dine-in.
          Prices shown are indicative — please confirm current pricing with
          the restaurant.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search for a dish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2 text-sm text-cream placeholder:text-faint focus:border-gold focus:outline-none sm:max-w-xs"
        />
        <label className="flex items-center gap-2 text-sm font-medium text-cream">
          <input
            type="checkbox"
            checked={vegOnly}
            onChange={(e) => setVegOnly(e.target.checked)}
            className="h-4 w-4 accent-gold"
          />
          Vegetarian only
        </label>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {["All", ...menuCategories].map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              activeCategory === category
                ? "border-gold bg-gold text-bg"
                : "border-border-strong text-cream hover:bg-surface"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <p className="py-16 text-center text-faint">
          No dishes match your filters. Try adjusting your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

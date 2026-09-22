"use client";

import { useMemo, useState } from "react";
import { menuCategories, menuItems } from "@/lib/data";
import MenuItemCard from "@/components/MenuItemCard";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A–Z" },
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    const matched = menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchesVeg = !vegOnly || item.isVeg;
      // Search the description and category too, so "spicy", "cheese" or
      // "dessert" find something rather than coming back empty.
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      return matchesCategory && matchesVeg && matchesSearch;
    });

    const sorted = [...matched];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        sorted.sort(
          (a, b) => Number(Boolean(b.isPopular)) - Number(Boolean(a.isPopular))
        );
    }
    return sorted;
  }, [activeCategory, vegOnly, search, sort]);

  const filtersApplied =
    activeCategory !== "All" || vegOnly || search.trim() !== "";

  function resetFilters() {
    setActiveCategory("All");
    setVegOnly(false);
    setSearch("");
  }

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
          type="search"
          placeholder="Search dishes, flavours, categories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search the menu"
          className="w-full rounded-lg border border-border-strong bg-surface px-4 py-2 text-sm text-cream placeholder:text-faint focus:border-gold focus:outline-none sm:max-w-xs"
        />

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-cream">
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => setVegOnly(e.target.checked)}
              className="h-4 w-4 accent-gold"
            />
            Vegetarian only
          </label>

          <label className="flex items-center gap-2 text-sm font-medium text-cream">
            <span className="text-muted">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
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

      <div className="mb-4 flex items-center justify-between text-sm text-muted">
        <p aria-live="polite">
          {filteredItems.length}{" "}
          {filteredItems.length === 1 ? "dish" : "dishes"}
          {activeCategory !== "All" && ` in ${activeCategory}`}
        </p>
        {filtersApplied && (
          <button
            onClick={resetFilters}
            className="font-semibold text-gold-soft hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-faint">
            No dishes match your filters. Try adjusting your search.
          </p>
          {filtersApplied && (
            <button
              onClick={resetFilters}
              className="mt-4 rounded-lg border border-border-strong px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-surface"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, i) => (
            // The first row is above the fold and holds the LCP image, so it
            // loads eagerly instead of waiting on the lazy-load observer.
            <MenuItemCard key={item.id} item={item} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  );
}

import { useCallback, useEffect, useState } from 'react'

function ProductFilters({
  availableBrands,
  availableFeatures,
  category,
  categoryOptions = [],
  filters,
  onCategorySelect,
  onFilterChange,
  priceBounds,
}) {
  const [priceInput, setPriceInput] = useState({
    minPrice: String(filters.minPrice),
    maxPrice: String(filters.maxPrice),
  })

  const updateFilter = useCallback((nextFilter) => {
    onFilterChange({
      ...filters,
      ...nextFilter,
    })
  }, [filters, onFilterChange])

  useEffect(() => {
    if (priceInput.minPrice.trim() === '' || priceInput.maxPrice.trim() === '') {
      return undefined
    }

    const nextMinPrice = Number(priceInput.minPrice)
    const nextMaxPrice = Number(priceInput.maxPrice)

    if (!Number.isFinite(nextMinPrice) || !Number.isFinite(nextMaxPrice)) {
      return undefined
    }

    if (nextMinPrice === Number(filters.minPrice) && nextMaxPrice === Number(filters.maxPrice)) {
      return undefined
    }

    const debounceId = window.setTimeout(() => {
      updateFilter({
        minPrice: nextMinPrice,
        maxPrice: nextMaxPrice,
      })
    }, 500)

    return () => window.clearTimeout(debounceId)
  }, [filters.maxPrice, filters.minPrice, priceInput.maxPrice, priceInput.minPrice, updateFilter])

  const toggleBrand = (brand) => {
    const nextBrands = filters.brands.includes(brand)
      ? filters.brands.filter((selectedBrand) => selectedBrand !== brand)
      : [...filters.brands, brand]

    updateFilter({ brands: nextBrands })
  }

  const toggleCategory = (categoryCode) => {
    const selectedCategoryCodes = filters.categoryCodes ?? []
    const nextCategoryCodes = selectedCategoryCodes.includes(categoryCode)
      ? selectedCategoryCodes.filter((selectedCategoryCode) => selectedCategoryCode !== categoryCode)
      : [...selectedCategoryCodes, categoryCode]

    updateFilter({ categoryCodes: nextCategoryCodes })
  }

  const toggleFeature = (feature) => {
    const nextFeatures = filters.features.includes(feature)
      ? filters.features.filter((selectedFeature) => selectedFeature !== feature)
      : [...filters.features, feature]

    updateFilter({ features: nextFeatures })
  }

  const handleMinPriceChange = (event) => {
    setPriceInput((currentPriceInput) => ({
      ...currentPriceInput,
      minPrice: event.target.value,
    }))
  }

  const handleMaxPriceChange = (event) => {
    setPriceInput((currentPriceInput) => ({
      ...currentPriceInput,
      maxPrice: event.target.value,
    }))
  }

  return (
    <aside className="grid content-start gap-10">
      {categoryOptions.length > 0 && (
        <section>
          <h2 className="mb-5 text-[16px] font-bold">카테고리</h2>
          <div className="grid gap-4">
            {categoryOptions.map((item) => (
              <label className="flex items-center gap-3 text-[15px]" key={item.code}>
                <input
                  className="size-5 accent-[#071431]"
                  type="checkbox"
                  checked={category ? item.code === category.code : (filters.categoryCodes ?? []).includes(item.code)}
                  readOnly={Boolean(onCategorySelect)}
                  onChange={() => {
                    if (onCategorySelect) {
                      return
                    }

                    toggleCategory(item.code)
                  }}
                  onClick={() => onCategorySelect?.(item.code)}
                />
                {item.label}
              </label>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-5 text-[16px] font-bold">가격 범위</h2>
        <div className="h-1 rounded-full bg-[#d8dde6]">
          <div className="h-1 w-2/3 rounded-full bg-[#071431]" />
        </div>
        <div className="mt-5 flex gap-3">
          <label className="min-w-0 flex-1">
            <span className="sr-only">최소 가격</span>
            <input
              className="w-full border border-[#c7ccd6] bg-white px-4 py-3 text-[13px] font-bold text-[#071431] outline-none focus:border-[#071431]"
              type="number"
              min={priceBounds.min}
              max={priceBounds.max}
              value={priceInput.minPrice}
              onChange={handleMinPriceChange}
            />
          </label>
          <label className="min-w-0 flex-1">
            <span className="sr-only">최대 가격</span>
            <input
              className="w-full border border-[#c7ccd6] bg-white px-4 py-3 text-[13px] font-bold text-[#071431] outline-none focus:border-[#071431]"
              type="number"
              min={priceBounds.min}
              max={priceBounds.max}
              value={priceInput.maxPrice}
              onChange={handleMaxPriceChange}
            />
          </label>
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-[16px] font-bold">브랜드</h2>
        <div className="grid gap-4">
          {availableBrands.map((brand) => (
            <label className="flex items-center gap-3 text-[15px]" key={brand}>
              <input
                className="size-5 accent-[#071431]"
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
              />
              {brand}
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-[16px] font-bold">특징</h2>
        <div className="flex flex-wrap gap-2">
          {availableFeatures.map((feature) => {
            const isSelected = filters.features.includes(feature)

            return (
              <button
                className={`rounded-full border px-4 py-2 text-[13px] ${isSelected ? 'border-[#071431] bg-[#edf4ff]' : 'border-[#c7ccd6] bg-white'}`}
                type="button"
                key={feature}
                aria-pressed={isSelected}
                onClick={() => toggleFeature(feature)}
              >
                {feature}
              </button>
            )
          })}
        </div>
      </section>
    </aside>
  )
}

export default ProductFilters

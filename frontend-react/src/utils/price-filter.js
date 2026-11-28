// Slider limits from the real lowest and highest selling prices
export function getPriceBounds(products) {
    const prices = products
        .map((p) => Number(p.price))
        .filter((n) => Number.isFinite(n) && n >= 0);

    if (prices.length === 0) return { min: 0, max: 0, step: 1 };

    const rawMin = Math.min(...prices);
    const rawMax = Math.max(...prices);
    const span = rawMax - rawMin;
    const step = span >= 100000 ? 1000 : span >= 10000 ? 100 : span >= 1000 ? 10 : 1;

    return {
        min: Math.floor(rawMin / step) * step,
        max: Math.ceil(rawMax / step) * step,
        step,
    };
}

// range is null (no filter) or [min, max], compared with the selling price
export function filterByPrice(products, range) {
    if (!range) return products;

    return products.filter((p) => {
        const price = Number(p.price);
        return price >= range[0] && price <= range[1];
    });
}
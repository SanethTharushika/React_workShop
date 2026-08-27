export function getFormattedPrice(price) {
    const numericPrice = Number(price);

    return Number.isFinite(numericPrice)
        ? `LKR ${numericPrice.toLocaleString("en-LK", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`
        : "Price unavailable";
}
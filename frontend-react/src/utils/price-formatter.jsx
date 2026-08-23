export function getFormattedPrice(price) {
    return Number.isFinite(price) ? price.toLocaleString() : "Price unavailable";
}
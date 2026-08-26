

export function getCart() {

    const cartString = localStorage.getItem("cart");

    if (cartString == null) {
        localStorage.setItem("cart", JSON.stringify([]));
        return [];
    }

    const cart = JSON.parse(cartString);
    return cart;    
}

export function addToCart(product, quantity) {

    const cart = getCart();

    const existingProductIndex = cart.findIndex(
        (item) =>{
            const result = item.product.productId === product.productId;
            return result;
        } 
    )
             



    if (existingProductIndex == -1 && quantity > 0) {

        cart.push({
            product: {
                productId: product.productId,
                name: product.name,
                image: product.image[0],
                price: product.price,
                labelledPrice: product.labelledPrice

            },
            quantity: quantity

        })

    }

    if(existingProductIndex != -1 ) {

        cart[existingProductIndex].quantity += quantity;

        if(cart[existingProductIndex].quantity < 1) {
            cart.splice(existingProductIndex, 1);
        }

    }

    const cartString = JSON.stringify(cart);
    localStorage.setItem("cart", cartString); 

}

export function getTotal(cartItems) {

    const items = cartItems ?? getCart();

    let total = 0;

    items.forEach((item) => {

        total += item.product.price * item.quantity;

    })

    return total;
}








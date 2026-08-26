    const sampleCart = [
        {
            product: {
                productId: "1",
                name: "Product 1",
                price: 100,
                image: "https://placehold.co/300x200",
                labelledPrice: 150
        },
        quantity: 2
        },
        {
            product: {
                productId: "2",
                name: "Product 2",
                price: 200,
                image: "https://picsum.photos/300/200",
                labelledPrice: 250
            },
            quantity: 1
        }
    ];

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








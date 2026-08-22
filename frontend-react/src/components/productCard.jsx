export default function ProductCard(props) {



    const product = props.product;

    return (
        <div className="bg-white w-72 h-96 ">
            <h1>{product.name}</h1>
            
            <p>{product.price}</p>
        </div>
    )
}
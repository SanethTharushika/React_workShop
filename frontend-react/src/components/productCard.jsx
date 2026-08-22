export default function ProductCard(props) {



    const product = props.product;
    const price = Number(product.price);
    const labelledPrice = Number(product.labelledPrice);

    return (
        <div className="bg-white rounded-lg w-72 h-96 shadow-xl flex flex-col ">
            {/* <h1>{product.name}</h1> */}

            <img src={product.image[0]} className="w-full h-[60%] object-cover rounded-tl-lg rounded-tr-lg"/>
            <div className="w-full h-[40%] p-4 flex flex-col justify-between">

                <h1 className="text-lg font-semibold">{product.name}</h1>
                <p className="text-accent">{price}</p>
                {labelledPrice > 0 && labelledPrice !== price && (
                    <p className="text-accent line-through decoration-2">{labelledPrice}</p>
                )}


            </div>
           
        </div>
    )
}
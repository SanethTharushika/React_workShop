import { useParams } from "react-router-dom";


export default function OverviewPage() {
    const parameters = useParams();
    
    

    return (
        <div className="w-full h-full flex justify-center items-center">
            <h1>{parameters.productId}</h1>
        </div>
        
    )
}

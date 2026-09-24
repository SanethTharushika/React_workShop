export default function LandingPage() {

    return (
        <div className="w-full h-full relative">
            <video src="landing.mp4" autoPlay loop muted className="w-full h-full object-cover"/>
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex flex-col justify-center items-center gap-6">
                <h1 className="text-4xl font-bold text-white">Welcome to Our Store</h1>
                <p className="text-lg text-white">Discover the best products at unbeatable prices.</p>
                <a href="/products" className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition duration-300">Shop Now</a>
            </div>
        </div>
    )
        

}
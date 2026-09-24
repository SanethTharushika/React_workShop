export default function ContactUsPage() {

    return (
        <div className="w-full h-full relative">
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex flex-col justify-center items-center gap-6">
                <h1 className="text-4xl font-bold text-white">Contact Us</h1>
                <p className="text-lg text-white">Have any questions? We're here to help!</p>
                <a href="/contact-us" className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition duration-300">Get in Touch</a>
            </div>
        </div>
    )
}
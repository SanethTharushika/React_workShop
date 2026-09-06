export default function LoadingScreen() {

    return (
        <div className="w-screen h-screen fixed left-0 top-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center">

            <div className="flex flex-col items-center gap-5">

                <div className="relative w-[90px] h-[90px]">

                    <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>

                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent border-r-accent animate-spin"></div>

                    <div className="absolute inset-[14px] rounded-full bg-white/10 shadow-lg"></div>

                </div>

                <div className="text-center">

                    <p className="text-white text-lg font-semibold">
                        Loading...
                    </p>

                    <p className="text-gray-300 text-sm mt-1">
                        Please wait a moment
                    </p>

                </div>

            </div>

        </div>
    );
}
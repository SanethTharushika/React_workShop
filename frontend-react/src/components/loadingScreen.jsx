export default function LoadingScreen() {
    return (
        <div className="w-screen h-screen fixed left-0 top-0 bg-black/70 z-50 flex justify-center items-center">
            <div className="w-[100px] h-[100px] rounded-full border-4 border-t-accent border-b-accent animate-spin"></div>
        </div>
    )
}
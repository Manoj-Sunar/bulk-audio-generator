
export const Background = () => {
    return (
        <div className="absolute inset-0 -z-20 overflow-hidden">
            <div className="animate-hero-glow absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[150px]" />

            <div className="animate-hero-glow absolute -right-52 bottom-0 h-[550px] w-[550px] rounded-full bg-secondary/15 blur-[180px]" />

            <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-primary-fixed/30 blur-[140px]" />
        </div>
    )
}
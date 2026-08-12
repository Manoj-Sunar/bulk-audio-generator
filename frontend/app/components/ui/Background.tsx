
export const Background = () => {
    return (
        <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-secondary/10 blur-[180px]" />
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[200px]" />
      </div>
    )
}
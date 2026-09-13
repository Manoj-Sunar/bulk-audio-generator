export const Background = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-primary/15 blur-[150px]" />
      <div className="absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-secondary/15 blur-[180px]" />
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[200px]" />
      <div className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-amber-400/5 blur-[120px]" />
      <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-purple-400/5 blur-[140px]" />
    </div>
  );
};
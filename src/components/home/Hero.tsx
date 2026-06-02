export const Hero = () => {
  return (
    <section className="relative bg-brand-red pt-24 pb-32 overflow-hidden">
      {/* Decorative circles to match the brand logo vibe */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[150%] rounded-full bg-brand-red-hover blur-3xl mix-blend-multiply" />
        <div className="absolute top-[10%] right-[5%] w-[40%] h-[120%] rounded-full bg-brand-red-dark blur-3xl mix-blend-multiply" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold font-heading text-white mb-6 tracking-tight">
          Simply. Fly.
        </h1>
        <p className="text-xl md:text-2xl text-white/90 font-body max-w-2xl mx-auto font-medium">
          Connect the points, fly the world. Experience modern aviation across Russia and Europe.
        </p>
      </div>
    </section>
  );
};

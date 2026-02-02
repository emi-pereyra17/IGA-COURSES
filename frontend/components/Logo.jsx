function Logo({ size = "md", showText = false }) {
  const sizes = {
    sm: { container: "w-10 h-10", flag: "w-5 h-5", text: "text-sm" },
    md: { container: "w-14 h-14", flag: "w-7 h-7", text: "text-base" },
    lg: { container: "w-20 h-20", flag: "w-10 h-10", text: "text-lg" },
  };

  const currentSize = sizes[size] || sizes.md;

  // Banderas de los países en círculo
  const flags = [
    { country: "Uruguay", emoji: "🇺🇾", position: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" },
    { country: "Paraguay", emoji: "🇵🇾", position: "top-1/4 right-0 translate-x-1/3 -translate-y-1/4" },
    { country: "Argentina", emoji: "🇦🇷", position: "bottom-1/4 right-0 translate-x-1/3 translate-y-1/4" },
    { country: "Brasil", emoji: "🇧🇷", position: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" },
    { country: "Bolivia", emoji: "🇧🇴", position: "top-1/4 left-0 -translate-x-1/3 -translate-y-1/4" },
  ];

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Círculo central con gradiente */}
      <div
        className={`${currentSize.container} relative rounded-full bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 shadow-lg flex items-center justify-center`}
      >
        {/* Chef hat emoji en el centro */}
        <span className="text-2xl">👨‍🍳</span>
      </div>

      {/* Banderas alrededor del círculo */}
      {flags.map((flag) => (
        <div
          key={flag.country}
          className={`absolute ${flag.position} ${currentSize.flag} bg-white rounded-full shadow-md flex items-center justify-center text-lg hover:scale-110 transition-transform cursor-pointer`}
          title={flag.country}
        >
          {flag.emoji}
        </div>
      ))}
    </div>
  );
}

export default Logo;

import { content } from '@/data/content';

type HeroSectionProps = {
  slide: number;
  onSelectSlide: (index: number) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

function HeroSection({ slide, onSelectSlide, onMouseEnter, onMouseLeave }: HeroSectionProps) {
  const current = content.heroSlides[slide];

  return (
    <section id="top" className="hero relative isolate min-h-[780px] h-[min(98dvh,1000px)] overflow-hidden text-[#ffffff]" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {content.heroSlides.map((item, index) => (
        <div key={item.title} className={`absolute inset-0 -z-20 transition-[opacity,transform] duration-[1800ms] ease-out ${index === slide ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.04]'}`}>
          <img
            key={`${item.title}-${index === slide}`}
            src={item.image}
            alt=""
            className={`h-full w-full object-cover ${index === slide ? 'hero-image' : ''}`}
          />
        </div>
      ))}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(17,42,35,.76)_0%,rgba(21,44,37,.34)_51%,rgba(16,34,29,.16)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(17,39,33,.65),transparent_45%)]" />
      <div className="mx-auto flex h-full max-w-[1440px] flex-col justify-between px-5 pb-10 pt-32 sm:px-8 sm:pb-14 lg:px-12 lg:pb-16">
        <div className="max-w-[620px]">
          <p className="eyebrow text-[#c9a227]" data-testid="text-hero-eyebrow">{current.eyebrow}</p>
          <h1 className="hero-title whitespace-pre-line" data-testid="text-hero-title">{current.title}</h1>
        </div>
        <div className="mt-auto flex flex-col gap-8 pt-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4" role="group" aria-label="Hero slideshow controls">
              <div className="flex items-center gap-2">
                {content.heroSlides.map((item, index) => (
                  <button type="button" key={item.title} onClick={() => onSelectSlide(index)} className={`hero-dot ${index === slide ? 'hero-dot-active' : ''}`} aria-label={`Show slide ${index + 1}`} data-testid={`button-hero-slide-${index + 1}`} />
                ))}
              </div>
              <span className="font-mono-display text-[10px] tracking-[.2em] text-[#ffffff]" data-testid="text-hero-count">0{slide + 1} / 0{content.heroSlides.length}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

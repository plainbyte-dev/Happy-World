import { content } from '@/data/content';

function HowWeTravelSection() {
  return (
    <section className="bg-[#dfe2ee] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div className="mx-auto grid max-w-[1240px] gap-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
        <div>
          <p className="eyebrow text-[#b8860b]">HOW WE TRAVEL</p>
          <h2 className="section-title mt-5 max-w-[480px]" data-testid="text-services-title">Good travel leaves room for the unexpected.</h2>
          <p className="body-large mt-7 max-w-[390px]">We make the practical feel easy, so there is more attention left for the fleeting things: light on a wall, a name remembered, the sound of a river below camp.</p>
        </div>
        <div className="service-list">
          {content.services.map((service) => (
            <div key={service.number} className="service-row" data-testid={`row-service-${service.number}`}>
              <span className="font-mono-display text-xs text-[#b8860b]">{service.number}</span>
              <div>
                <h3 className="font-display text-3xl leading-none">{service.title}</h3>
                <p className="mt-3 max-w-[430px] text-sm leading-relaxed text-[#56607d]">{service.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowWeTravelSection;

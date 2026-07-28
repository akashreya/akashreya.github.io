// Renders one entry of study.nav[mode], looked up against study.sections[] by id.
// API_HANDOVER_v3.2: `type` is a discriminator — an unrecognized type is skipped,
// not crashed on, since new types can land on the backend without a portfolio deploy.
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export function romanize(num) {
  const n = parseInt(num, 10);
  return Number.isFinite(n) && ROMAN[n - 1] ? ROMAN[n - 1] : num;
}

export default function CaseStudySection({ item, section, typePair }) {
  if (!section) return null;

  const title = section.title ?? item.name;
  const head = (
    <div className="cs-section__head">
      <h2 className="cs-section__title">
        {typePair && <span className="t-dots"><span className="a" /><span className="b" /></span>}
        {title}
      </h2>
      <span className="cs-section__num">§ {romanize(item.num)}</span>
    </div>
  );

  const sectionProps = {
    id: section.id,
    className: 'cs-section reveal' + (typePair ? ' t-section' : ''),
    ...(typePair ? { 'data-type-pair': typePair } : {}),
  };

  switch (section.type) {
    case 'prose':
      // The outcome section is the one prose section styled as a highlighted callout card —
      // that's a fixed design choice keyed on id, not something the "prose" type itself implies.
      return (
        <section {...sectionProps}>
          {head}
          <div
            className={section.id === 'outcome' ? 'cs-outcome-card cs-prose' : 'cs-prose'}
            dangerouslySetInnerHTML={{ __html: section.body }}
          />
        </section>
      );

    case 'diagram':
      return (
        <section {...sectionProps}>
          {head}
          <div className="cs-prose" dangerouslySetInnerHTML={{ __html: section.intro }} />
          <pre className="cs-ascii">{section.diagram}</pre>
          <div className="cs-prose" dangerouslySetInnerHTML={{ __html: section.outro }} />
        </section>
      );

    case 'decisions':
      return (
        <section {...sectionProps}>
          {head}
          <div className="cs-decisions">
            {(section.items ?? []).map((d, i) => (
              <div key={i} className="cs-decision">
                <div>
                  <div className="cs-decision__choice">{d.choice}</div>
                  <div className="cs-decision__alts">{section.alternativesLabel} {d.alternatives}</div>
                </div>
                <div className="cs-decision__why">{d.reasoning}</div>
              </div>
            ))}
          </div>
        </section>
      );

    case 'timeline':
      return (
        <section {...sectionProps}>
          {head}
          <div className="cs-process">
            {(section.phases ?? []).map((ph, i) => (
              <div key={i} className="cs-phase">
                <div className="cs-phase__date">{ph.date}</div>
                <div>
                  <h3 className="cs-phase__name">{ph.name}</h3>
                  <div className="cs-phase__body">{ph.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    case 'tradeoffs':
      return (
        <section {...sectionProps}>
          {head}
          <div className="cs-tradeoffs">
            <div className="cs-tradeoff">
              <div className="cs-tradeoff__l">{section.gainedLabel}</div>
              <div className="cs-tradeoff__b">{section.gained}</div>
            </div>
            <div className="cs-tradeoff">
              <div className="cs-tradeoff__l">{section.gaveUpLabel}</div>
              <div className="cs-tradeoff__b">{section.gaveUp}</div>
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
}

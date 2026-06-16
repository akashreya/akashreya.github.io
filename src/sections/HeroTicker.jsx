const TICKER_LINES = [
  'Built POKÉTOPIA solo. Nine regions. Lunatone/Solrock toggle was necessary. Thematic integrity.',
  'The diff tool: 4.5 hours → 30 seconds. Planning to put it on PyPI one day.',
  'Three books in 2025. Did not announce them. They exist anyway.',
  'Won the FICO hackathon. Was in Bengaluru when they demoed it. The thing ran.',
  'Hot water. Not coffee. This is not a debate.',
  'MarketStream reimagines LSEG RFA. Open-source. Lives on AWS free tier.',
  'Everything ABC: 1300+ items. Custom CMS. 99.2% API payload reduction.',
  'Builds things. Finishes them. Has opinions about fonts.',
  'Staff engineer. 13 years. Still writes code.',
  'The point is not going to do it properly.',
];

export default function HeroTicker() {
  const doubled = [...TICKER_LINES, ...TICKER_LINES];
  return (
    <div className="ticker-wrap" aria-hidden="true">
      <div className="ticker-inner">
        {doubled.map((line, i) => (
          <span key={i} className="ti">{line}</span>
        ))}
      </div>
    </div>
  );
}

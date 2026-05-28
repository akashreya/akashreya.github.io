export default function LiveBanner({ liveBanner }) {
  const { label, title, sub, badgeBig, badgeSmall, badgeLabel } = liveBanner;

  return (
    <section id="live" className="page reveal">
      <div className="live">
        <div className="live__left">
          <div className="live__dot" />
          <div>
            <div className="live__label">{label}</div>
            <div className="live__title">{title}</div>
            <div className="live__sub">{sub}</div>
          </div>
        </div>
        <div className="live__badge">
          <div className="live__big">
            {badgeBig}
            <span className="live__small">{badgeSmall}</span>
          </div>
          <div className="live__caption">{badgeLabel}</div>
        </div>
      </div>
    </section>
  );
}

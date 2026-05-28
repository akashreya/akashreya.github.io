import { useState, useEffect } from 'react';
import { fetchSite, fetchProjects } from '../api/client';
import { fallbackSite, fallbackProjects } from '../data/fallback';
import { useReveal } from '../hooks/useReveal';
import NavPill from '../components/NavPill';
import TopMark from '../components/TopMark';
import ThemeHint from '../components/ThemeHint';
import Hero from '../sections/Hero';
import LiveBanner from '../sections/LiveBanner';
import Projects from '../sections/Projects';
import Principles from '../sections/Principles';
import Enterprise from '../sections/Enterprise';
import Footer from '../sections/Footer';

export default function PortfolioPage() {
  const [site, setSite] = useState(fallbackSite);
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    fetchSite().then(setSite);
    fetchProjects().then(setProjects);
  }, []);

  useReveal([site, projects]);

  return (
    <>
      <TopMark brand={site.brand} />
      <Hero hero={site.hero} />
      <LiveBanner liveBanner={site.liveBanner} />
      <Projects projects={projects} />
      <Principles principles={site.principles} />
      <Enterprise enterprise={site.enterprise} />
      <Footer brand={site.brand} contact={site.contact} />
      <NavPill items={site.nav} />
      <ThemeHint />
    </>
  );
}

import { useState, useEffect } from 'react';
import { fetchSite, fetchProjects, resolveVoice } from '../api/client';
import { fallbackProjects } from '../data/fallback';
import { useTheme } from '../theme/ThemeProvider';
import { useReveal } from '../hooks/useReveal';
import NavPill from '../components/NavPill';
import TopMark from '../components/TopMark';
import ThemeHint from '../components/ThemeHint';
import ModeTransition from '../components/ModeTransition';
import AmbientBlobs from '../components/AmbientBlobs';
import Footprints from '../components/Footprints';
import Chikorita from '../components/Chikorita';
import ConsoleLine from '../components/ConsoleLine';
import Hero from '../sections/Hero';
import LiveBanner from '../sections/LiveBanner';
import Projects from '../sections/Projects';
import SideQuests from '../sections/SideQuests';
import Principles from '../sections/Principles';
import Enterprise from '../sections/Enterprise';
import Footer from '../sections/Footer';

export default function PortfolioPage() {
  const [site, setSite] = useState(null);
  const [projects, setProjects] = useState(fallbackProjects);
  const { mode } = useTheme();
  const resolved = resolveVoice(site, mode);

  useEffect(() => {
    fetchSite().then(setSite);
    fetchProjects().then(setProjects);
  }, []);

  useReveal(site, projects);

  return (
    <>
      <AmbientBlobs />
      <Footprints />
      <Chikorita />
      <TopMark brand={resolved.brand} />
      <ConsoleLine />
      <Hero hero={resolved.hero} />
      <LiveBanner liveBanner={resolved.liveBanner} />
      <Projects projects={projects} />
      <SideQuests />
      <Principles principles={resolved.principles} />
      <Enterprise enterprise={resolved.enterprise} contact={resolved.contact} />
      <Footer brand={resolved.brand} contact={resolved.contact} />
      <NavPill items={resolved.nav} />
      <ThemeHint />
      <ModeTransition />
    </>
  );
}

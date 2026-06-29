import { useState, useEffect } from 'react';
import { fetchSite, fetchProjects, resolveVoice } from '../api/client';
import { fallbackSite, fallbackProjects, fallbackSiteRecruiter, fallbackSitePersonal } from '../data/fallback';
import { useTheme } from '../theme/ThemeProvider';
import { useReveal } from '../hooks/useReveal';
import NavPill from '../components/NavPill';
import TopMark from '../components/TopMark';
import ThemeHint from '../components/ThemeHint';
import ModeTransition from '../components/ModeTransition';
import AmbientBlobs from '../components/AmbientBlobs';
import ConsoleLine from '../components/ConsoleLine';
import Hero from '../sections/Hero';
import LiveBanner from '../sections/LiveBanner';
import Projects from '../sections/Projects';
import SideQuests from '../sections/SideQuests';
import Principles from '../sections/Principles';
import Enterprise from '../sections/Enterprise';
import Footer from '../sections/Footer';

export default function PortfolioPage() {
  const [site, setSite] = useState({ recruiter: fallbackSiteRecruiter, personal: fallbackSitePersonal, ...fallbackSite });
  const [projects, setProjects] = useState(fallbackProjects);
  const { mode } = useTheme();
  const resolved = resolveVoice(site, mode);

  useEffect(() => {
    fetchSite().then(setSite);
    fetchProjects().then(setProjects);
  }, []);

  useReveal([site, projects]);

  return (
    <>
      <AmbientBlobs />
      <TopMark brand={resolved.brand} />
      <ConsoleLine />
      <Hero hero={resolved.hero} />
      <LiveBanner liveBanner={resolved.liveBanner} />
      <Projects projects={projects} />
      <SideQuests />
      <Principles principles={resolved.principles} />
      <Enterprise enterprise={site.enterprise} contact={site.contact} />
      <Footer brand={resolved.brand} contact={resolved.contact} />
      <NavPill items={site.nav} />
      <ThemeHint />
      <ModeTransition />
    </>
  );
}

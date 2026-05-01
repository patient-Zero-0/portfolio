import Hero       from '@/components/sections/Hero';
import About      from '@/components/sections/About';
import Projects   from '@/components/sections/Projects';
import Skills     from '@/components/sections/Skills';
import Experience from '@/components/sections/Experience';
import Contact    from '@/components/sections/Contact';
import Navbar     from '@/components/layout/Navbar';
import {
  FullPageProvider,
  FullPageSlides,
  FullPageDots,
} from '@/components/layout/FullPage';

const SECTIONS = ['Hero', 'About', 'Projects', 'Skills', 'Experience', 'Contact'];

export default function Home() {
  return (
    <FullPageProvider total={SECTIONS.length}>
      <Navbar />
      <FullPageSlides>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </FullPageSlides>
      <FullPageDots labels={SECTIONS} />
    </FullPageProvider>
  );
}

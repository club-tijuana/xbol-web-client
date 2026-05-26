"use client";

import { useEffect, useMemo, useState } from "react";

import styles from "./page.module.scss";

type TocLink = {
  href: `#${string}`;
  label: string;
};

type LegalTableOfContentsProps = {
  links: readonly TocLink[];
};

const activeOffset = 140;

function getActiveSectionId(sectionIds: string[]) {
  return sectionIds.reduce((currentId, sectionId) => {
    const section = document.getElementById(sectionId);

    if (!section) {
      return currentId;
    }

    return section.getBoundingClientRect().top <= activeOffset
      ? sectionId
      : currentId;
  }, sectionIds[0]);
}

export default function LegalTableOfContents({
  links,
}: LegalTableOfContentsProps) {
  const sectionIds = useMemo(
    () => links.map((link) => link.href.slice(1)),
    [links],
  );
  const [activeSectionId, setActiveSectionId] = useState(sectionIds[0]);

  useEffect(() => {
    if (sectionIds.length === 0) {
      return;
    }

    let animationFrameId = 0;

    const updateActiveSection = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const currentSectionId = getActiveSectionId(sectionIds);

        setActiveSectionId((activeId) =>
          activeId === currentSectionId ? activeId : currentSectionId,
        );
      });
    };

    const observer = new IntersectionObserver(updateActiveSection, {
      rootMargin: `-${activeOffset}px 0px -65% 0px`,
      threshold: [0, 1],
    });

    sectionIds.forEach((sectionId) => {
      const section = document.getElementById(sectionId);

      if (section) {
        observer.observe(section);
      }
    });

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [sectionIds]);

  return (
    <nav className={styles.toc} aria-label="Contenido legal">
      {links.map((link) => {
        const sectionId = link.href.slice(1);
        const isActive = sectionId === activeSectionId;

        return (
          <a
            key={link.href}
            href={link.href}
            className={isActive ? styles.activeTocLink : styles.tocLink}
            aria-current={isActive ? "location" : undefined}
          >
            {link.label}
          </a>
        );
      })}
    </nav>
  );
}

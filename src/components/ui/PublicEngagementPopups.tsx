import React, { useEffect, useState } from 'react';
import { FairModal } from './FairModal';
import { NewsletterPopup } from './NewsletterPopup';
import { useAppImages } from '../../context/ImageContext';

/**
 * Public-site engagement sequence.
 * The fair invitation is shown once per browser session.
 * 1) Fair invitation after 5s (when enabled and not already shown in this session)
 * 2) Newsletter 10s after the fair closes
 *    If there is no active fair, newsletter appears 10s after page load.
 */
export const PublicEngagementPopups: React.FC = () => {
  const { fairConfig } = useAppImages();
  const [fairOpen, setFairOpen] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  useEffect(() => {
    let newsletterTimer: number | undefined;
    const fairAlreadyShown = sessionStorage.getItem('iremcomfort_fair_seen_session') === '1';

    const fairTimer = window.setTimeout(() => {
      if (fairConfig?.enabled && !fairAlreadyShown) {
        sessionStorage.setItem('iremcomfort_fair_seen_session', '1');
        setFairOpen(true);
      } else {
        newsletterTimer = window.setTimeout(() => setNewsletterOpen(true), 10000);
      }
    }, 5000);

    return () => {
      window.clearTimeout(fairTimer);
      if (newsletterTimer) window.clearTimeout(newsletterTimer);
    };
  }, [fairConfig?.enabled]);

  const closeFair = () => {
    setFairOpen(false);
    window.setTimeout(() => setNewsletterOpen(true), 10000);
  };

  return (
    <>
      <FairModal isOpen={fairOpen} onClose={closeFair} />
      <NewsletterPopup forceOpen={newsletterOpen} onClose={() => setNewsletterOpen(false)} />
    </>
  );
};

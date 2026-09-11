import { useEffect } from 'react';

/**
 * Sets document.title and meta description for each page.
 * @param {string} title - Page title (will be suffixed with " | BhuRakshak EWS")
 * @param {string} description - Meta description content
 */
export default function usePageMeta(title, description) {
  useEffect(() => {
    const suffix = ' | BhuRakshak EWS';
    document.title = title.includes('BhuRakshak') ? title : title + suffix;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }, [title, description]);
}

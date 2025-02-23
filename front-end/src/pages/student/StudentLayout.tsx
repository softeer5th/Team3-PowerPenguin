import { useEffect } from 'react';
import { Outlet } from 'react-router';

const StudentLayout = () => {
  useEffect(() => {
    const metaTag = document.querySelector("meta[name='viewport']");
    const originalContent = metaTag?.getAttribute('content');

    if (metaTag) {
      metaTag.setAttribute(
        'content',
        'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover'
      );
    }

    return () => {
      if (metaTag && originalContent) {
        metaTag.setAttribute('content', originalContent);
      }
    };
  }, []);

  useEffect(() => {
    const applyZoom = () => {
      const width = window.outerWidth;

      if (window.matchMedia('(min-width: 961px)').matches) {
        document.body.style.zoom = `${width / 1920}`;
        document.body.style.backgroundColor = 'var(--gray-200)';
      } else {
        document.body.style.zoom = '1';
        document.body.style.backgroundColor = '';
      }
    };

    applyZoom();
    window.addEventListener('resize', applyZoom);

    return () => {
      window.removeEventListener('resize', applyZoom);
      document.body.style.zoom = '1';
    };
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default StudentLayout;

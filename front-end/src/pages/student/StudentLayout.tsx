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

  return (
    <>
      <Outlet />
    </>
  );
};

export default StudentLayout;

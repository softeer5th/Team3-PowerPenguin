import { useEffect } from 'react';
import { Outlet } from 'react-router';

const ProfessorLayout = () => {
  useEffect(() => {
    document.body.style.zoom = `${window.screen.width / 1920}`;

    return () => {
      document.body.style.zoom = '1';
    };
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default ProfessorLayout;

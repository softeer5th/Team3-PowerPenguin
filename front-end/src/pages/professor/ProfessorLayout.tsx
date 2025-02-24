import { useEffect } from 'react';
import { Outlet } from 'react-router';

const ProfessorLayout = () => {
  useEffect(() => {
    document.title = 'Professor';
    document.body.style.zoom = `${window.screen.width / 1920}`;
    document.body.style.backgroundColor = 'black';
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default ProfessorLayout;

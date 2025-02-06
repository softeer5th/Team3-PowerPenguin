import { Outlet } from 'react-router';

const ProfessorLayout = () => {
  return (
    <>
      <style>
        {`body { zoom: ${window.outerWidth / 1920}; background-color: black; }`}
      </style>
      <Outlet />
    </>
  );
};

export default ProfessorLayout;

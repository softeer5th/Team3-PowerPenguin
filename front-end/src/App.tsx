import { BrowserRouter, Route, Routes } from 'react-router';

import Home from './pages/home';
import ProfessorHomeLayout from './pages/professor/home/layout/ProfessorHomeLayout';
import ProfessorHome from './pages/professor/home/ProfessorHome';
import ProfessorSearch from './pages/professor/home/search';
import ProfessorLogin from './pages/professor/login/ProfessorLogin';
import ProfessorRegister from './pages/professor/register/ProfessorRegister';
import ProfessorProfile from './pages/professor/profile';
import ProfessorCourse from './pages/professor/course';
import ProfessorClassRoom from './pages/professor/course/classroom';
import StudentHome from './pages/student/home/StudentHome';
import StudentCourse from './pages/student/course';
import ProfessorLayout from './pages/professor/ProfessorLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="professor" element={<ProfessorLayout />}>
          <Route element={<ProfessorHomeLayout />}>
            <Route index element={<ProfessorHome />} />
            <Route path="search" element={<ProfessorSearch />} />
          </Route>
          <Route path="login" element={<ProfessorLogin />} />
          <Route path="register" element={<ProfessorRegister />} />
          <Route path="profile" element={<ProfessorProfile />} />
          <Route path="course/:courseId">
            <Route index element={<ProfessorCourse />} />
            <Route path="classroom" element={<ProfessorClassRoom />} />
          </Route>
        </Route>
        <Route path="student">
          <Route index element={<StudentHome />} />
          <Route path="course/:courseId" element={<StudentCourse />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

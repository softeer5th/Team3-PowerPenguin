import { BrowserRouter, Route, Routes } from 'react-router';

import Home from './pages/home';
import ProfessorHomeLayout from './pages/professor/home/layout';
import ProfessorHome from './pages/professor/home';
import ProfessorSearch from './pages/professor/home/search';
import ProfessorLogin from './pages/professor/login';
import ProfessorRegister from './pages/professor/register';
import ProfessorProfile from './pages/professor/profile';
import ProfessorCourse from './pages/professor/course';
import ProfessorClassRoom from './pages/professor/course/classroom';
import StudentHome from './pages/student/home';
import StudentCourse from './pages/student/course';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="professor">
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

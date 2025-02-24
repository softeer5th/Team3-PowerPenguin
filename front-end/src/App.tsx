import { BrowserRouter, Route, Routes } from 'react-router';
import { Suspense, lazy } from 'react';

import Home from './pages/home/Home';
import ProfessorLoading from './pages/professor/loading/ProfessorLoading';
import ProfessorLayout from './pages/professor/ProfessorLayout';
import ProfessorHomeLayout from './pages/professor/home/layout/ProfessorHomeLayout';
import StudentHome from './pages/student/home/StudentHome';
import Loading from './pages/loading/Loading';

const ProfessorHome = lazy(
  () => import('./pages/professor/home/ProfessorHome')
);
const ProfessorSearch = lazy(
  () => import('./pages/professor/home/search/ProfessorSearch')
);
const ProfessorProfile = lazy(
  () => import('./pages/professor/home/profile/ProfessorProfile')
);
const ProfessorLogin = lazy(
  () => import('./pages/professor/login/ProfessorLogin')
);
const ProfessorRegister = lazy(
  () => import('./pages/professor/register/ProfessorRegister')
);
const ProfessorCourse = lazy(
  () => import('./pages/professor/course/ProfessorCourse')
);
const ProfessorClassRoom = lazy(
  () => import('./pages/professor/course/classroom/ProfessorClassroom')
);

const StudentCourse = lazy(
  () => import('./pages/student/course/StudentCourse')
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />

        <Route path="professor" element={<ProfessorLayout />}>
          <Route element={<ProfessorHomeLayout />}>
            <Route
              index
              element={
                <Suspense fallback={<Loading />}>
                  <ProfessorHome />
                </Suspense>
              }
            />
            <Route
              path="search"
              element={
                <Suspense fallback={<Loading />}>
                  <ProfessorSearch />
                </Suspense>
              }
            />
            <Route
              path="profile"
              element={
                <Suspense fallback={<Loading />}>
                  <ProfessorProfile />
                </Suspense>
              }
            />
          </Route>

          <Route
            path="login"
            element={
              <Suspense fallback={<Loading />}>
                <ProfessorLogin />
              </Suspense>
            }
          />
          <Route path="loading" element={<ProfessorLoading />} />
          <Route
            path="register"
            element={
              <Suspense fallback={<Loading />}>
                <ProfessorRegister />
              </Suspense>
            }
          />
          <Route path="course/:courseId">
            <Route
              index
              element={
                <Suspense fallback={<Loading />}>
                  <ProfessorCourse />
                </Suspense>
              }
            />
            <Route path="classroom" element={<ProfessorClassRoom />} />
          </Route>
        </Route>

        <Route path="student">
          <Route index element={<StudentHome />} />
          <Route
            path="course"
            element={
              <Suspense fallback={<Loading />}>
                <StudentCourse />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

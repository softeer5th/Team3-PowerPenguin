import { BrowserRouter, Route, Routes } from 'react-router';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="professor">
          <Route index element={<ProfessorHomeLayout />}>
            <Route index element={<ProfessorHome />} />
            <Route path="search" element={<ProfessorSearch />} />
          </Route>
          <Route path="login" element={<ProfessorLogin />} />
          <Route path="register" element={<ProfessorRegister />} />
          <Route path="profile" element={<ProfessorProfile />} />
          <Route path="course/:id">
            <Route index element={<ProfessorCourse />} />
            <Route path="classroom" element={<ProfessorClassRoom />} />
          </Route>
        </Route>
        <Route path="student">
          <Route index element={<StudentHome />} />
          <Route path="course/:id" element={<StudentCourse />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

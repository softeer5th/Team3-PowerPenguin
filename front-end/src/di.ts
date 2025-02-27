import AuthRepository from './repository/authRepository';
import ClassroomRepository from './repository/classroomRepository';
import CourseRepository from './repository/courseRepository';
import ProfessorRepository from './repository/professorRepository';

export const authRepository: AuthRepository = new AuthRepository();
export const classroomRepository: ClassroomRepository =
  new ClassroomRepository();
export const courseRepository: CourseRepository = new CourseRepository();
export const professorRepository: ProfessorRepository =
  new ProfessorRepository();

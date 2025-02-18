import { ClientError, ServerError } from '@/core/errorType';
import {
  Course,
  CourseMeta,
  CourseSummary,
  RequestFast,
  RequestHard,
  RequestQuestion,
  RequestSize,
  RequestSound,
  ResponseError,
} from '@/core/model';

// Mock data
const course1: CourseMeta = {
  id: '1',
  name: '학문의 생성과 발전',
  code: '3290-110',
  capacity: 300,
  university: '소프대학교',
  classType: '전공',
  schedule: [{ day: '월', start: '08:00', end: '10:00' }],
  accessCode: 382294,
  fileURL: 'https://avatars.githubusercontent.com/u/11627623?v=4',
};

const course2: CourseMeta = {
  id: '2',
  name: '학문의 생성과 발전',
  code: '3290-001',
  capacity: 300,
  university: '소프대학교',
  classType: '교양',
  schedule: [
    { day: '월', start: '08:00', end: '10:00' },
    { day: '수', start: '10:00', end: '12:00' },
  ],
  accessCode: 382294,
  fileURL: 'https://avatars.githubusercontent.com/u/11627623?v=4',
};

const course3: CourseMeta = {
  id: '3',
  name: '심리학과 학문의 연관',
  code: '3290-002',
  capacity: 300,
  university: '소프대학교',
  classType: '전공',
  schedule: [{ day: '월', start: '17:00', end: '18:00' }],
  accessCode: 382294,
  fileURL: 'https://avatars.githubusercontent.com/u/11627623?v=4',
};

const course4: CourseMeta = {
  id: '4',
  name: '행복학개론',
  code: '20200494',
  capacity: 300,
  university: '소프대학교',
  classType: '교양',
  schedule: [{ day: '월', start: '19:00', end: '21:00' }],
  accessCode: 382294,
  fileURL: 'https://avatars.githubusercontent.com/u/11627623?v=4',
};

const course5: CourseMeta = {
  id: '5',
  name: '학문의 생성과 발전',
  code: '3290-001',
  capacity: 300,
  university: '소프대학교',
  classType: '교양',
  schedule: [{ day: '월', start: '08:00', end: '10:00' }],
  accessCode: 382294,
  fileURL: 'https://avatars.githubusercontent.com/u/11627623?v=4',
};

const course6: CourseMeta = {
  id: '6',
  name: '학문의 생성과 발전',
  code: '3290-001',
  capacity: 300,
  university: '소프대학교',
  classType: '교양',
  schedule: [{ day: '월', start: '08:00', end: '10:00' }],
  accessCode: 382294,
  fileURL: 'https://avatars.githubusercontent.com/u/11627623?v=4',
};

const course7: CourseMeta = {
  id: '7',
  name: '정신건강의 이해',
  code: '2570-301',
  capacity: 300,
  university: '소프대학교',
  classType: '교양',
  schedule: [{ day: '월', start: '08:00', end: '10:00' }],
  accessCode: 382294,
  fileURL: 'https://avatars.githubusercontent.com/u/11627623?v=4',
};

const course8: CourseMeta = {
  id: '8',
  name: 'UI 디자인',
  code: '3590-041',
  capacity: 300,
  university: '소프대학교',
  classType: '전공',
  schedule: [{ day: '수', start: '10:00', end: '12:00' }],
  accessCode: 382294,
  fileURL: 'https://avatars.githubusercontent.com/u/11627623?v=4',
};

class CourseRepository {
  async createCourse(course: CourseMeta): Promise<void> {
    // API: POST /professors/courses
    // Request body: course: CourseMeta

    console.log('create course:', course);
  }

  async uploadCourseFile(courseId: string, file: File): Promise<string> {
    // API: POST /professors/courses/{courseId}/file
    // Request body: FormData { key: 'courseFile', value: file }

    console.log('upload course file:', courseId, file);
    return 'https://avatars.githubusercontent.com/u/11627623?v=4';
  }

  async getHomeCourses(): Promise<{
    todayCourse: CourseMeta[];
    totalCourse: CourseMeta[];
  }> {
    // API: GET /professors/courses/home

    return {
      todayCourse: [course1, course2, course3, course4],
      totalCourse: [
        course1,
        course2,
        course3,
        course4,
        course5,
        course6,
        course7,
        course8,
      ],
    };
  }

  async getOpenedCourse(): Promise<CourseMeta> {
    // API: GET /professor/courses/active

    return course1;
  }

  async searchCourses(keyword: string): Promise<CourseMeta[]> {
    // API: GET /professors/courses?keyword={keyword}

    console.log('search course:', keyword);
    return [course1, course2, course3, course4];
  }

  async getCourseById(courseId: number): Promise<Course> {
    // API: GET /professors/courses/{courseId}

    console.log('get course:', courseId);
    return {
      ...course1,
      requests: [
        { type: RequestHard, count: 30 },
        { type: RequestFast, count: 0 },
        { type: RequestQuestion, count: 40 },
        { type: RequestSize, count: 50 },
        { type: RequestSound, count: 20 },
      ],
      questions: [
        { id: '1', time: '', content: '이 강의는 어떤 내용을 다루나요?' },
        { id: '2', time: '', content: 'a'.repeat(200) },
      ],
    };
  }

  async getCourseSummary(accessCode: number): Promise<CourseSummary> {
    // API: GET /students/courses/${accessCode}/summary

    const response = await fetch(
      `/api/students/courses/${accessCode}/summary`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();

    if (!response.ok) {
      if (response.status >= 500) throw new ServerError(data as ResponseError);
      else {
        throw new ClientError(data as ResponseError);
      }
    }

    // return {
    //   name: course1.name,
    //   code: course1.code,
    //   schedule: course1.schedule,
    //   capacity: course1.capacity,
    //   university: course1.university,
    //   classType: course1.classType,
    // };
    return data;
  }

  async getCourseFile(courseId: string): Promise<File> {
    // API: GET /professors/courses/{courseId}/file

    console.log('get course file:', courseId);
    return new File([''], 'course-file');
  }

  async updateCourse(course: CourseMeta): Promise<void> {
    // API: PUT /professors/courses/{course.id}
    // Request body: Omit<CourseMeta, 'id'>

    console.log('update course:', course);
  }

  async deleteCourse(courseId: number): Promise<void> {
    // API: DELETE /professors/courses/{courseId}

    console.log('delete course:', courseId);
  }
}

export default CourseRepository;

import {
  Course,
  CourseMeta,
  CourseSummary,
  Question,
  RequestFast,
  RequestHard,
  RequestQuestion,
  RequestSize,
  RequestSound,
} from '@/core/model';
import { throwError } from './throwError';

type BackendSchedule = {
  day: '월' | '화' | '수' | '목' | '금' | '토' | '일';
  startTime: string;
  endTime: string;
};

type BackendQuestion = {
  id: number | string;
  time: string;
  content: string;
};

type BackendRequests = [
  {
    type: 'SCREEN_ISSUE';
    count: number | string;
  },
  {
    type: 'HAVE_QUESTION';
    count: number | string;
  },
  {
    type: 'DIFFICULT';
    count: number | string;
  },
  {
    type: 'SOUND_ISSUE';
    count: number | string;
  },
  {
    type: 'TOO_FAST';
    count: number | string;
  },
];

type BackendCourse = {
  id: string | number;
  name: string;
  courseCode: string;
  capacity: number | string;
  university: string;
  type: 'MAJOR' | 'GENERAL' | 'OTHER';
  schedules: BackendSchedule[];
  accessCode: string | number;
  fileName: string;
  questions: BackendQuestion[];
  requests: BackendRequests;
};

class CourseRepository {
  async createCourse(course: CourseMeta): Promise<void> {
    // API: POST /professors/courses
    // Request body: course: CourseMeta

    const body = {
      name: course.name,
      courseCode: course.code,
      capacity: course.capacity,
      university: course.university,
      type:
        course.classType === '전공'
          ? 'MAJOR'
          : course.classType === '교양'
            ? 'GENERAL'
            : 'OTHER',
      schedules: course.schedule.map((schedule) => ({
        day: schedule.day,
        startTime: schedule.start,
        endTime: schedule.end,
      })),
    };

    const response = await fetch(`/api/professors/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    await throwError(response);
  }

  async getHomeCourses(): Promise<{
    todayCourse: CourseMeta[];
    totalCourse: CourseMeta[];
  }> {
    // API: GET /professors/courses/home

    const response = await fetch(`/api/professors/courses/home`, {
      method: 'GET',
      credentials: 'include',
    });

    await throwError(response);

    const json = await response.json();

    const todayCourse: CourseMeta[] =
      json.data.today.map(
        (course: BackendCourse) =>
          ({
            id: course.id,
            name: course.name,
            code: course.courseCode,
            capacity: course.capacity,
            university: course.university,
            classType:
              course.type === 'MAJOR'
                ? '전공'
                : course.type === 'GENERAL'
                  ? '교양'
                  : '기타',
            schedule: course.schedules.map((schedule) => ({
              day: schedule.day,
              start: schedule.startTime,
              end: schedule.endTime,
            })),
            accessCode: course.accessCode,
            fileName: course.fileName,
          }) as CourseMeta
      ) || ([] as CourseMeta[]);

    const totalCourse: CourseMeta[] =
      json.data.all.map((course: BackendCourse) => {
        return {
          id: course.id,
          name: course.name,
          code: course.courseCode,
          capacity: course.capacity,
          university: course.university,
          classType:
            course.type === 'MAJOR'
              ? '전공'
              : course.type === 'GENERAL'
                ? '교양'
                : '기타',
          schedule: course.schedules.map((schedule) => ({
            day: schedule.day,
            start: schedule.startTime,
            end: schedule.endTime,
          })),
          accessCode: course.accessCode,
          fileName: course.fileName,
        } as CourseMeta;
      }) || ([] as CourseMeta[]);

    return { todayCourse: todayCourse, totalCourse: totalCourse };
  }

  async getOpenedCourse(): Promise<CourseMeta | void> {
    // API: GET /professor/courses/active

    const response = await fetch(`/api/professors/courses/active`, {
      method: 'GET',
      redirect: 'follow',
      credentials: 'include',
    });

    if (response.redirected) {
      window.location.href = response.url;
      return;
    }

    await throwError(response);

    const json = await response.json();
    const data = json.data as BackendCourse;

    const course: CourseMeta = {
      id: data.id,
      name: data.name,
      code: data.courseCode,
      capacity: data.capacity,
      university: data.university,
      classType:
        data.type === 'MAJOR'
          ? '전공'
          : data.type === 'GENERAL'
            ? '교양'
            : '기타',
      schedule: data.schedules.map((schedule) => ({
        day: schedule.day,
        start: schedule.startTime,
        end: schedule.endTime,
      })),
      accessCode: data.accessCode,
      fileName: data.fileName,
    } as CourseMeta;

    return course;
  }

  async searchCourses(keyword: string): Promise<CourseMeta[]> {
    // API: GET /professors/courses?keyword={keyword}

    const response = await fetch(`/api/professors/courses?keyword=${keyword}`, {
      method: 'GET',
      credentials: 'include',
    });

    await throwError(response);

    const json = await response.json();
    const data = json.data as BackendCourse[];

    const courses: CourseMeta[] = data.map(
      (course) =>
        ({
          id: course.id,
          name: course.name,
          code: course.courseCode,
          capacity: course.capacity,
          university: course.university,
          classType:
            course.type === 'MAJOR'
              ? '전공'
              : course.type === 'GENERAL'
                ? '교양'
                : '기타',
          schedule: course.schedules.map((schedule) => ({
            day: schedule.day,
            start: schedule.startTime,
            end: schedule.endTime,
          })),
          accessCode: course.accessCode,
          fileName: course.fileName,
        }) as CourseMeta
    );

    return courses;
  }

  async getCourseById(courseId: Course['id']): Promise<Course> {
    // API: GET /professors/courses/{courseId}

    const response = await fetch(`/api/professors/courses/${courseId}`, {
      method: 'GET',
      credentials: 'include',
    });

    await throwError(response);

    const json = await response.json();
    const data = json.data as BackendCourse;

    const course: Course = {
      id: data.id,
      name: data.name,
      code: data.courseCode,
      capacity: data.capacity,
      university: data.university,
      classType:
        data.type === 'MAJOR'
          ? '전공'
          : data.type === 'GENERAL'
            ? '교양'
            : '기타',
      schedule: data.schedules.map((schedule) => ({
        day: schedule.day,
        start: schedule.startTime,
        end: schedule.endTime,
      })),
      accessCode: data.accessCode,
      fileName: data.fileName,
      questions: data.questions.map(
        (question) =>
          ({
            id: question.id,
            createdAt: question.time,
            content: question.content,
          }) as Question
      ),
      requests: [
        {
          type: RequestHard,
          count: data.requests?.find((req) => req.type === RequestHard.kind)
            ?.count,
        },
        {
          type: RequestFast,
          count: data.requests?.find((req) => req.type === RequestFast.kind)
            ?.count,
        },
        {
          type: RequestQuestion,
          count: data.requests?.find((req) => req.type === RequestQuestion.kind)
            ?.count,
        },
        {
          type: RequestSize,
          count: data.requests?.find((req) => req.type === RequestSize.kind)
            ?.count,
        },
        {
          type: RequestSound,
          count: data.requests?.find((req) => req.type === RequestSound.kind)
            ?.count,
        },
      ],
    } as Course;

    return course;
  }

  async getCourseFileUrl(courseId: Course['id']): Promise<string> {
    // API: GET /professors/courses/{courseId}/file

    const response = await fetch(`/api/professors/courses/${courseId}/file`, {
      method: 'GET',
      credentials: 'include',
    });

    await throwError(response);

    const json = await response.json();
    return json.data.fileUrl;
  }

  async getCourseSummary(
    accessCode: Course['accessCode']
  ): Promise<CourseSummary> {
    // API: GET /students/courses/${accessCode}/summary

    const response = await fetch(
      `/api/students/courses/${accessCode}/summary`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    await throwError(response);

    const json = await response.json();
    const data = json.data as BackendCourse;

    const courseSummary: CourseSummary = {
      name: data.name,
      code: data.courseCode,
      capacity: data.capacity,
      university: data.university,
      classType:
        data.type === 'MAJOR'
          ? '전공'
          : json.data.type === 'GENERAL'
            ? '교양'
            : '기타',
      schedule: data.schedules.map((schedule: BackendSchedule) => ({
        day: schedule.day,
        start: schedule.startTime,
        end: schedule.endTime,
      })),
    } as CourseSummary;

    return courseSummary;
  }

  async updateCourse(course: CourseMeta): Promise<void> {
    // API: PUT /professors/courses/{course.id}
    // Request body: Omit<CourseMeta, 'id'>

    const body: Omit<
      BackendCourse,
      'id' | 'accessCode' | 'fileName' | 'questions' | 'requests'
    > = {
      name: course.name,
      courseCode: course.code,
      capacity: course.capacity,
      university: course.university,
      type:
        course.classType === '전공'
          ? 'MAJOR'
          : course.classType === '교양'
            ? 'GENERAL'
            : 'OTHER',
      schedules: course.schedule.map((schedule) => ({
        day: schedule.day,
        startTime: schedule.start,
        endTime: schedule.end,
      })),
    };

    const response = await fetch(`/api/professors/courses/${course.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    await throwError(response);
  }

  async uploadCourseFile(courseId: Course['id'], file: File): Promise<string> {
    // API: POST /professors/courses/{courseId}/file
    // Request body: FormData { key: 'file', value: file }

    const form = new FormData();
    form.append('file', file);

    const response = await fetch(`/api/professors/courses/${courseId}/file`, {
      method: 'POST',
      body: form,
      credentials: 'include',
    });

    await throwError(response);

    const json = await response.json();
    return json.data.filename;
  }

  async deleteCourse(courseId: Course['id']): Promise<void> {
    // API: DELETE /professors/courses/{courseId}

    const response = await fetch(`/api/professors/courses/${courseId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    await throwError(response);
  }
}

export default CourseRepository;

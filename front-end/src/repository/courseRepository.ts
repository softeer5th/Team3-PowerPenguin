import {
  Course,
  CourseMeta,
  CourseSummary,
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
  request: BackendRequests;
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

    const response = await fetch('/api/professors/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    await throwError(response);
  }

  async getHomeCourses(): Promise<{
    todayCourse: CourseMeta[];
    totalCourse: CourseMeta[];
  }> {
    // API: GET /professors/courses/home

    const response = await fetch('/api/professors/courses/home', {
      method: 'GET',
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
            capacity: parseInt(course.capacity.toString()),
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
            accessCode: Number(course.accessCode),
            fileName: course.fileName,
          }) as CourseMeta
      ) || ([] as CourseMeta[]);

    const totalCourse: CourseMeta[] =
      json.data.all.map((course: BackendCourse) => {
        return {
          id: course.id,
          name: course.name,
          code: course.courseCode,
          capacity: parseInt(course.capacity.toString()),
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
          accessCode: parseInt(course.accessCode.toString()),
          fileName: course.fileName,
        } as CourseMeta;
      }) || ([] as CourseMeta[]);

    return { todayCourse: todayCourse, totalCourse: totalCourse };
  }

  async getOpenedCourse(): Promise<CourseMeta> {
    // API: GET /professor/courses/active

    const response = await fetch('/api/professors/courses/active', {
      method: 'GET',
      redirect: 'follow',
    });

    await throwError(response);

    if (response.redirected) {
      window.location.href = response.url;
    }

    const json = await response.json();
    const data = json.data as BackendCourse;

    const course: CourseMeta = {
      id: data.id.toString(),
      name: data.name,
      code: data.courseCode,
      capacity: parseInt(data.capacity.toString()),
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
      accessCode: parseInt(data.accessCode.toString()),
      fileName: data.fileName,
    };

    return course;
  }

  async searchCourses(keyword: string): Promise<CourseMeta[]> {
    // API: GET /professors/courses?keyword={keyword}

    const response = await fetch(`/api/professors/courses?keyword=${keyword}`, {
      method: 'GET',
    });

    await throwError(response);

    const json = await response.json();
    const data = json.data as BackendCourse[];

    const courses: CourseMeta[] = data.map((course) => ({
      id: course.id.toString(),
      name: course.name,
      code: course.courseCode,
      capacity: parseInt(course.capacity.toString()),
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
      accessCode: parseInt(course.accessCode.toString()),
      fileName: course.fileName,
    }));

    return courses;
  }

  async getCourseById(courseId: Course['id']): Promise<Course> {
    // API: GET /professors/courses/{courseId}

    const response = await fetch(`/api/professors/courses/${courseId}`, {
      method: 'GET',
    });

    await throwError(response);

    const json = await response.json();
    const data = json.data as BackendCourse;

    const course: Course = {
      id: data.id.toString(),
      name: data.name,
      code: data.courseCode,
      capacity: parseInt(data.capacity.toString()),
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
      accessCode: parseInt(data.accessCode.toString()),
      fileName: data.fileName,
      questions: data.questions.map((question) => ({
        id: question.id.toString(),
        createdAt: question.time,
        content: question.content,
      })),
      requests: [
        {
          type: RequestHard,
          count: parseInt(
            data.request
              ?.find((req) => req.type === RequestHard.kind)
              ?.count.toString() || '0'
          ),
        },
        {
          type: RequestFast,
          count: parseInt(
            data.request
              ?.find((req) => req.type === RequestFast.kind)
              ?.count.toString() || '0'
          ),
        },
        {
          type: RequestQuestion,
          count: parseInt(
            data.request
              ?.find((req) => req.type === RequestQuestion.kind)
              ?.count.toString() || '0'
          ),
        },
        {
          type: RequestSize,
          count: parseInt(
            data.request
              ?.find((req) => req.type === RequestSize.kind)
              ?.count.toString() || '0'
          ),
        },
        {
          type: RequestSound,
          count: parseInt(
            data.request
              ?.find((req) => req.type === RequestSound.kind)
              ?.count.toString() || '0'
          ),
        },
      ],
    };

    return course;
  }

  async getCourseFileUrl(courseId: Course['id']): Promise<string> {
    // API: GET /professors/courses/{courseId}/file

    const response = await fetch(`/api/professors/courses/${courseId}/file`, {
      method: 'GET',
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
      }
    );

    await throwError(response);

    const json = await response.json();
    const data = json.data as BackendCourse;

    const courseSummary: CourseSummary = {
      name: data.name,
      code: data.courseCode,
      capacity: parseInt(data.capacity.toString()),
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
    };

    return courseSummary;
  }

  async updateCourse(course: CourseMeta): Promise<void> {
    // API: PUT /professors/courses/{course.id}
    // Request body: Omit<CourseMeta, 'id'>

    const body: Omit<
      BackendCourse,
      'id' | 'accessCode' | 'fileName' | 'questions' | 'request'
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
    });

    await throwError(response);

    const json = await response.json();
    return json.data.filename;
  }

  async deleteCourse(courseId: Course['id']): Promise<void> {
    // API: DELETE /professors/courses/{courseId}

    const response = await fetch(`/api/professors/courses/${courseId}`, {
      method: 'DELETE',
    });

    await throwError(response);
  }
}

export default CourseRepository;

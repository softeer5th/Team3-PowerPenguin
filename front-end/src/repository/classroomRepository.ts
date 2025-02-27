import { utcToKst } from './../utils/util';
import { Question, Reaction } from '@/core/model';
import { throwError } from './throwError';

class ClassroomRepository {
  async startCourse(courseId: string): Promise<void> {
    // API: PATCH /professors/courses/{courseId}/start

    const response = await fetch(`/api/professors/courses/${courseId}/start`, {
      method: 'PATCH',
      credentials: 'include',
    });
    await throwError(response);
  }

  async enterCourse(accessCode: number): Promise<void> {
    const response = await fetch(`/api/students/courses/${accessCode}/in`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.redirected) {
      window.location.href = response.url;
    }

    await throwError(response);
  }

  async closeCourse(courseId: string): Promise<void> {
    // API: PATCH /professors/courses/{courseId}/close

    const response = await fetch(`/api/professors/courses/${courseId}/close`, {
      method: 'PATCH',
      credentials: 'include',
    });

    await throwError(response);
  }

  async checkQuestionByProfessor(questionId: string): Promise<void> {
    // API: POST /professors/questions/check/{questionId}
    const response = await fetch(
      `/api/professors/questions/check/${questionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    await throwError(response);
  }

  async checkQuestionByStudent(questionId: string): Promise<void> {
    // API: POST /students/questions/check/{questionId}
    const response = await fetch(
      `/api/students/questions/check/${questionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    );

    await throwError(response);
  }

  async sendQuestion(question: string): Promise<Question> {
    // API: POST /students/questions/

    const requestBody = { content: question };
    const response = await fetch(`/api/students/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      credentials: 'include',
    });

    await throwError(response);

    const data = await response.json();
    return {
      id: data.data.id,
      createdAt: utcToKst(data.data.createdAt),
      content: data.data.content,
    };
  }

  async sendRequest(request: string): Promise<void> {
    // API: POST /students/requests

    const requestBody = { content: request };
    const response = await fetch(`/api/students/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      credentials: 'include',
    });

    await throwError(response);
  }

  async sendReaction(reaction: Reaction): Promise<void> {
    // API: POST /students/reactions
    const requestBody = { content: reaction };
    const response = await fetch(`/api/students/reactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      credentials: 'include',
    });

    await throwError(response);
  }

  async getQuestions(): Promise<Question[]> {
    // API: GET /students/questions
    const response = await fetch(`/api/students/questions`, {
      method: 'GET',
      credentials: 'include',
    });

    await throwError(response); // 오류 처리

    const data = await response.json();
    const questions: Question[] = data.data.questions.map(
      (question: Question) => ({
        id: question.id,
        createdAt: utcToKst(question.createdAt),
        content: question.content,
      })
    );

    return questions;
  }
}

export default ClassroomRepository;

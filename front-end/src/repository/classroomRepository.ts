import { Question, Reaction } from '@/core/model';
import { throwError } from './throwError';

class ClassroomRepository {
  async startCourse(courseId: string): Promise<void> {
    // API: POST /professors/courses/{courseId}/start

    console.log('start course:', courseId);
  }

  async enterCourse(accessCode: number): Promise<void> {
    const response = await fetch(`/api/students/courses/${accessCode}/in`, {
      method: 'POST',
    });
    await throwError(response);
    if (response.redirected) {
      window.location.href = response.url;
    }
  }

  async closeCourse(courseId: string): Promise<void> {
    // API: POST /professors/courses/{courseId}/close

    console.log('close course:', courseId);
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
      }
    );
    await throwError(response);
    const data = response.json();
    return data;
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
      }
    );
    await throwError(response);
    const data = await response.json();
    return data;
  }

  async sendQuestion(question: string): Promise<Question> {
    // API: POST /students/questions/

    const requestBody = { content: question };
    const response = await fetch('/api/students/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    await throwError(response);
    const data = await response.json();
    return data.data;
  }

  async sendRequest(request: string): Promise<void> {
    // API: POST /students/requests

    const requestBody = { content: request };
    const response = await fetch('/api/students/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    await throwError(response);
  }

  async sendReaction(reaction: Reaction): Promise<void> {
    // API: POST /students/reactions
    const requestBody = { content: reaction };
    const response = await fetch('/api/students/reactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    await throwError(response);
  }

  async getQuestions(): Promise<Question[]> {
    // API: GET /students/questions
    const response = await fetch('/api/students/questions', {
      method: 'GET',
    });
    await throwError(response);
    const data = await response.json();
    return data.data.questions;
  }
}

export default ClassroomRepository;

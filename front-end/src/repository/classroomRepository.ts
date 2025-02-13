import { Question, Reaction } from '../core/model';

class ClassroomRepository {
  async startCourse(courseId: number): Promise<void> {
    // API: POST /professors/courses/{courseId}/start

    console.log('start course:', courseId);
  }

  async closeCourse(courseId: number): Promise<void> {
    // API: POST /professors/courses/{courseId}/close

    console.log('close course:', courseId);
  }

  async checkQuestionByProfessor(questionId: string): Promise<void> {
    // API: POST /professors/questions/{questionId}/check

    console.log('check question:', questionId);
  }

  async checkQuestionByStudent(questionId: string): Promise<void> {
    // API: POST /students/questions/{questionId}/check

    console.log('check question:', questionId);
  }

  async sendQuestion(courseId: string, question: string): Promise<Question> {
    // API: POST /students/questions/{courseId}

    console.log('send question:', courseId, question);

    return { id: 'questionId', time: 'time', content: question };
  }

  async sendRequest(courseId: string, request: string): Promise<void> {
    // API: POST /students/requests/{courseId}

    console.log('send request:', courseId, request);
  }

  async sendReaction(courseId: string, reaction: Reaction): Promise<void> {
    // API: POST /students/reactions/{courseId}

    console.log('send reaction:', courseId, reaction);
  }

  async getQuestions(): Promise<Question[]> {
    // API: GET /students/questions

    console.log('get questions');
    return [
      { id: 'questionId', time: 'time', content: 'asd' },
      { id: 'questionId123', time: 'time', content: 'asd' },
    ];
  }
}

export default ClassroomRepository;

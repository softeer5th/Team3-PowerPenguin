import { Professor } from '@/core/model';

class ProfessorRepository {
  /**
   *
   * @param name {string} 교수 이름
   * @param profile {File} 교수 프로필 이미지
   */
  async createProfessor(name: string, profile: File): Promise<void> {
    // API: POST /professors/signup?name={name}
    // Request Body: FormData { key: 'profileImage', value: profile }

    console.log('create professor:', name, profile);
  }

  /**
   *
   * @returns {Promise<Professor>} 교수 정보
   */
  async getProfessor(): Promise<Professor> {
    // API: GET /professors

    console.log('get professor');
    return {
      name: '홍길동',
      email: 'test@gmail.com',
      profileURL: 'https://avatars.githubusercontent.com/u/11627623?v=4',
    };
  }

  async getProfessorProfile(): Promise<string> {
    // API: GET /professors/img

    console.log('get professor profile');
    return 'https://avatars.githubusercontent.com/u/11627623?v=4';
  }

  async getProfessorPDF(courseId: string): Promise<string> {
    // API:  GET /professors/courses/{courseId}/file

    return 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';
  }

  /**
   *
   * @param name {string} 새 교수 이름
   */
  async updateProfessorName(newName: string): Promise<void> {
    // API: PATCH /professors/name
    // Request Body: { name: newName }

    console.log('update professor name:', newName);
  }

  /**
   *
   * @param newProfile {File} 새 교수 프로필 이미지
   */
  async updateProfessorProfile(newProfile: File): Promise<void> {
    // API: PATCH /professors/img
    // Request Body: FormData { key: 'profileImage', value: newProfile }

    console.log('update professor profile:', newProfile);
  }

  async deleteProfessor(): Promise<void> {
    // API: DELETE /professors

    console.log('delete professor');
  }
}

export default ProfessorRepository;

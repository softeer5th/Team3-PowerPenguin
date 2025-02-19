import { Professor } from '@/core/model';
import { throwError } from './throwError';

class ProfessorRepository {
  /**
   *
   * @param name {string} 교수 이름
   * @param profile {File} 교수 프로필 이미지
   */
  async createProfessor(name: string, profile: File | null): Promise<void> {
    // API: POST /professors/signup
    // Request Body: FormData { key: 'profileImage', value: profile }

    const form = new FormData();
    form.append('name', name);
    if (profile) {
      form.append('profileImage', profile);
    }

    const response = await fetch('/api/professors/signup', {
      method: 'POST',
      body: form,
    });

    await throwError(response);

    if (response.redirected) {
      window.location.href = response.url;
    }
  }

  /**
   *
   * @returns {Promise<Professor>} 교수 정보
   */
  async getProfessor(): Promise<Professor> {
    // API: GET /professors

    const response = await fetch('/api/professors', {
      method: 'GET',
    });

    await throwError(response);

    const json = await response.json();

    const profile: Professor = {
      name: json.data.name.toString(),
      email: json.data.email.toString(),
      profileURL: json.data.imageUrl.toString(),
    };

    return profile;
  }

  async getProfessorProfile(): Promise<string> {
    // API: GET /professors/image

    const response = await fetch('/api/professors/image', {
      method: 'GET',
    });

    await throwError(response);

    const json = await response.json();

    return json.data.imageUrl.toString();
  }

  /**
   *
   * @param email {string} 이메일
   * @param password {string} 비밀번호
   */
  async logout(): Promise<void> {
    // API: POST /professors/logout

    const response = await fetch('/api/professors/logout', {
      method: 'POST',
    });

    await throwError(response);

    if (response.redirected) {
      window.location.href = response.url;
    }
  }

  async getProfessorPDF(courseId: number): Promise<string> {
    // API:  GET /professors/courses/{courseId}/file

    return 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';
  }

  /**
   *
   * @param name {string} 새 교수 이름
   */
  async updateProfessorName(newName: string): Promise<string> {
    // API: PATCH /professors/name
    // Request Body: { name: newName }

    const requestBody = {
      name: newName,
    };

    const response = await fetch('/api/professors/name', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    await throwError(response);

    const json = await response.json();

    return json.data.name.toString();
  }

  /**
   *
   * @param newProfile {File} 새 교수 프로필 이미지
   */
  async updateProfessorProfile(newProfile: File | null): Promise<string> {
    // API: PATCH /professors/image
    // Request Body: FormData { key: 'profileImage', value: newProfile }

    const form = new FormData();
    if (newProfile) form.append('profileImage', newProfile);

    const response = await fetch('/api/professors/image', {
      method: 'PATCH',
      body: form,
    });

    await throwError(response);

    const json = await response.json();

    return json.data.imageUrl.toString();
  }

  async deleteProfessor(): Promise<void> {
    // API: DELETE /professors

    const response = await fetch('/api/professors', {
      method: 'DELETE',
      redirect: 'follow',
    });

    await throwError(response);

    if (response.redirected) {
      window.location.href = response.url;
    }
  }
}

export default ProfessorRepository;

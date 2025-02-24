import { Professor } from '@/core/model';
import { throwError } from './throwError';

class ProfessorRepository {
  private ProfessorCache: Professor | null = null;

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

    const response = await fetch(`/api/professors/signup`, {
      method: 'POST',
      body: form,
      credentials: 'include',
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

    if (this.ProfessorCache) {
      return this.ProfessorCache;
    }

    const response = await fetch(`/api/professors`, {
      method: 'GET',
      credentials: 'include',
    });

    await throwError(response);

    const json = await response.json();

    const profile: Professor = {
      name: json.data.name.toString(),
      email: json.data.email.toString(),
      profileURL: json.data.imageUrl.toString(),
    };

    this.ProfessorCache = profile;

    return profile;
  }

  async getProfessorProfile(): Promise<string> {
    // API: GET /professors/image

    if (this.ProfessorCache) {
      return this.ProfessorCache.profileURL;
    }

    const response = await fetch(`/api/professors/image`, {
      method: 'GET',
      credentials: 'include',
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

    const response = await fetch(`/api/professors/logout`, {
      method: 'POST',
      redirect: 'follow',
      credentials: 'include',
    });

    await throwError(response);

    this.ProfessorCache = null;

    if (response.redirected) {
      window.location.href = response.url;
    }
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

    const response = await fetch(`/api/professors/name`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      credentials: 'include',
    });

    await throwError(response);

    const json = await response.json();

    this.ProfessorCache = {
      name: json.data.name.toString(),
      email: this.ProfessorCache ? this.ProfessorCache.email : '',
      profileURL: this.ProfessorCache ? this.ProfessorCache.profileURL : '',
    };

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

    const response = await fetch(`/api/professors/image`, {
      method: 'PATCH',
      body: form,
      credentials: 'include',
    });

    await throwError(response);

    const json = await response.json();

    this.ProfessorCache = {
      name: this.ProfessorCache ? this.ProfessorCache.name : '',
      email: this.ProfessorCache ? this.ProfessorCache.email : '',
      profileURL: json.data.imageUrl.toString(),
    };

    return json.data.imageUrl.toString();
  }

  async deleteProfessor(): Promise<void> {
    // API: DELETE /professors

    const response = await fetch(`/api/professors`, {
      method: 'DELETE',
      redirect: 'follow',
      credentials: 'include',
    });

    await throwError(response);

    this.ProfessorCache = null;

    if (response.redirected) {
      window.location.href = response.url;
    }
  }
}

export default ProfessorRepository;

import { ClientError, ServerError } from '@/core/errorType';
import { Professor, ResponseError } from '@/core/model';

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

    if (!response.ok) {
      const data = await response.json();

      if (response.status >= 500) {
        throw new ServerError(data as ResponseError);
      } else if (response.status >= 400) {
        throw new ClientError(data as ResponseError);
      }
    }

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

    const json = await response.json();

    if (!response.ok) {
      if (response.status >= 500) {
        throw new ServerError(json as ResponseError);
      } else if (response.status >= 400) {
        throw new ClientError(json as ResponseError);
      } else {
        throw new Error('Unknown Error');
      }
    }

    const profile: Professor = {
      name: json.data.name,
      email: json.data.email,
      profileURL: json.data.imageUrl,
    };

    return profile;
  }

  async getProfessorProfile(): Promise<string> {
    // API: GET /professors/image

    const response = await fetch('/api/professors/image', {
      method: 'GET',
    });

    const json = await response.json();

    if (!response.ok) {
      if (response.status >= 500) {
        throw new ServerError(json as ResponseError);
      } else if (response.status >= 400) {
        throw new ClientError(json as ResponseError);
      } else {
        throw new Error('Unknown Error');
      }
    }

    return json.data.imageFilename;
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

    if (!response.ok) {
      const data = await response.json();

      if (response.status >= 500) {
        throw new ServerError(data as ResponseError);
      } else if (response.status >= 400) {
        throw new ClientError(data as ResponseError);
      }
    }

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

    const response = await fetch('/api/professors/name', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const json = await response.json();

    if (!response.ok) {
      if (response.status >= 500) {
        throw new ServerError(json as ResponseError);
      } else if (response.status >= 400) {
        throw new ClientError(json as ResponseError);
      }
    }

    return json.data.name;
  }

  /**
   *
   * @param newProfile {File} 새 교수 프로필 이미지
   */
  async updateProfessorProfile(newProfile: File | null): Promise<string> {
    // API: PATCH /professors/img
    // Request Body: FormData { key: 'profileImage', value: newProfile }

    const form = new FormData();
    if (newProfile) form.append('profileImage', newProfile);

    const response = await fetch('/api/professors/img', {
      method: 'PATCH',
      body: form,
    });

    const json = await response.json();

    if (!response.ok) {
      if (response.status >= 500) {
        throw new ServerError(json as ResponseError);
      } else if (response.status >= 400) {
        throw new ClientError(json as ResponseError);
      }
    }

    return json.data.imageUrl;
  }

  async deleteProfessor(): Promise<void> {
    // API: DELETE /professors

    const response = await fetch('/api/professors', {
      method: 'DELETE',
      redirect: 'follow',
    });

    if (!response.ok) {
      const data = await response.json();

      if (response.status >= 500) {
        throw new ServerError(data as ResponseError);
      } else if (response.status >= 400) {
        throw new ClientError(data as ResponseError);
      }
    }

    if (response.redirected) {
      window.location.href = response.url;
    }
  }
}

export default ProfessorRepository;

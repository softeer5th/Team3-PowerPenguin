const API_URL = import.meta.env.VITE_API_URL;

type loginProvider = 'google';

class AuthRepository {
  /**
   * @param provider {'google'} 로그인 서비스 제공자
   */
  login(provider: loginProvider): void {
    // API: GET /auth/{provider}/url

    window.location.href = `${API_URL}/auth/${provider}/url`;
  }
}

export default AuthRepository;

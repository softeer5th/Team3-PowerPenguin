type loginProvider = 'google';

class AuthRepository {
  /**
   * @param provider {'google'} 로그인 서비스 제공자
   */
  async login(provider: loginProvider): Promise<void> {
    // API: GET /auth/google/login

    console.log('login:', provider);
  }

  async logout(): Promise<void> {
    // API: POST /auth/logout

    console.log('logout');
  }
}

export default AuthRepository;

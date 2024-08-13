'use client';

import { useAuth } from './context/auth';

function LoginForm() {
  const { login, logout, isAuthenticated, user } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h1 className="py-4">Bonjour!! {user.name}!</h1>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            onClick={logout}
          >
            ログアウト
          </button>
        </div>
      ) : (
        <div>
          <h1>ログインしてください</h1>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            onClick={login}
          >
            ログイン
          </button>
        </div>
      )}
    </div>
  );
}

export default LoginForm;

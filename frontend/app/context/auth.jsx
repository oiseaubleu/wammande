'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

// retrieve these values from Next.js environment variables
const COGNITO_CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // トークンをSessionStorageから取ってくる
  useEffect(() => {
    console.log("Initializing AuthProvider...");
    const accessToken = window.sessionStorage.getItem('accessToken');
    const idToken = window.sessionStorage.getItem('idToken');
    if (accessToken && idToken) {
      console.log("Found tokens in session storage");
      setAccessToken(accessToken);
      setIdToken(idToken);
      setUser(jwtDecode(idToken));
      setIsAuthenticated(true);
    }

    const refreshToken = window.sessionStorage.getItem('refreshToken');
    if (refreshToken) {
      setRefreshToken(refreshToken);
    }

    setLoading(false);
  }, [])

  /**
   * loginメソッド。Cognitoのログインページにリダイレクトするだけ
   */
  const login = () => {
    const redirectUri = `${window.location.origin}/auth/callback`;
    const responseType = 'code';
    const scope = 'openid profile email';
    const state = encodeURIComponent(window.location.href);
    const url = `https://${COGNITO_DOMAIN}/oauth2/authorize?response_type=${responseType}&client_id=${COGNITO_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

    window.location.href = url;
  };

  /**
   * logoutメソッド。Cognitoのログアウトページにリダイレクトする。あと、ローカルに保存しているトークンを削除している
   */
  const logout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('idToken');
    sessionStorage.removeItem('refreshToken');
    setAccessToken(null);
    setIdToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);

    const redirectUri = encodeURIComponent(window.location.origin + '/');
    const logoutUri = `https://${COGNITO_DOMAIN}/logout?client_id=${COGNITO_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code`;
    window.location.href = logoutUri;
  }

  /**
   * CognitoからAuthorization code (=一時引換券) を受け取って、それを使ってもう一度Cognitoにアクセスして、アクセストークンを取得する
   * @returns 成功したかどうか
   */
  const handleAuthCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    //const state = urlParams.get('state');
    const redirectUri = `${window.location.origin}/auth/callback`;

    const response = await fetch(`https://${COGNITO_DOMAIN}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: COGNITO_CLIENT_ID,
        redirect_uri: redirectUri,
        code: code,
      }),
    });

    const data = await response.json();
    if (data.error) {
      console.error(data.error);
      return false;
    }

    window.sessionStorage.setItem('accessToken', data.access_token);
    window.sessionStorage.setItem('idToken', data.id_token);
    window.sessionStorage.setItem('refreshToken', data.refresh_token);

    setAccessToken(data.access_token);
    setIdToken(data.id_token);
    setRefreshToken(data.refresh_token);
    setUser(jwtDecode(data.id_token));
    setIsAuthenticated(true);
    return true;
  };

  const refreshAccessToken = async () => {
    console.log("refreshing token...");
    let tokenToUse = refreshToken || window.sessionStorage.getItem('refreshToken');
    const response = await fetch(`https://${COGNITO_DOMAIN}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: COGNITO_CLIENT_ID,
        refresh_token: tokenToUse,
      }),
    });

    const data = await response.json();
    if (data.error) {
      console.error(data.error);
      return false;
    }

    window.sessionStorage.setItem('accessToken', data.access_token);
    setAccessToken(data.access_token);
    if (data.refresh_token) {
      window.sessionStorage.setItem('refreshToken', data.refresh_token);
      setRefreshToken(data.refresh_token);
    }
    return data.access_token;
  }

  const getAccessToken = async () => {
    // Wait for the initial authentication process to complete
    while (loading) {
      console.log("waiting for auth to complete...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    let token = accessToken || window.sessionStorage.getItem('accessToken');
    const exp = jwtDecode(token).exp;
    if (exp * 1000 > Date.now()) {
      return token;
    }

    return await refreshAccessToken();
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, idToken, refreshToken, user, login, logout, handleAuthCallback, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };

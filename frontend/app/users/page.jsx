'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { useAuth } from '../context/auth';

export default function Page() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, getAccessToken } = useAuth();//0. useAuthフックを使って認証情報を取得
  // ユーザー一覧の取得
  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessToken(); //1. アクセストークンを取得
      const res = await fetch('http://localhost:3000/users', {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${accessToken}`,//2. アクセストークンをヘッダーにセット
        }
      });
      const data = await res.json();
      setUsers(data);
      setIsLoading(false);
    };

    if (isAuthenticated) { //3. 認証情報が取得できたらデータを取得
      fetchData();
    }


  }, [isAuthenticated]);

  return (<>
    <Link href="/users/new?mode=edit">
      <button className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
        新規追加
      </button>
    </Link>
    <table className='w-full table-auto mt-4'>
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-2">name</th>
          <th className="px-4 py-2">email</th>
          <th className="px-4 py-2">admin</th>
          <th className="px-4 py-2">{/* 各種ボタン用 */}</th>
        </tr>
      </thead>
      <tbody>
        {isLoading && (
          <tr>
            <td colSpan="4" className="text-center">
              Loading...
            </td>
          </tr>
        )}
        {users.map((user) => (
          <tr key={user.id} className="border-b text-center">
            <td className="px-4 py-2">{user.name}</td>
            <td className="px-4 py-2">{user.email}</td>
            <td className="px-4 py-2">{user.admin ? "YES" : "NO"}</td>
            <td className="px-4 py-2">
              <Link href={`/users/${user.id}`}>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  詳細
                </button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </>);
}

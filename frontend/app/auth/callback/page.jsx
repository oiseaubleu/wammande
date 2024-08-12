'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth';
import { useRouter } from 'next/navigation';

function Callback() {
  const { handleAuthCallback } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const authCompleted = await handleAuthCallback();

      if (authCompleted) {
        const params = new URLSearchParams(window.location.search);
        const redirectUrl = params.get('state') || '/';
        console.log(`Redirecting to ${redirectUrl}`);
        router.replace(redirectUrl);
      }
    };

    handleAuth();
  }, []);

  return (
    <div>
      { isProcessing ? (
        <h1>ログイン中...</h1>
        ) : (
        <h1>ログイン完了</h1>
        ) }
    </div>
  );
}

export default Callback;

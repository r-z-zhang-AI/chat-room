'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/utils/auth';

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    if (auth.isLoggedIn()) {
      router.push('/chat');
    } else {
      router.push('/login');
    }
  }, [router, isClient]);

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontSize: '18px',
      color: '#666'
    }}>
      加载中...
    </div>
  );
}
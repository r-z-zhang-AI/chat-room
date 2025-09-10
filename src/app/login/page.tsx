'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/utils/auth';
import './login.css';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert('请填写完整信息');
      return;
    }
    
    setLoading(true);
    try {
      const endpoint = `/api/auth/${isLogin ? 'login' : 'register'}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      
      const data = await response.json();
      
      if (data.code === 0) {
        auth.setAuth(data.data.token, data.data.user);
        router.push('/chat');
      } else {
        alert(data.message || '操作失败');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>💬 聊天室</h1>
          <p>{isLogin ? '欢迎回来' : '加入我们'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
          </button>
        </form>
        
        <div className="switch-mode">
          <span>{isLogin ? '还没有账号？' : '已有账号？'}</span>
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            className="switch-btn"
            disabled={loading}
          >
            {isLogin ? '去注册' : '去登录'}
          </button>
        </div>
      </div>
    </div>
  );
}

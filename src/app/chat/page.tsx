'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, apiRequest } from '@/utils/auth';
import { Room, Message, Member } from '@/types/common';
import './chat.css';

export default function ChatPage() {
  const [user, setUser] = useState<any>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const [showNewRoom, setShowNewRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    // 只在客户端设置用户状态
    setUser(auth.getUser());
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    if (!auth.isLoggedIn()) {
      router.push('/login');
      return;
    }
    loadRooms();
  }, [router, isClient]);

  useEffect(() => {
    if (currentRoom) {
      loadMessages();
      loadMembers();
    }
  }, [currentRoom]);

    const loadRooms = async () => {
    try {
      const data = await apiRequest('/api/room/list');
      if (data.code === 0 && data.data && data.data.rooms) {
        // 转换API数据格式为前端期望的格式
        const convertedRooms = data.data.rooms.map((roomInfo: any) => ({
          id: roomInfo.roomId,
          name: roomInfo.roomName,
          lastMessage: roomInfo.lastMessage?.content || '',
          lastTime: roomInfo.lastMessage ? 
            new Date(roomInfo.lastMessage.time).toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit'
            }) : '',
          memberCount: 0 // 暂时设为0，后续通过成员API获取
        }));
        setRooms(convertedRooms);
      }
    } catch (error) {
      console.error('加载房间失败:', error);
      setRooms([]); // 确保设置为空数组而不是undefined
    }
  };

  const loadMessages = async () => {
    if (!currentRoom) return;
    try {
      const data = await apiRequest(`/api/room/message/list?roomId=${currentRoom.id}`);
      if (data.code === 0 && data.data && data.data.messages) {
        // 转换API消息格式为前端期望的格式
        const convertedMessages = data.data.messages.map((msg: any) => ({
          id: msg.messageId,
          content: msg.content,
          sender: msg.sender,
          time: new Date(msg.time).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          roomId: msg.roomId
        }));
        setMessages(convertedMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('加载消息失败:', error);
      setMessages([]);
    }
  };

  const loadMembers = async () => {
    if (!currentRoom) return;
    try {
      const data = await apiRequest(`/api/room/members?roomId=${currentRoom.id}`);
      if (data.code === 0 && data.data && data.data.members && Array.isArray(data.data.members)) {
        // 转换API成员格式为前端格式
        const convertedMembers: Member[] = data.data.members.map((apiMember: any) => ({
          id: apiMember.id || 0,
          username: apiMember.name || apiMember.username || 'Unknown',
          avatar: apiMember.avatar,
          online: apiMember.status === 'online'
        }));
        setMembers(convertedMembers);
      } else {
        setMembers([]);
      }
    } catch (error) {
      console.error('加载成员失败:', error);
      setMembers([]);
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    
    try {
      const data = await apiRequest('/api/room/add', {
        method: 'POST',
        body: JSON.stringify({ roomName: newRoomName.trim() }),
      });
      
      if (data.code === 0) {
        setNewRoomName('');
        setShowNewRoom(false);
        loadRooms();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('创建房间失败');
    }
  };

  const handleSendMessage = async () => {
    if (!currentRoom || !newMessage.trim()) return;
    
    try {
      const data = await apiRequest('/api/message/add', {
        method: 'POST',
        body: JSON.stringify({
          roomId: currentRoom.id,
          content: newMessage.trim(),
        }),
      });
      
      if (data.code === 0) {
        setNewMessage('');
        loadMessages();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('发送消息失败');
    }
  };

  const handleLogout = () => {
    auth.clearAuth();
    router.push('/login');
  };

  // 防止SSR hydration错误
  if (!isClient) {
    return <div className="loading">加载中...</div>;
  }

  if (!user) {
    return <div className="loading">加载中...</div>;
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h1>聊天室</h1>
        <div className="user-info">
          <span>欢迎，{user.username}</span>
          <button onClick={handleLogout} className="logout-btn">退出</button>
        </div>
      </div>
      
      <div className="chat-content">
        <div className="sidebar">
          <div className="sidebar-header">
            <h3>房间列表</h3>
            <button onClick={() => setShowNewRoom(true)} className="new-room-btn">+</button>
          </div>
          
          <div className="room-list">
            {Array.isArray(rooms) && rooms.map(room => (
              <div
                key={`room-${room.id}`}
                className={`room-item ${currentRoom?.id === room.id ? 'active' : ''}`}
                onClick={() => setCurrentRoom(room)}
              >
                <div className="room-info">
                  <h4>{room.name}</h4>
                  <p>{room.lastMessage || '暂无消息'}</p>
                </div>
                <div className="room-meta">
                  <span className="member-count">{room.memberCount}人</span>
                  {room.lastTime && <span className="time">{room.lastTime}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="main-area">
          {currentRoom ? (
            <>
              <div className="chat-room-header">
                <h3>{currentRoom.name}</h3>
                <button onClick={() => setShowMembers(true)} className="members-btn">
                  成员 ({members.length})
                </button>
              </div>

              <div className="messages-area">
                {Array.isArray(messages) && messages.map(msg => (
                  <div key={`msg-${msg.id}`} className={`message ${msg.sender === user.username ? 'own' : ''}`}>
                    <div className="message-info">
                      <span className="sender">{msg.sender}</span>
                      <span className="time">{msg.time}</span>
                    </div>
                    <div className="message-content">{msg.content}</div>
                  </div>
                ))}
              </div>

              <div className="input-area">
                <input
                  type="text"
                  placeholder="输入消息..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage}>发送</button>
              </div>
            </>
          ) : (
            <div className="no-room">选择一个房间开始聊天</div>
          )}
        </div>
      </div>

      {showNewRoom && (
        <div className="modal-overlay" onClick={() => setShowNewRoom(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>新建房间</h3>
            <input
              type="text"
              placeholder="房间名称"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
            />
            <div className="modal-actions">
              <button onClick={() => setShowNewRoom(false)}>取消</button>
              <button onClick={handleCreateRoom}>创建</button>
            </div>
          </div>
        </div>
      )}

      {showMembers && (
        <div className="modal-overlay" onClick={() => setShowMembers(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>房间成员</h3>
            <div className="members-list">
              {Array.isArray(members) && members.map(member => (
                <div key={`member-${member.id}`} className="member-item">
                  <span className="member-name">{member.username}</span>
                  <span className={`status ${member.online ? 'online' : 'offline'}`}>
                    {member.online ? '在线' : '离线'}
                  </span>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowMembers(false)}>关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

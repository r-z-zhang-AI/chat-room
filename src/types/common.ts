export interface User {
  id: number;
  username: string;
  avatar?: string;
}

export interface Room {
  id: number;
  name: string;
  lastMessage?: string;
  lastTime?: string;
  memberCount: number;
}

export interface Message {
  id: number;
  content: string;
  sender: string;
  time: string;
  roomId: number;
}

export interface Member {
  id: number;
  username: string;
  avatar?: string;
  online: boolean;
}

export interface AuthResponse {
  code: number;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

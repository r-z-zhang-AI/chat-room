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

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

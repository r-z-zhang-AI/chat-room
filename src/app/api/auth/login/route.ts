import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';
import { signToken } from '@/lib/auth';
import { LoginSchema } from '@/lib/validations';
import { ApiResponse, AuthResponse } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证输入数据
    const validatedData = LoginSchema.parse(body);
    const { username, password } = validatedData;

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return NextResponse.json<ApiResponse>({
        message: '用户名或密码错误',
        code: 1,
        data: null
      }, { status: 401 });
    }

    // 验证密码
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json<ApiResponse>({
        message: '用户名或密码错误',
        code: 1,
        data: null
      }, { status: 401 });
    }

    // 生成 JWT token
    const token = signToken({
      userId: user.id,
      username: user.username
    });

    const response: AuthResponse = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email || undefined,
      },
      token
    };

    return NextResponse.json<ApiResponse<AuthResponse>>({
      message: '登录成功',
      code: 0,
      data: response
    });

  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json<ApiResponse>({
        message: error.message,
        code: 1,
        data: null
      }, { status: 400 });
    }

    return NextResponse.json<ApiResponse>({
      message: '登录失败',
      code: 1,
      data: null
    }, { status: 500 });
  }
}

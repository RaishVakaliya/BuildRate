import { action } from './_generated/server';
import { v } from 'convex/values';

export const loginAdmin = action({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, { username, password }) => {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      throw new Error('Admin credentials not configured in environment variables.');
    }

    if (username !== adminUsername || password !== adminPassword) {
      throw new Error('Invalid username or password.');
    }

    const token = `admin_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    return {
      success: true,
      token,
      user: {
        username: adminUsername,
        email: 'adminrateguru@gmail.com',
        role: 'admin' as const,
        memberSince: '2025-01-01',
      },
    };
  },
});

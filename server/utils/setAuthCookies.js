import env from '../config/env.js';

export default async (res, { accessToken, refreshToken }) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 36_00_000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 60_48_00_000,
  });
};

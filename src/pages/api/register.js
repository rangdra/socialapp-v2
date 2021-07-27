import axios from 'config/axios';
import cookie from 'cookie';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { fullname, username, email, password, gender } = req.body;

    try {
      const result = await axios.post('/auth/register', {
        fullname,
        username,
        email,
        password,
        gender,
      });
      res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        })
      );
      res.status(200).json(result.user);
    } catch (error) {
      res.status(400).json({ message: error.response.data.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
};

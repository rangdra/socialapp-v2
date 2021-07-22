import { useRouter } from 'next/router';
import { useContext, createContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'config/axios';
import useSWR from 'swr';

export const AuthContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        authenticated: true,
        user: action.payload,
      };
    case 'REGISTER':
      return {
        ...state,
        authenticated: true,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    case 'STOP_LOADING':
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error('Unknow action type: ' + action.type);
  }
};

export const AuthProvider = ({ children }) => {
  // const { data: userLogin } = useSWR('/users/me');
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
  });

  useEffect(() => {
    checkUserLogin();
  }, []);

  // login
  const signin = async (user) => {
    try {
      const res = await axios.post('/auth/login', user);
      dispatch({ type: 'LOGIN', payload: res.user });
      router.push('/');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  // register
  const register = async (user) => {
    try {
      const res = await axios.post('/auth/register', user);
      dispatch({ type: 'REGISTER', payload: res.user });
      router.push('/');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  // logout
  const logout = async () => {
    try {
      await axios.post('/auth/logout');
      dispatch({ type: 'LOGOUT' });
      // window.location.reload();
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  // check user login
  const checkUserLogin = async () => {
    try {
      const res = await axios.get('/users/me');
      dispatch({ type: 'LOGIN', payload: res.user });
    } catch (error) {
      console.log(error);
    } finally {
      dispatch({ type: 'STOP_LOADING' });
    }
  };
  return (
    <AuthContext.Provider value={{ state, signin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);

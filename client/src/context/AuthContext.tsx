import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../utils/socket';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string, userType: 'seeker' | 'provider') => Promise<void>;
  logout: () => void;
  setAuthData: (token: string, user: { email: string; userType: string; id: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const navigate = useNavigate();

  const setAuthData = (token: string, user: { email: string; userType: string; id: string }) => {
    setIsAuthenticated(true);
    setUser(user);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userType', user.userType);
    localStorage.setItem('userId', user.id);
  };

  const [loading, setLoading] = useState(true);

  // Restore user from localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUserEmail = localStorage.getItem('userEmail');
    const storedUserType = localStorage.getItem('userType');
    const storedUserId = localStorage.getItem('userId');

    if (token && storedUserEmail && storedUserType && storedUserId) {
      const userData = {
        email: storedUserEmail,
        userType: storedUserType,
        id: storedUserId,
      };
      setIsAuthenticated(true);
      setUser(userData);
    }
    setLoading(false);
  }, []);

  // Socket connection logic moved here
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      socket.connect();
      socket.emit('join', user.id);
    }

    return () => {
      if (socket.connected) {
        socket.emit('leave', user?.id); // Optional: notify backend
        socket.disconnect();
      }
    };
  }, [isAuthenticated, user]);

  // Login logic
  const login = async (email: string, password: string, userType: 'seeker' | 'provider') => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SOCKET_SERVER}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, userType }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userType', data.user.userType);
        localStorage.setItem('userId', data.user.id);
        setUser(data.user);

        // Connect socket and join room
        socket.connect();
        socket.emit('join', data.user.id);

        const redirectPath = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
        navigate(redirectPath);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    socket.disconnect(); // optional but clean
    navigate('/');
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { useNavigate } from 'react-router-dom';
// import socket from '../utils/socket';

// interface AuthContextType {
//   isAuthenticated: boolean;
//   user: any | null;
//   login: (email: string, password: string, userType: 'seeker' | 'provider') => Promise<void>;
//   logout: () => void;
//   setAuthData: (token: string, user: { email: string; userType: string; id: string }) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState<any | null>(null);
//   const navigate = useNavigate();

//   const setAuthData = (token: string, user: { email: string; userType: string; id: string }) => {
//     setIsAuthenticated(true);
//     setUser(user);
//     localStorage.setItem('authToken', token);
//     localStorage.setItem('userEmail', user.email);
//     localStorage.setItem('userType', user.userType);
//     localStorage.setItem('userId', user.id);
//   };

//   const [loading, setLoading] = useState(true);

//   // Restore user from localStorage on initial load
//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     const storedUserEmail = localStorage.getItem('userEmail');
//     const storedUserType = localStorage.getItem('userType');
//     const storedUserId = localStorage.getItem('userId');

//     if (token && storedUserEmail && storedUserType && storedUserId) {
//       const userData = {
//         email: storedUserEmail,
//         userType: storedUserType,
//         id: storedUserId,
//       };
//       setIsAuthenticated(true);
//       setUser(userData);

//       // Connect and join socket room
//       socket.connect();
//       socket.emit('join', storedUserId);
//     }
//     setLoading(false);
//     // Clean up socket on unmount
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   // Login logic
//   const login = async (
//     email: string,
//     password: string,
//     userType: 'seeker' | 'provider'
//   ) => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_SOCKET_SERVER}/api/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password, userType }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setIsAuthenticated(true);
//         localStorage.setItem('authToken', data.token);
//         localStorage.setItem('userEmail', data.user.email);
//         localStorage.setItem('userType', data.user.userType);
//         localStorage.setItem('userId', data.user.id);
//         setUser(data.user);

//         // Connect socket and join room
//         socket.connect();
//         socket.emit('join', data.user.id);

//         const redirectPath =
//           new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
//         navigate(redirectPath);
//       } else {
//         throw new Error(data.message || 'Login failed');
//       }
//     } catch (error: any) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   const logout = () => {
//     setIsAuthenticated(false);
//     setUser(null);
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userEmail');
//     localStorage.removeItem('userType');
//     localStorage.removeItem('userId');
//     socket.disconnect(); // optional but clean
//     navigate('/');
//   };

//   useEffect(() => {
//   }, [isAuthenticated, user]);

//   if(loading) return null;
//   return (
//     <AuthContext.Provider
//       value={{ isAuthenticated, user, login, logout, setAuthData }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }


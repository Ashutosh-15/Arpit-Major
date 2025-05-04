// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Menu, Moon, Sun, User, LogOut } from 'lucide-react';
// import { Button } from '../ui/Button';
// import { useAuth } from '../../context/AuthContext';
// import NotificationBell from './NotificationBell';
// export function Header() {
//   const navigate = useNavigate();
//   const { isAuthenticated, logout, user } = useAuth();
//   const [isDark, setIsDark] = React.useState(false);
//   const [isMenuOpen, setIsMenuOpen] = React.useState(false);

//   const toggleTheme = () => {
//     setIsDark(!isDark);
//     document.documentElement.classList.toggle('dark');
//   };

//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-900">
//       <div className="container mx-auto px-4">
//         <div className="flex h-16 items-center justify-between">
//           <div className="flex items-center">
//             <Link to="/" className="text-2xl font-bold text-blue-600">
//               ServiceHub
//             </Link>
//           </div>

//           <nav className="hidden md:flex items-center space-x-8">
//             <Link to="/services" className="text-gray-700 hover:text-blue-600 dark:text-gray-300">
//               Find Services
//             </Link>
//             <Link to="/become-provider" className="text-gray-700 hover:text-blue-600 dark:text-gray-300">
//               Become a Provider
//             </Link>
//             <button
//               onClick={toggleTheme}
//               className="p-2 text-gray-700 hover:text-blue-600 dark:text-gray-300"
//             >
//               {isDark ? <Sun size={20} /> : <Moon size={20} />}
//             </button>
//             {isAuthenticated ? (
//               <div className="flex items-center space-x-4">
//                 <NotificationBell user={user} />
//                 <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 dark:text-gray-300">
//                   Dashboard
//                 </Link>
//                 <Button
//                   variant="outline"
//                   onClick={logout}
//                   className="flex items-center"
//                 >
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Sign Out
//                 </Button>
//               </div>
//             ) : (
//               <Button
//                 variant="primary"
//                 onClick={() => navigate('/login')}
//               >
//                 <User className="mr-2 h-4 w-4" />
//                 Sign In
//               </Button>
//             )}
//           </nav>

//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="md:hidden p-2 text-gray-700 hover:text-blue-600 dark:text-gray-300"
//           >
//             <Menu size={24} />
//           </button>
//         </div>
//       </div>

//       {isMenuOpen && (
//         <div className="md:hidden border-t p-4">
//           <nav className="flex flex-col space-y-4">
//             <Link to="/services" className="text-gray-700 hover:text-blue-600 dark:text-gray-300">
//               Find Services
//             </Link>
//             <Link to="/become-provider" className="text-gray-700 hover:text-blue-600 dark:text-gray-300">
//               Become a Provider
//             </Link>
//             {isAuthenticated ? (
//               <>
//                 <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 dark:text-gray-300">
//                   Dashboard
//                 </Link>
//                 <Button
//                   variant="outline"
//                   className="w-full flex items-center justify-center"
//                   onClick={logout}
//                 >
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Sign Out
//                 </Button>
//               </>
//             ) : (
//               <Button
//                 variant="primary"
//                 className="w-full"
//                 onClick={() => navigate('/login')}
//               >
//                 <User className="mr-2 h-4 w-4" />
//                 Sign In
//               </Button>
//             )}
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// }

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Moon, Sun, User, LogOut } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "./NotificationBell";

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [isDark, setIsDark] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              ServiceHub
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {user?.userType === "seeker" && (
              <Link
                to="/services"
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300"
              >
                Find Services
              </Link>
            )}

            {user?.userType === "provider" && (
              <Link
                to="/become-provider"
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300"
              >
                Become a Provider
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 hover:text-blue-600 dark:text-gray-300"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <NotificationBell user={user} />
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300"
                >
                  Dashboard
                </Link>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="primary" onClick={() => navigate("/login")}>
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 dark:text-gray-300"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col space-y-4">
            {user.userType === "seeker" && (
              <Link
                to="/services"
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300"
              >
                Find Services
              </Link>
            )}

            {user.userType === "provider" && (
              <Link
                to="/become-provider"
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300"
              >
                Become a Provider
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300"
                >
                  Dashboard
                </Link>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate("/login")}
              >
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

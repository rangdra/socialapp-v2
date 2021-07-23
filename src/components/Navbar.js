import { FaEnvelope } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

import { useAuthContext } from 'context/AuthContext';
import CreatePost from './CreatePost';
import Modal from './Modal';
import SearchBox from './SearchBox';
import { API_URL } from 'config/url';

const Navbar = () => {
  const {
    state: { authenticated, user, loading },
    logout,
  } = useAuthContext();
  const selectWrapper = useRef(null);
  const [isDropdown, setIsDropdown] = useState(false);

  const clickOutside = (e) => {
    if (selectWrapper && !selectWrapper?.current?.contains(e.target)) {
      setIsDropdown(false);
    }
  };

  useEffect(() => {
    window.addEventListener('mousedown', clickOutside);
    return () => {
      window.removeEventListener('mousedown', clickOutside);
    };
  }, []);
  return (
    <>
      <header className="flex items-center justify-between px-12 py-4 bg-indigo-500">
        <Link href="/">
          <a className="flex items-center space-x-2 text-2xl text-white logo">
            <FaEnvelope />
            <span className="font-bold tracking-wider">RPApp</span>
          </a>
        </Link>
        <div className="flex items-center space-x-4">
          {!loading && authenticated ? (
            <>
              <div
                className="relative flex items-center space-x-2 cursor-pointer"
                onClick={() => setIsDropdown(!isDropdown)}
                ref={selectWrapper}
              >
                <div className="flex items-center justify-center p-0.5 border border-white rounded-full">
                  <Image
                    src={`${
                      user?.photo
                        ? `${API_URL}/${user.photo}`
                        : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                    }`}
                    alt={user?.fullname}
                    width={36}
                    height={36}
                    className="rounded-full "
                  />
                </div>
                <span className="font-medium text-white ">
                  {user?.fullname}
                </span>
                <IoMdArrowDropdown
                  className={`${
                    isDropdown && '-rotate-180'
                  } w-8 h-8 text-white transform transition-all duration-200 `}
                />
                <CSSTransition
                  in={isDropdown}
                  timeout={200}
                  classNames="my-dropdown"
                  unmountOnExit
                >
                  <div className="absolute right-0 z-10 w-[120px] bg-white divide-y divide-indigo-900 rounded shadow-lg top-11">
                    <Link href="/users/me">
                      <a className="block p-2 transition-all duration-200 hover:text-gray-400 hover:rounded-tl hover:rounded-tr">
                        My Profile
                      </a>
                    </Link>
                    <div
                      onClick={() => logout()}
                      className="p-2 transition-all duration-200 hover:text-gray-400"
                    >
                      Logout
                    </div>
                  </div>
                </CSSTransition>
              </div>
              <Modal
                content={(toggle, setDisplay) => (
                  <CreatePost setDisplay={setDisplay} />
                )}
              >
                {(toggle) => (
                  <button
                    onClick={() => {
                      toggle();
                    }}
                    className="px-6 py-2 font-bold transition-all duration-200 bg-white rounded-full hover:text-white hover:bg-indigo-600"
                  >
                    Create post +
                  </button>
                )}
              </Modal>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth/signin">
                <a className="px-6 py-2 font-medium text-gray-800 transition-all duration-200 bg-white rounded-full hover:bg-indigo-400 hover:text-white">
                  Sign In
                </a>
              </Link>
              <Link href="/auth/register">
                <a className="px-6 py-2 font-medium text-white transition-all duration-200 bg-indigo-400 rounded-full hover:text-gray-800 hover:bg-white">
                  Register
                </a>
              </Link>
            </div>
          )}
        </div>
      </header>
      <div className="flex justify-end px-16 py-4 bg-indigo-300">
        <SearchBox />
      </div>
    </>
  );
};

export default Navbar;

import { FaEnvelope } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';
import { HiMenuAlt3 } from 'react-icons/hi';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

import { useAuthContext } from 'context/AuthContext';
import CreatePost from './CreatePost';
import Modal from './Modal';
import SearchBox from './SearchBox';

const Navbar = () => {
  const {
    state: { authenticated, user, loading },
    logout,
  } = useAuthContext();
  const selectWrapper = useRef(null);
  const selectWrapper2 = useRef(null);
  const [isDropdown, setIsDropdown] = useState(false);
  const [isBtnAuth, setIsBtnAuth] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const clickOutside = (e) => {
    if (selectWrapper && !selectWrapper?.current?.contains(e.target)) {
      setIsDropdown(false);
    }
    if (selectWrapper2 && !selectWrapper2?.current?.contains(e.target)) {
      setIsBtnAuth(false);
    }
  };

  useEffect(() => {
    window.addEventListener('mousedown', clickOutside);
    return () => {
      window.removeEventListener('mousedown', clickOutside);
    };
  }, []);

  const showComp = () => {
    if (window.innerWidth >= 640) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  };

  useEffect(() => {
    showComp();
  }, []);

  if (process.browser) {
    window.addEventListener('resize', showComp);
  }

  return (
    <>
      <header className="flex items-center justify-between px-4 py-4 bg-indigo-500 sm:px-12">
        <Link href="/">
          <a className="flex items-center space-x-2 text-white logo">
            <FaEnvelope className="text-xl sm:text-4xl" />
            <span className="text-xl font-bold sm:tracking-wider sm:text-4xl">
              RPApp
            </span>
          </a>
        </Link>
        <div className="flex items-center sm:space-x-4">
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
                        ? user.photo
                        : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                    }`}
                    alt={user?.fullname}
                    width={isMobile ? 24 : 36}
                    height={isMobile ? 24 : 36}
                    className="object-cover rounded-full"
                  />
                </div>
                <span className="text-sm font-medium text-white sm:text-base">
                  {isMobile
                    ? `${user?.fullname.slice(0, 5)}...`
                    : user?.fullname}
                </span>
                <IoMdArrowDropdown
                  className={`${
                    isDropdown && '-rotate-180'
                  } sm:text-base text-2xl text-white transform transition-all duration-200 `}
                />
                <CSSTransition
                  in={isDropdown}
                  timeout={200}
                  classNames="my-dropdown"
                  unmountOnExit
                >
                  <div className="absolute right-2 sm:right-0 z-10 w-[120px] bg-white divide-y divide-indigo-900 rounded shadow-lg top-9 sm:top-11">
                    <Link href="/users/me">
                      <a className="block p-2 text-sm transition-all duration-200 sm:text-base hover:text-gray-400 hover:rounded-tl hover:rounded-tr">
                        My Profile
                      </a>
                    </Link>
                    <div
                      onClick={() => logout()}
                      className="p-2 text-sm transition-all duration-200 sm:text-base hover:text-gray-400"
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
                    className="hidden px-6 py-2 font-semibold transition-all duration-200 bg-white rounded-full sm:block hover:text-white hover:bg-indigo-600"
                  >
                    Create post +
                  </button>
                )}
              </Modal>
            </>
          ) : (
            <>
              <div className="items-center hidden space-x-2 sm:flex">
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

              <HiMenuAlt3
                className="text-2xl text-white sm:hidden"
                onClick={() => setIsBtnAuth(!isBtnAuth)}
              />
              <CSSTransition
                in={isBtnAuth}
                timeout={200}
                classNames="my-dropdown"
                unmountOnExit
              >
                <div
                  className="absolute right-2 z-10 w-[120px] bg-white divide-y divide-indigo-900 rounded shadow-lg top-11"
                  ref={selectWrapper2}
                >
                  <Link href="/auth/signin">
                    <a className="block p-2 text-sm transition-all duration-200 sm:text-base hover:text-gray-400 hover:rounded-tl hover:rounded-tr">
                      Sign In
                    </a>
                  </Link>
                  <Link href="/auth/register">
                    <a className="block p-2 text-sm transition-all duration-200 sm:text-base hover:text-gray-400 hover:rounded-tl hover:rounded-tr">
                      Register
                    </a>
                  </Link>
                </div>
              </CSSTransition>
            </>
          )}
        </div>
      </header>
      <div className="flex flex-col p-4 space-y-2 overflow-hidden bg-indigo-300 sm:items-end sm:px-16">
        <SearchBox />
        <div className="w-1/2">
          {isMobile && (
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
                  className="px-4 py-1 text-sm font-semibold transition-all duration-200 bg-white rounded-full sm:text-base sm:px-6 sm:py-2 hover:text-white hover:bg-indigo-600"
                >
                  Create post +
                </button>
              )}
            </Modal>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;

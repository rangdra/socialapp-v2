import axios from 'config/axios';
import { useState, useRef, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthContext } from 'context/AuthContext';
import { API_URL } from 'config/url';

const SearchBox = () => {
  const {
    state: { user: userLogin },
  } = useAuthContext();
  const [keyword, setKeyword] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);

  const [searchResponse, setSearchResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectWrapper = useRef(null);

  const clickOutside = (e) => {
    if (selectWrapper && !selectWrapper.current.contains(e.target)) {
      setKeyword('');
    }
  };

  useEffect(() => {
    window.addEventListener('mousedown', clickOutside);
    return () => {
      window.removeEventListener('mousedown', clickOutside);
    };
  }, []);

  let timeoutSearch = useRef(null);
  const handleSearch = (e) => {
    e.persist();
    setKeyword(e.target.value);
    clearTimeout(timeoutSearch.current);
    setSearchResponse(null);
    setLoading(true);

    timeoutSearch.current = setTimeout(() => {
      axios
        .get(`/users?keyword=${e.target.value}`)
        .then((res) => {
          setSearchResponse(res);
          setLoading(false);
        })
        .catch((err) => {
          setSearchResponse(null);
          setLoading(false);
          console.log(err);
        });
    }, 1000);
  };
  return (
    <div
      ref={selectWrapper}
      className="flex relative items-center w-full sm:w-[400px] py-2 px-4 space-x-2 bg-white rounded-full"
    >
      <FaSearch className="w-3 h-3 text-gray-400 sm:w-5 sm:h-5" />
      <input
        type="text"
        value={keyword}
        onChange={handleSearch}
        className="text-sm text-gray-400 bg-transparent sm:text-base focus:outline-none"
        style={{ flex: 1 }}
        onFocus={() => setSearchFocus(!searchFocus)}
        onBlur={() => setSearchFocus(!searchFocus)}
        placeholder={
          searchFocus
            ? 'Ketik minimal 3 karakter untuk mencari'
            : 'Search user ...'
        }
      />
      {keyword.length >= 3 ? (
        <div className="absolute right-0 z-50 w-full space-y-2 text-gray-800 divide-y-2 rounded shadow-lg sm:p-2 bg-gray-50 top-10">
          {loading && <p className="p-2 text-sm">Loading...</p>}
          {searchResponse &&
            searchResponse.map((user) => (
              <Link
                key={user._id}
                href={`${
                  userLogin._id === user._id
                    ? '/users/me'
                    : `/users/${user.username}`
                }`}
              >
                <a className="flex items-center p-2 space-x-2" key={user._id}>
                  <Image
                    src={user.photo}
                    alt={user.photo}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-sm leading-none">{user.fullname}</p>
                    <p className="text-xs text-gray-400">@{user.username}</p>
                  </div>
                </a>
              </Link>
            ))}
          {keyword.length >= 3 && searchResponse?.length === 0 && (
            <p className="p-2 text-sm">User not found</p>
          )}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default SearchBox;

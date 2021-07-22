import { useRouter } from 'next/router';

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-1">
        Page Not Found{' '}
        <span
          onClick={() => router.back()}
          className="text-blue-500 underline cursor-pointer"
        >
          Go Back
        </span>
      </p>
    </div>
  );
};

export default NotFound;

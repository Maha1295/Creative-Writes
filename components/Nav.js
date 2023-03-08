import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Nav = () => {
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="flex justify-between items-center p-2 mt-2 rounded-lg bg-gray-400">
      <Link href="/">
        <button className="text-lg font-medium">Good Thoughts</button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link href="/auth/login">
            <button className="sm:px-1 py-2 px-4 text-sm bg-white text-black rounded-lg font-medium ml-8 ">
              Join Now
            </button>
          </Link>
        )}
        {user && (
          <>
            <Link href={"/posts"}>
              <button className="sm:px-1 py-2 px-4 text-sm bg-gray-500 text-white rounded-lg font-medium ml-8 ">
                 Post Thoughts
              </button>
            </Link>
            <button
              className="sm:px-1 py-2 px-4 text-sm bg-gray-500 text-white rounded-lg font-medium"
              onClick={() => auth.signOut()}
            >
              Sign Out
            </button>
            <Link href={"/dashboard"}>
              <img
                className="w-12 rounded-full cursor-pointer"
                src={user.photoURL}
                alt="avatar"
              />
            </Link>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Nav;

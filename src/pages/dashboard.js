import { auth } from "../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import Message from "../../components/Message";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
const Dashboard = () => {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [currentUserPosts, setcurrentUserPosts] = useState([]);

  // See if user logged in
  const getData = async () => {
    if (loading) return <>Loading... pls wait....</>;
    if (!user) route.push("/auth/login");
    if (user) {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("user", "==", user.uid));

      // onSnapshot() gives the actual realtime data
      const postsSnapshot = onSnapshot(q, (snapshot) => {
        setcurrentUserPosts(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      });
    }

    // getDocs() doesn't give the actual real-time data,
    // if you use getDocs() once you delete you need to refresh the page again to get the actual data
    // const postsSnapshot = await getDocs(q, postsRef);
    // const postsData = postsSnapshot.docs.map((doc) => ({
    //   id: doc.id,
    //   data: doc.data(),
    // }));
    // setcurrentUserPosts(postsData);
  };

  // delete a post
  const deletePostHandler = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div>
      <h1 className="font-bold">Your Thoughts</h1>
      {currentUserPosts.length === 0 ? (
        <div className="bg-gray-600 text-white p-8 border-b-2 rounded-lg mx-2 my-2">
          No Posts to display....
        </div>
      ) : (
        currentUserPosts.map((post) => (
          <Message key={post.id} {...post}>
            <div className="flex gap-4 text-white">
              <button
                onClick={() => deletePostHandler(post.id)}
                className="flex items-center justify-center gap-2 py-2 text-sm"
              >
                <BsTrash2Fill className="text-2xl" />
                Delete
              </button>
              <Link href={{ pathname: "/posts", query: post }}>
                <button className="flex items-center justify-center gap-2 py-2 text-sm">
                  <AiFillEdit className="text-2xl" />
                  Edit
                </button>
              </Link>
            </div>
          </Message>
        ))
      )}
    </div>
  );
};

export default Dashboard;

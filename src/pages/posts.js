import { auth, db } from "../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

const Posts = () => {
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  console.log(route.query);
  const routeData = route.query;

  // form state
  const [post, setPost] = useState({ description: "" });

  // submit post
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Do some checks

    if (!post.description) {
      toast.error("Description field empty... 😄", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });

      return;
    }

    if (post.description.length > 300) {
      toast.error("Description is too loooong... 😄", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });

      return;
    }

    // if the post already there then just update else create a new one...
    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      return route.push("/");
    } else {
      const collectionRef = collection(db, "posts");

      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        userName: user.displayName,
      });

      setPost({ description: "" });
      toast.success("Posted Sucessfully 🚀🚀🚀🚀🚀🚀", {position : toast.POSITION.TOP_CENTER, autoClose: 1500})
      return route.push("/");
    }
  };

  // check for user-log-in info
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("/auth/login");

    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <div className="p-12 shadow-lg rounded-lg max-w-md mx-auto ">
      <form onSubmit={onSubmitHandler}>
        <h1 className="text-2xl font-bold">
          {post.hasOwnProperty("id") ? "Edit Your Post" : "Create New Posts"}
        </h1>
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Description</h3>
          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm"
          ></textarea>
          <p
            className={`text-cyan-600 font-medium text-sm ${
              post.description.length > 300 ? "text-red-600" : ""
            }`}
          >
            {post.description.length}/300
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Posts;

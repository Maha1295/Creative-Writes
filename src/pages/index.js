import Head from "next/head";
import Message from "../../components/Message";
import { useState, useEffect } from "react";
import { db } from "../../utils/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  getDocs,
} from "firebase/firestore";
import Link from "next/link";
import {FaRegComments} from 'react-icons/fa';
export default function Home() {
  // State for all the posts
  const [allPosts, setAllPosts] = useState([]);

  // const getPosts = async () => {
  //   const collectionRef = collection(db, "posts");
  //   const q = query(collectionRef, orderBy("timestamp", "desc"));
  //   const unsubscribe = onSnapshot(q, (snapshot) => {
  //     setAllPosts(snapshot.docs.map((doc) => ({ ...doc.data })));
  //   });
  //   console.log(allPosts);
  //   return unsubscribe;
  // };

  useEffect(() => {
    const getPosts = async () => {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, orderBy("timestamp", "desc"));
      
      const postsSnapshot = onSnapshot(q, (snapshot) => {
        setAllPosts(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id  }))
        );
      });

      // const postsSnapshot = await getDocs(q, postsRef);
      // const postsData = postsSnapshot.docs.map((doc) => {doc.data()});
      // const postsData = postsSnapshot.docs.map((doc) => ({
      //   id: doc.id,
      //   data: doc.data(),
      // }));
      // setAllPosts(postsData);

    };
    getPosts();
  }, []);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="my-2 text-lg font-medium">
        <h2> See what other people are saying....</h2>
        {allPosts.map((post) => (
          <Message key={post.id} {...post}>
            {/* <Link href={{ pathname: `/${post.id}`, query: {...post}}}>
              <button className="text-sm flex">
               {post.comments?.length > 0 ? post.comments?.length : 0} Comments <FaRegComments className="ml-2 align-middle text-center"/>
              </button>
            </Link> */}

          </Message>
        ))}
      </div>
    </>
  );
}

import Message from "../../components/Message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db, auth } from "../../utils/firebase";
import { toast } from "react-toastify";
import { arrayUnion, doc, getDoc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";
import { async } from "@firebase/util";
const Details = () => {
  const router = useRouter();
  const routerData = router.query;

  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);

  // submit a comment

  const commentSubmitHandler = async () =>{
    // check if user logged in
    if(!auth.currentUser) return router.push('/auth/login');
    if(!comment) return toast.error("Don't leave an empty comment....🙃", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1500,
    });

    const docRef = doc(db, 'posts', routerData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        comment,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),

      })
    });
    setComment('');
  }

  // get Comments
  const getComments = async () => {
    const docRef = doc(db, 'posts', routerData.id);
    // const docSnap = await getDoc(docRef);
    const unsubscribe =  onSnapshot(docRef, (snapshot) => {
      setAllComments(snapshot.data().comments);
    }); 
    return unsubscribe;
    // console.log(docSnap.data().comments)
    // setAllComments(docSnap.data().comments);
    // console.log(allComments)
  }

  useEffect(() => {
    if(!router.isReady) return;
    getComments();
  }, [allComments, router.isReady])
  
  return (
    <div>
      Details Hello
      <Message {...routerData}>
        
      </Message>
      <div className="my-4">
        <div className="flex px-4">
        <input
          onChange={(e) => {
            setComment(e.target.value);
          }}
          type="text"
          value={comment}
          placeholder="Send a message...🚀"
          className="w-full p-2 text-sm rounded-lg"
        />
        <button onClick={commentSubmitHandler} className="bg-gray-600 rounded-lg text-white text-sm mx-2 p-1">Submit</button>
        </div>
        <div className="py-2">
          <h2 className="font-bold">Comments</h2>
          {
            allComments.map( message => (
              <div className="bg-white p-4  my-4 border-2 " key={message.time}>
                <div className="flex items-center gap-2 mb-4 ">
                  <img className="w-10 rounded-full " src={message.avatar} alt=""/>
                  <h2>{message.userName}</h2>
                </div>
                <h2>{message.comment}</h2>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Details;

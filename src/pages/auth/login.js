import {FcGoogle} from 'react-icons/fc';
import { GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import { auth } from '../../../utils/firebase';
import { useRouter } from 'next/router';
import {useAuthState} from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
const Login = () => {

    const route = useRouter();
    const [user, loading] = useAuthState(auth);

    // SignIn with Google
    const googleAuthProvider = new GoogleAuthProvider();

    const googleLogInHandler = async () => {
        try {
            const result = await signInWithPopup(auth, googleAuthProvider);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        
        if(user){
            route.push('/dashboard');
        }else{
            console.log("login");
        }
    
    }, [user])
    

  return (
    <div className='shadow-xl mt-8 p-10 text-gray-700 rounded-lg bg-white'>
        <h2 className='text-2xl font-medium'>
            Join Today
        </h2>
        <div className='py-4'>
            <button onClick={googleLogInHandler} className='text-white bg-gray-700 w-full font-medium rounded-lg flex align-middle p-4 gap-2'>
                <FcGoogle className='text-2xl'/>
                Sign In with Google</button>
        </div>
    </div>
  )
}

export default Login
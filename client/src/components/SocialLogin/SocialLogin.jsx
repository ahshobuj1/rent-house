import {FcGoogle} from 'react-icons/fc';
import useAuth from '../../hooks/useAuth';
import {useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';

const SocialLogin = () => {
    const navigate = useNavigate();
    const {signInWithGoogle} = useAuth();

    const handleGoogleLogin = () => {
        signInWithGoogle()
            .then(() => {
                toast.success('login Successful');
                navigate(location?.state ? location.state : '/');
            })
            .catch((err) => console.log(err.message));
    };
    return (
        <div className="flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 border-rounded cursor-pointer">
            <FcGoogle size={32} />

            <p onClick={handleGoogleLogin}>Continue with Google</p>
        </div>
    );
};

export default SocialLogin;

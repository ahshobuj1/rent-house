import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import SocialLogin from '../../components/SocialLogin/SocialLogin';

const Login = () => {
    const {resetPassword, signIn} = useAuth();
    const navigate = useNavigate();
    const location = useLocation;

    const {register, handleSubmit} = useForm();

    const onSubmit = async (data) => {
        try {
            await signIn(data.email, data.password);
            toast.success('Success Login');
            navigate(location?.state ? location.state : '/');
        } catch (error) {
            console.log(error);
            toast.error('Success Login');
        }
    };

    const handleResetPass = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        resetPassword(email)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => console.log(err.message));

        toast.success('Check your email');
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900">
                <div className="mb-8 text-center">
                    <h1 className="my-3 text-4xl font-bold">Log In</h1>
                    <p className="text-sm text-gray-400">
                        Sign in to access your account
                    </p>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate=""
                    action=""
                    className="space-y-6 ng-untouched ng-pristine ng-valid">
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm">
                                Email address
                            </label>
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                })}
                                type="email"
                                id="email"
                                placeholder="Enter Your Email Here"
                                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                                data-temp-mail-org="0"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between">
                                <label
                                    htmlFor="password"
                                    className="text-sm mb-2">
                                    Password
                                </label>
                            </div>
                            <input
                                {...register('password', {
                                    required: 'Password is required',
                                })}
                                type="password"
                                autoComplete="123456Aa#"
                                id="password"
                                placeholder="*******"
                                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="bg-rose-500 w-full rounded-md py-3 text-white">
                            Continue
                        </button>
                    </div>
                </form>
                <div className="space-y-1">
                    <button
                        className=" text-xs hover:underline hover:text-rose-500 text-gray-400"
                        onClick={() =>
                            document.getElementById('my_modal_3').showModal()
                        }>
                        Forgot password?
                    </button>
                    <dialog id="my_modal_3" className="modal">
                        <div className="modal-box">
                            <form method="dialog" onSubmit={handleResetPass}>
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                    ✕
                                </button>
                            </form>

                            <form>
                                <div className="flex flex-col gap-5 py-10">
                                    <input
                                        className="grow border-4"
                                        placeholder="Type your email"
                                        type="email"
                                        name="email"
                                        required
                                    />
                                    <input
                                        className="btn btn-neutral btn-sm "
                                        type="submit"
                                        value="Reset"
                                    />
                                </div>
                            </form>
                        </div>
                    </dialog>
                </div>
                <div className="flex items-center pt-4 space-x-1">
                    <div className="flex-1 h-px sm:w-16 dark:bg-gray-700"></div>
                    <p className="px-3 text-sm dark:text-gray-400">
                        Login with social accounts
                    </p>
                    <div className="flex-1 h-px sm:w-16 dark:bg-gray-700"></div>
                </div>
                {/* Social Login */}
                <SocialLogin />
                <p className="px-6 text-sm text-center text-gray-400">
                    Do not have an account yet?{' '}
                    <Link
                        to="/signup"
                        className="hover:underline hover:text-rose-500 text-gray-600">
                        Sign up
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
};

export default Login;

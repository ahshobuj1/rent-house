import {Link} from 'react-router-dom';
import {FcGoogle} from 'react-icons/fc';
import {useForm} from 'react-hook-form';
import {UploadImage} from '../../utilities/UploadImage';

const SignUp = () => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    const onSubmit = async (data) => {
        console.log(data);
        const {image, name, email, password} = data;
        const imageFile = data.image[0];

        try {
            const imageUrl = await UploadImage(imageFile);
            console.log(imageUrl);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900">
                <div className="mb-8 text-center">
                    <h1 className="my-3 text-4xl font-bold">Sign Up</h1>
                    <p className="text-sm text-gray-400">
                        Welcome to StayVista
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
                                Name
                            </label>
                            <input
                                {...register('name', {
                                    required: 'Name is required',
                                })}
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Enter Your Name Here"
                                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                                data-temp-mail-org="0"
                            />
                        </div>
                        <p className="text-red-600">{errors.name?.message}</p>
                        <div>
                            <label
                                htmlFor="image"
                                className="block mb-2 text-sm">
                                Select Image:
                            </label>
                            <input
                                {...register('image', {
                                    required: 'Image is required',
                                })}
                                required
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                            />
                        </div>
                        <p className="text-red-600">{errors.image?.message}</p>
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm">
                                Email address
                            </label>
                            <input
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                        message: 'Type a valid email',
                                    },
                                })}
                                type="email"
                                name="email"
                                id="email"
                                required
                                placeholder="Enter Your Email Here"
                                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                                data-temp-mail-org="0"
                            />
                        </div>
                        <p className="text-red-600">{errors.email?.message}</p>
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
                                    pattern: {
                                        value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                                        message:
                                            'Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character:',
                                    },
                                })}
                                type="password"
                                name="password"
                                //autoComplete="123456Aa#"
                                id="password"
                                required
                                placeholder="*******"
                                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900"
                            />
                        </div>
                        <p className="text-red-600">
                            {errors.password?.message}
                        </p>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="bg-rose-500 w-full rounded-md py-3 text-white">
                            Continue
                        </button>
                    </div>
                </form>
                <div className="flex items-center pt-4 space-x-1">
                    <div className="flex-1 h-px sm:w-16 dark:bg-gray-700"></div>
                    <p className="px-3 text-sm dark:text-gray-400">
                        Signup with social accounts
                    </p>
                    <div className="flex-1 h-px sm:w-16 dark:bg-gray-700"></div>
                </div>
                <div className="flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 border-rounded cursor-pointer">
                    <FcGoogle size={32} />

                    <p>Continue with Google</p>
                </div>
                <p className="px-6 text-sm text-center text-gray-400">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="hover:underline hover:text-rose-500 text-gray-600">
                        Login
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
};

export default SignUp;

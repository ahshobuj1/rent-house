import PropTypes from 'prop-types';
import LoadingSpinner from '../Shared/LoadingSpinner';
import UpdateUserModal from '../Modal/UpdateUserModal';
import {useState} from 'react';
import {useMutation} from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
const UserDataRow = ({user, refetch, isPending}) => {
    const [isOpen, setIsOpen] = useState(false);
    const axiosSecure = useAxiosSecure();
    const {user: currentUser} = useAuth();

    // Update user role
    const {mutateAsync} = useMutation({
        mutationFn: async (updateRole) => {
            const res = await axiosSecure.patch(
                `/update-role/${user?.email}`,
                updateRole
            );
            return res.data;
        },

        onSuccess: () => {
            toast.success('User role updated successfully');
            setIsOpen(false);
            refetch();
        },
    });

    const modalHandler = async (selected) => {
        const updateRole = {
            role: selected,
            status: 'Normal',
        };

        try {
            // Call mutation to patch user role
            await mutateAsync(updateRole);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    if (isPending) {
        return <LoadingSpinner />;
    }

    return (
        <tr>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">
                    {user?.email}
                </p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">{user?.role}</p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {user?.status ? (
                    <p
                        className={`${
                            user?.status === 'Normal'
                                ? 'text-green-500'
                                : 'text-red-500'
                        } whitespace-no-wrap`}>
                        {user?.status}
                    </p>
                ) : (
                    <p className="text-red-500 whitespace-no-wrap">
                        Unavailable
                    </p>
                )}
            </td>

            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <button
                    onClick={() => setIsOpen(true)}
                    disabled={currentUser?.email === user?.email}
                    className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
                    aria-label={`Update role for ${user?.email}`}>
                    <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-green-200 opacity-50 rounded-lg"></span>
                    <span className="relative">
                        {currentUser?.email === user?.email
                            ? 'Your Role..!'
                            : 'Update Role'}
                    </span>
                </button>
                {/* Update User Modal */}
                <UpdateUserModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    modalHandler={modalHandler}
                    user={user}
                />
            </td>
        </tr>
    );
};

UserDataRow.propTypes = {
    user: PropTypes.object,
    refetch: PropTypes.func,
    isPending: PropTypes.bool,
};

export default UserDataRow;

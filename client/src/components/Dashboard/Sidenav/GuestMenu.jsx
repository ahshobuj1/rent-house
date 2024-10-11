import {BsFingerprint, BsGraphUp} from 'react-icons/bs';
import {GrUserAdmin} from 'react-icons/gr';
import MenuItem from './/MenuItem';
import useHandleRequestHost from '../../../hooks/useHandleRequestHost';
import useAuth from '../../../hooks/useAuth';
import useRole from '../../../hooks/useRole';

const GuestMenu = () => {
    const {handleRequestHost} = useHandleRequestHost();
    const {user} = useAuth();
    const [role] = useRole();

    const handleSendRequest = () => {
        const updateStatus = {
            email: user?.email,
            status: 'Requested',
        };
        handleRequestHost(updateStatus);
    };

    return (
        <>
            <MenuItem
                icon={BsGraphUp}
                label="Statistics"
                address="/dashboard"
            />

            <MenuItem
                icon={BsFingerprint}
                label="My Bookings"
                address="my-bookings"
            />

            {role === 'Guest' && (
                <div className="flex items-center px-4 py-2 mt-5  transition-colors duration-300 transform text-gray-600  hover:bg-gray-300   hover:text-gray-700 cursor-pointer">
                    <GrUserAdmin className="w-5 h-5" />

                    <button
                        onClick={handleSendRequest}
                        className="mx-4 font-medium">
                        Become A Host
                    </button>
                </div>
            )}
        </>
    );
};

export default GuestMenu;

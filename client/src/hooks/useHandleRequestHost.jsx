import Swal from 'sweetalert2';
import useAxiosSecure from './useAxiosSecure';
import toast from 'react-hot-toast';

const useHandleRequestHost = () => {
    const axiosSecure = useAxiosSecure();

    const handleRequestHost = (updateStatus) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to be host!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Request!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosSecure.put(`/user`, updateStatus);

                    if (res.data.modifiedCount > 0) {
                        toast.success('Successfully requested for host!');
                    } else {
                        toast.success('Wait for admin approval!');
                    }
                } catch (error) {
                    console.log(error);
                    toast.error(error.message);
                }
            }
        });
    };

    return {handleRequestHost};
};

export default useHandleRequestHost;

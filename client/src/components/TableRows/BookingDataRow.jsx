import {format} from 'date-fns';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const BookingDataRow = ({booking, refetch}) => {
    const axiosSecure = useAxiosSecure();

    // Cancel  booking
    const handleCancelBooking = (id) => {
        console.log(id);
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Cancel Book!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosSecure.delete(`/cancel-booking/${id}`);
                console.log(res.data);
                // Update room status
                await axiosSecure.patch(`/update-status/${booking?.roomId}`, {
                    status: false,
                });
                toast.success('Your booking have cancelled now!');
                refetch();
            }
        });
    };
    return (
        <tr>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="block relative">
                            <img
                                alt="profile"
                                src={booking?.image}
                                className="mx-auto object-cover rounded h-10 w-15 "
                            />
                        </div>
                    </div>
                    <div className="ml-3">
                        <p className="text-gray-900 whitespace-no-wrap">
                            {booking?.title}
                        </p>
                    </div>
                </div>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="block relative">
                            <img
                                alt="profile"
                                src={booking?.host?.image}
                                className="mx-auto object-cover rounded h-10 w-15 "
                            />
                        </div>
                    </div>
                    <div className="ml-3">
                        <p className="text-gray-900 whitespace-no-wrap">
                            {booking?.host?.name}
                        </p>
                    </div>
                </div>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">
                    ${booking?.price}
                </p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">
                    {format(new Date(booking?.from), 'P')}
                </p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap">
                    {format(new Date(booking?.to), 'P')}
                </p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <button
                    onClick={() => handleCancelBooking(booking?._id)}
                    className=" btn btn-sm relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 rounded-full  leading-tight">
                    <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
                    <span className="relative">Cancel</span>
                </button>
            </td>
        </tr>
    );
};

BookingDataRow.propTypes = {
    booking: PropTypes.object,
    refetch: PropTypes.func,
};

export default BookingDataRow;

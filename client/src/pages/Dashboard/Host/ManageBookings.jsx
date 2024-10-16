import {Helmet} from 'react-helmet-async';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import HostBookingDataRow from '../../../components/TableRows/HostBokingDataRow';
import {useQuery} from '@tanstack/react-query';

const ManageBookings = () => {
    const {user, loading} = useAuth();
    const axiosSecure = useAxiosSecure();

    const {data, isPending} = useQuery({
        queryKey: ['host-booking', user?.email],
        enabled: !loading,
        queryFn: async () => {
            const res = await axiosSecure.get(`/booking-host/${user?.email}`);
            return res.data;
        },
    });

    if (isPending) return <LoadingSpinner />;
    return (
        <>
            <Helmet>
                <title>Manage Bookings</title>
            </Helmet>

            <div className="container mx-auto px-4 sm:px-8">
                <div className="py-8">
                    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                                            Title
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                                            Guest Info
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                                            Price
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                                            From
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                                            To
                                        </th>
                                        {/* <th
                                            scope="col"
                                            className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                                            Action
                                        </th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((booking) => (
                                        <HostBookingDataRow
                                            key={booking._id}
                                            booking={booking}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManageBookings;

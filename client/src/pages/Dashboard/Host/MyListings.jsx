import {Helmet} from 'react-helmet-async';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import {useQuery} from '@tanstack/react-query';
import LoadingSpinner from '../../../components/Shared/LoadingSpinner';
import useAuth from '../../../hooks/useAuth';
import RoomDataRow from '../../../components/TableRows/RoomDataRow';
import Swal from 'sweetalert2';

const MyListings = () => {
    const axiosSecure = useAxiosSecure();
    const {user, loading} = useAuth();

    const {
        data: rooms = [],
        isPending: isLoading,
        refetch,
    } = useQuery({
        queryKey: ['my-listings', user?.email],
        enabled: !loading,
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-listings/${user?.email}`);
            return res.data;
        },
    });

    console.log('rooms data ->', rooms);

    // Handle Delete
    const handleDelete = (id) => {
        console.log(id);
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Delete
                const res = await axiosSecure.delete(`/room/${id}`);
                if (res.data.deletedCount > 0) {
                    refetch();
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Your file has been deleted.',
                        icon: 'success',
                    });
                }
            }
        });
    };

    // Handle Update
    const handleUpdate = (id) => {
        console.log(id);
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to update this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Delete
                const res = await axiosSecure.patch(`/room/${id}`);
                if (res.data.modifiedCount > 0) {
                    refetch();
                    Swal.fire({
                        title: 'Updated!',
                        text: 'Your file has been updated.',
                        icon: 'success',
                    });
                }
            }
        });
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <>
            <Helmet>
                <title>My Listings</title>
            </Helmet>

            <div className="container mx-auto px-4 sm:px-8">
                <div className="py-8">
                    <h2 className="text-xl">Total Rooms : {rooms.length}</h2>
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
                                            Location
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
                                        <th
                                            scope="col"
                                            className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                                            Delete
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                                            Update
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.map((room) => (
                                        <RoomDataRow
                                            key={room._id}
                                            room={room}
                                            handleDelete={handleDelete}
                                            handleUpdate={handleUpdate}
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

export default MyListings;

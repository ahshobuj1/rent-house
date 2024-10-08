import {useQuery} from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';

const useLoadUsers = () => {
    const axiosSecure = useAxiosSecure();

    const {
        data: users = [],
        isPending,
        refetch,
    } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        },
    });

    return [users, isPending, refetch];
};

export default useLoadUsers;

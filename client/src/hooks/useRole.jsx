import {useQuery} from '@tanstack/react-query';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';

const useRole = () => {
  const axiosSecure = useAxiosSecure();
  const {user, loading} = useAuth();

  const {data: role, isPending} = useQuery({
    queryKey: ['role', user?.email],
    enabled: !loading,
    queryFn: async () => {
      const res = await axiosSecure(`/user/${user?.email}`);
      return res.data.role;
    },
  });

  return [role, isPending];
};

export default useRole;

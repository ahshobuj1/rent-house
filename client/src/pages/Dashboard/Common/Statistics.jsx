import useRole from '../../../hooks/useRole';
import AdminStatistics from '../Admin/AdminStatistics';
import GuestStatistics from '../Guest/GuestStatistics';
import HostStatistics from '../Host/HostStatistics';

const Statistics = () => {
    const [role] = useRole();
    return (
        <>
            {role === 'Admin' && <AdminStatistics />}
            {role === 'Host' && <HostStatistics />}
            {role === 'Guest' && <GuestStatistics />}
        </>
    );
};

export default Statistics;

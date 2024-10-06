import {Outlet} from 'react-router-dom';
import SideNavigation from '../pages/Dashboard/Common/SideNavigation';

const Dashboard = () => {
    return (
        <div className="flex gap-6">
            {/* SideNav */}
            <div className="min-h-screen w-64">
                <SideNavigation />
            </div>
            {/* Outlet */}
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
};

export default Dashboard;

import PropTypes from 'prop-types';
import useRole from '../hooks/useRole';
import useAuth from '../hooks/useAuth';
import {useNavigate} from 'react-router-dom';
import LoadingSpinner from '../components/Shared/LoadingSpinner';

const AdminRoute = ({children}) => {
  const {user, loading} = useAuth();
  const [role] = useRole();
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner />;
  if (!user || role !== 'Admin') return navigate('/');
  if (user && role === 'Admin') return children;

  return navigate('/');
};

AdminRoute.propTypes = {
  children: PropTypes.node,
};

export default AdminRoute;

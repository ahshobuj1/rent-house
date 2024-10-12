import PropTypes from 'prop-types';
import useRole from '../hooks/useRole';
import useAuth from '../hooks/useAuth';
import {useNavigate} from 'react-router-dom';
import LoadingSpinner from '../components/Shared/LoadingSpinner';

const HostRoute = ({children}) => {
  const {user, loading} = useAuth();
  const [role] = useRole();
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner />;
  if (!user || role !== 'Host') return navigate('/');
  if (user && role === 'Host') return children;

  return navigate('/');
};

HostRoute.propTypes = {
  children: PropTypes.node,
};

export default HostRoute;

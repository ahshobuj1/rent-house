import {Chart} from 'react-google-charts';
import PropTypes from 'prop-types';
import LoadingSpinner from '../../Shared/LoadingSpinner';
import {useEffect} from 'react';
import {useState} from 'react';

const options = {
  title: 'Sales Over Time',
  curveType: 'function',
  legend: {position: 'bottom'},
  series: [{color: '#F43F5E'}],
};
const SalesLineChart = ({data}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setInterval(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <LoadingSpinner smallHeight />;

  return data.length > 1 ? (
    <Chart chartType="LineChart" width="100%" data={data} options={options} />
  ) : (
    <>
      <LoadingSpinner smallHeight />
      <p className="text-center font-medium">No Chart Data Available</p>
    </>
  );
};

export default SalesLineChart;

SalesLineChart.propTypes = {
  data: PropTypes.array,
};

// const data = [
//   ['Day', 'Sales'],
//   ['9', 1000],
//   ['10', 1170],
//   ['11', 660],
//   ['12', 1030],
// ];

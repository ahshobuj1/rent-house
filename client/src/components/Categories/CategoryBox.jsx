import PropTypes from 'prop-types';
import queryString from 'query-string';
import {useNavigate, useSearchParams} from 'react-router-dom';

const CategoryBox = ({label, icon: Icon}) => {
    const navigate = useNavigate();

    //* Get query to url: Parse and stringify URL query strings
    const [params] = useSearchParams();
    const category = params.get('category');
    console.log(category);

    const handleClick = () => {
        //* Set query to url: Parse and stringify URL query strings
        const currentCategory = {category: label};
        const url = queryString.stringifyUrl({
            url: '/',
            query: currentCategory,
        });
        navigate(url);
        //console.log(url);
    };

    return (
        <div
            onClick={handleClick}
            className={`flex 
  flex-col 
  items-center 
  justify-center  
  gap-2
  p-3
  border-b-2
  hover:text-neutral-800
  transition
  cursor-pointer ${category === label && 'border-b-red-600 text-green-600'}`}>
            <Icon size={26} />
            <div className="text-sm font-medium">{label}</div>
        </div>
    );
};

CategoryBox.propTypes = {
    label: PropTypes.string,
    icon: PropTypes.elementType,
};

export default CategoryBox;

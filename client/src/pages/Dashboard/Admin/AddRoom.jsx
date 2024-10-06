import {useState} from 'react';
import AddRoomForm from '../../../components/Form/AddRoomForm';

const AddRoom = () => {
    const [dates, setDates] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    });

    const handleDate = (item) => {
        setDates(item.selection);
    };

    console.log(dates);

    return (
        <div>
            <AddRoomForm
                dates={dates}
                setDates={setDates}
                handleDate={handleDate}
            />
        </div>
    );
};

export default AddRoom;

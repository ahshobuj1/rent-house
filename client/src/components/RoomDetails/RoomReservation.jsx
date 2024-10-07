import PropTypes from 'prop-types';
import Button from '../Shared/Button/Button';
import {DateRange} from 'react-date-range';
import {useState} from 'react';

const RoomReservation = ({room}) => {
    const initialStartDate = room?.from ? new Date(room.from) : new Date();
    const initialEndDate = room?.to ? new Date(room.to) : new Date();

    const [state, setState] = useState([
        {
            startDate: initialStartDate,
            endDate: initialEndDate,
            key: 'selection',
        },
    ]);

    console.log('room to -->', room.to);
    console.log('room from -->', room.from);

    return (
        <div className="rounded-xl border-[1px] border-neutral-200 overflow-hidden bg-white">
            <div className="flex items-center gap-1 p-4">
                <div className="text-2xl font-semibold">$ {room?.price}</div>
                <div className="font-light text-neutral-600">night</div>
            </div>
            <hr />
            <div className="flex justify-center">
                {/* Calender */}
                <DateRange
                    rangeColors={['#f43f5e']}
                    showDateDisplay={false}
                    onChange={(item) => {
                        console.log(item);
                        setState([
                            {
                                startDate: initialStartDate,
                                endDate: initialEndDate,
                                key: 'selection',
                            },
                        ]);
                    }}
                    moveRangeOnFirstSelection={false}
                    ranges={state}
                />
            </div>
            <hr />
            <div className="p-4">
                <Button label={'Reserve'} />
            </div>
            <hr />
            <div className="p-4 flex items-center justify-between font-semibold text-lg">
                <div>Total</div>
                <div>${room?.price}</div>
            </div>
        </div>
    );
};

RoomReservation.propTypes = {
    room: PropTypes.object,
};

export default RoomReservation;

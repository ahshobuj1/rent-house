import PropTypes from 'prop-types';
import Button from '../Shared/Button/Button';
import {DateRange} from 'react-date-range';
import {useEffect, useState} from 'react';
import {differenceInCalendarDays} from 'date-fns';
import BookingModal from '../Modal/BookingModal';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import {useNavigate} from 'react-router-dom';
import LoadingSpinner from '../Shared/LoadingSpinner';

const RoomReservation = ({room}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState([
    {
      startDate: room?.from ? new Date(room.from) : new Date(),
      endDate: room?.to ? new Date(room.to) : new Date(),
      key: 'selection',
    },
  ]);
  const {user, loading} = useAuth();

  const navigate = useNavigate();

  // Update state when room prop changes
  useEffect(() => {
    if (room?.from && room?.to) {
      setState([
        {
          startDate: new Date(room.from),
          endDate: new Date(room.to),
          key: 'selection',
        },
      ]);
    }
  }, [room]);

  const totalPrice =
    differenceInCalendarDays(new Date(room?.to), new Date(room?.from)) *
    room?.price;

  //Handle Booking Modal
  const closeModal = () => {
    setIsOpen(false);
  };

  // Handle Reserve
  const handleReserve = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (!user) {
      return Swal.fire({
        title: 'You have to login first?',
        text: "You won't be able to reserve this!",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Login !',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
    }

    setIsOpen(true);
  };

  console.log(totalPrice);
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
                startDate: new Date(room.from),
                endDate: new Date(room.to),
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
        <Button
          onClick={handleReserve}
          label={room?.booked ? 'Booked' : 'Reserve'}
          disabled={room?.booked}
        />
      </div>
      {/* Booking Modal */}
      <BookingModal
        isOpen={isOpen}
        closeModal={closeModal}
        bookingInfo={{
          ...room,
          price: totalPrice,
          guest: {
            name: user?.displayName,
            email: user?.email,
            image: user?.photoURL,
          },
        }}
      />
      <hr />
      <div className="p-4 flex items-center justify-between font-semibold text-lg">
        <div>Total</div>
        <div>${totalPrice}</div>
      </div>
    </div>
  );
};

RoomReservation.propTypes = {
  room: PropTypes.object,
};

export default RoomReservation;

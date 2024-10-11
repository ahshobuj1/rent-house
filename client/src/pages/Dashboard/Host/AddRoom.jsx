import {useState} from 'react';
import AddRoomForm from '../../../components/Form/AddRoomForm';
import {UploadImage} from '../../../utilities/UploadImage';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import {useMutation} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';

const AddRoom = () => {
  //const [imagePrev, setImagePrev] = useState(null);
  const {user, loading, setLoading} = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Handle dates
  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  const handleDate = (item) => {
    setDates(item.selection);
  };

  // Post Room Data with TanStack Query - Mutation
  const {mutateAsync} = useMutation({
    mutationFn: async (roomData) => {
      const res = await axiosSecure.post('/rooms', roomData);
      return res.data;
    },
    onSuccess: () => {
      setLoading(false);
      toast.success('Room added successfully');
      navigate('/dashboard/my-listings');
    },
  });

  // React-Hooks-Form
  const onSubmitForm = async (data, reset) => {
    const from = dates.startDate;
    const to = dates.endDate;
    const {
      location,
      bathrooms,
      bedrooms,
      category,
      price,
      title,
      description,
      guests: total_guest,
    } = data;

    console.log(data);
    const imageFile = data.image[0];
    console.log(imageFile);

    try {
      setLoading(true);
      const imageUrl = await UploadImage(imageFile);
      const roomData = {
        location,
        bathrooms,
        bedrooms,
        category,
        price,
        title,
        description,
        total_guest,
        from,
        to,
        image: imageUrl,
        host: {
          name: user?.displayName,
          email: user?.email,
          image: user?.photoURL,
        },
      };
      console.log(roomData);
      await mutateAsync(roomData);
      reset();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Handle preview image
  /*  const handleImage = (image) => {
        setImagePrev(URL.createObjectURL(image[0]));
    }; */

  return (
    <div>
      <AddRoomForm
        dates={dates}
        handleDate={handleDate}
        onSubmitForm={onSubmitForm}
        loading={loading}
        // imagePrev={imagePrev}
        // handleImage={handleImage}
      />
    </div>
  );
};

export default AddRoom;

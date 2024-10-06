import {useState} from 'react';
import AddRoomForm from '../../../components/Form/AddRoomForm';
import {UploadImage} from '../../../utilities/UploadImage';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import {useMutation} from '@tanstack/react-query';
import toast from 'react-hot-toast';

const AddRoom = () => {
    const {user, loading, setLoading} = useAuth();
    const axiosSecure = useAxiosSecure();

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
            const res = await axiosSecure.post('/room', roomData);
            return res.data;
        },
        onSuccess: () => {
            setLoading(false);
            toast.success('Room added successfully');
        },
    });

    // React-Hooks-Form
    const onSubmitForm = async (data, reset) => {
        setLoading(true);
        const {
            location,
            bathrooms,
            bedrooms,
            category,
            price,
            title,
            description,
            total_guest,
        } = data;

        const imageFile = data.image[0];

        try {
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

    return (
        <div>
            <AddRoomForm
                dates={dates}
                handleDate={handleDate}
                onSubmitForm={onSubmitForm}
                loading={loading}
            />
        </div>
    );
};

export default AddRoom;

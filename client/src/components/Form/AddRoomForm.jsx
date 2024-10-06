import {categories} from '../Categories/CategoriesData';
import {DateRange} from 'react-date-range';
import {useForm} from 'react-hook-form';
import {ImSpinner9} from 'react-icons/im';

// eslint-disable-next-line react/prop-types
const AddRoomForm = ({dates, handleDate, onSubmitForm, loading}) => {
    const {register, handleSubmit, reset} = useForm();

    const onSubmit = (data) => {
        onSubmitForm(data, reset);
    };

    return (
        <div className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center items-center text-gray-800 rounded-xl bg-gray-50">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="space-y-1 text-sm">
                            <label
                                htmlFor="location"
                                className="block text-gray-600">
                                Location
                            </label>
                            <input
                                {...register('location', {required: true})}
                                className="w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md "
                                id="location"
                                type="text"
                                placeholder="Location"
                            />
                        </div>

                        <div className="space-y-1 text-sm">
                            <label
                                htmlFor="category"
                                className="block text-gray-600">
                                Category
                            </label>
                            <select
                                {...register('category', {required: true})}
                                className="w-full px-4 py-3 border-rose-300 focus:outline-rose-500 rounded-md">
                                {categories.map((category) => (
                                    <option
                                        value={category.label}
                                        key={category.label}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label
                                htmlFor="location"
                                className="block text-gray-600">
                                Select Availability Range
                            </label>
                            {/* Calender */}
                            <DateRange
                                rangeColors={['#f43f5e']}
                                editableDateInputs={true}
                                onChange={(item) => handleDate(item)}
                                moveRangeOnFirstSelection={false}
                                ranges={[dates]}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-1 text-sm">
                            <label
                                htmlFor="title"
                                className="block text-gray-600">
                                Title
                            </label>
                            <input
                                {...register('title', {required: true})}
                                className="w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md "
                                id="title"
                                type="text"
                                placeholder="Title"
                            />
                        </div>

                        <div className=" p-4 bg-white w-full  m-auto rounded-lg">
                            <div className="file_upload px-5 py-3 relative border-4 border-dotted border-gray-300 rounded-lg">
                                <div className="flex flex-col w-max mx-auto text-center">
                                    <label>
                                        <input
                                            {...register('image', {
                                                required: true,
                                            })}
                                            className="text-sm cursor-pointer w-36 hidden"
                                            type="file"
                                            id="image"
                                            accept="image/*"
                                            hidden
                                        />
                                        <div className="bg-rose-500 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-rose-500">
                                            Upload Image
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between gap-2">
                            <div className="space-y-1 text-sm">
                                <label
                                    htmlFor="price"
                                    className="block text-gray-600">
                                    Price
                                </label>
                                <input
                                    {...register('price', {required: true})}
                                    className="w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md "
                                    id="price"
                                    type="number"
                                    placeholder="Price"
                                />
                            </div>

                            <div className="space-y-1 text-sm">
                                <label
                                    htmlFor="guest"
                                    className="block text-gray-600">
                                    Total guest
                                </label>
                                <input
                                    {...register('total_guest', {
                                        required: true,
                                    })}
                                    className="w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md "
                                    id="guest"
                                    type="number"
                                    placeholder="Total guest"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between gap-2">
                            <div className="space-y-1 text-sm">
                                <label
                                    htmlFor="bedrooms"
                                    className="block text-gray-600">
                                    Bedrooms
                                </label>
                                <input
                                    {...register('bedrooms', {required: true})}
                                    className="w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md "
                                    id="bedrooms"
                                    type="number"
                                    placeholder="Bedrooms"
                                />
                            </div>

                            <div className="space-y-1 text-sm">
                                <label
                                    htmlFor="bathrooms"
                                    className="block text-gray-600">
                                    Bathrooms
                                </label>
                                <input
                                    {...register('bathrooms', {required: true})}
                                    className="w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md "
                                    id="bathrooms"
                                    type="number"
                                    placeholder="Bathrooms"
                                />
                            </div>
                        </div>

                        <div className="space-y-1 text-sm">
                            <label
                                htmlFor="description"
                                className="block text-gray-600">
                                Description
                            </label>

                            <textarea
                                {...register('description', {required: true})}
                                id="description"
                                className="block rounded-md focus:rose-300 w-full h-32 px-4 py-3 text-gray-800  border border-rose-300 focus:outline-rose-500 "></textarea>
                        </div>
                    </div>
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full p-3 mt-5 text-center font-medium text-white transition duration-200 rounded shadow-md bg-rose-500">
                    {loading ? (
                        <ImSpinner9 className="animate-spin" />
                    ) : (
                        'Save & Continue'
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddRoomForm;

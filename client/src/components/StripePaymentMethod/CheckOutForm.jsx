import {useState} from 'react';
import {CardElement, useElements, useStripe} from '@stripe/react-stripe-js';
import PropTypes from 'prop-types';
import './CheckOutForm.css';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import LoadingSpinner from '../Shared/LoadingSpinner';
import {useQuery} from '@tanstack/react-query';
import {ImSpinner9} from 'react-icons/im';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';

const CheckOutForm = ({bookingInfo}) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [processing, setProcessing] = useState(false);

    const {user} = useAuth();
    const axiosSecure = useAxiosSecure();
    const price = bookingInfo?.price;
    const navigate = useNavigate();

    const stripe = useStripe();
    const elements = useElements();

    //Get clientSecret
    const {data, isPending} = useQuery({
        queryKey: ['client-secret'],
        queryFn: async () => {
            const res = await axiosSecure.post(`/create-payment-intent`, {
                price,
            });
            return res?.data;
        },
    });
    if (isPending) return <LoadingSpinner smallHeight />;
    const {clientSecret} = data;
    // console.log('[clientSecret] ', clientSecret);

    // Handle payment
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Make sure to confirm payment
        Swal.fire({
            title: 'Are you sure?',
            text: `You wont to payment $${bookingInfo.price}`,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Payment!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Payment
                if (!stripe || !elements) return;

                const card = elements.getElement(CardElement);
                if (card === null) return;

                // eslint-disable-next-line no-unused-vars
                const {error, paymentMethod} = await stripe.createPaymentMethod(
                    {
                        type: 'card',
                        card,
                        billing_details: {
                            email: user?.email || 'Unknown',
                            name: user?.name || 'Unknown',
                        },
                    }
                );

                if (error) {
                    setErrorMessage(error.message);
                } else {
                    // console.log('[paymentMethod] ', paymentMethod);
                    setErrorMessage('');
                }

                setProcessing(true);
                // Confirm Payment
                const {error: confirmError, paymentIntent} =
                    await stripe.confirmCardPayment(clientSecret, {
                        payment_method: {
                            card,
                        },
                    });

                if (confirmError) {
                    setErrorMessage(confirmError.message);
                    setProcessing(false);
                } else {
                    setErrorMessage('');
                    if (paymentIntent.status === 'succeeded') {
                        // console.log('[payment Intent]', paymentIntent);
                        try {
                            setTransactionId(paymentIntent.id);
                            const paymentInfo = {
                                ...bookingInfo,
                                transactionId: paymentIntent.id,
                                roomId: bookingInfo?._id,
                                date: new Date(),
                            };
                            delete paymentInfo._id;

                            await axiosSecure.post('/booking', paymentInfo);
                            await axiosSecure.patch(
                                `/update-status/${bookingInfo?._id}`,
                                {
                                    status: true,
                                }
                            );
                            toast.success('payment success');
                            setProcessing(false);
                            navigate('/dashboard/my-bookings');
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
            }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            {clientSecret && (
                <>
                    <CardElement
                        className="py-3 border-b-2 border-pink-200"
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                    <button
                        type="submit"
                        className="btn btn-neutral btn-sm px-10 my-4 w-full"
                        disabled={!stripe || !clientSecret || processing}>
                        {processing ? (
                            <ImSpinner9 className="animate-spin max-w-20 mx-auto text-red-600" />
                        ) : (
                            `Payment $${bookingInfo?.price}`
                        )}
                    </button>
                    <p className="text-red-600">{errorMessage}</p>
                    {transactionId && (
                        <p className="text-green-600">
                            Payment succeeded, transactionId: {transactionId}
                        </p>
                    )}
                </>
            )}
        </form>
    );
};

CheckOutForm.propTypes = {
    bookingInfo: PropTypes.object.isRequired,
};

export default CheckOutForm;

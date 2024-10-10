import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import CheckOutForm from './CheckOutForm';
import PropTypes from 'prop-types';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentElements = ({bookingInfo}) => {
    return (
        <Elements stripe={stripePromise}>
            <CheckOutForm bookingInfo={bookingInfo} />
        </Elements>
    );
};

PaymentElements.propTypes = {
    bookingInfo: PropTypes.object,
};

export default PaymentElements;

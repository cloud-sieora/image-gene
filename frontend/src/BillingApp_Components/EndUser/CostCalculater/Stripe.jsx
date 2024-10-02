import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { loadStripe } from '@stripe/stripe-js';
import './stripe.css'
import {
    PaymentElement,
    Elements,
    useStripe,
    useElements,
    CardElement
} from '@stripe/react-stripe-js';
import axios from 'axios'

const CheckoutForm = ({ user_data, sub_data, hardware_data, total_cost, buy_flag }) => {
    console.log(user_data, sub_data, hardware_data, total_cost);
    console.log({ ...sub_data, cameras: [{ ...sub_data.cameras[0], device: hardware_data }] });
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        buy_flag(true)

        if (elements == null) {
            return;
        }

        // Trigger form validation and wallet collection
        const { error: submitError } = await elements.submit();
        if (submitError) {
            // Show error to your customer
            setErrorMessage(submitError.message);
            return;
        }

        // Create the PaymentIntent and obtain clientSecret from your server endpoint
        const res = await fetch('http://localhost:5008/secret', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: total_cost,
                currency: 'usd',
                name: user_data.User_name,
                address: {
                    line1: '510 Townsend St',
                    postal_code: '98140',
                    city: 'San Francisco',
                    state: 'CA',
                    country: 'US',
                },
                sub: { ...sub_data, cameras: [{ ...sub_data.cameras[0], device: hardware_data }] },
                dealer_id: user_data.dealer_id
            }
            )
        });

        const { client_secret: clientSecret } = await res.json();

        const { error } = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            clientSecret,
            confirmParams: {
                return_url: 'http://localhost:5173/payment_success',
            },
        });

        if (error) {
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Show error to your customer (for example, payment
            // details incomplete)
            setErrorMessage(error.message);
        } else {
            console.log('payment success');
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement className='stripe_outer' />
            <button type="submit" style={{ width: '100%', textAlign: 'center', marginTop: '20px', borderRadius: '5px', padding: '8px', fontWeight: 'bolder', backgroundColor: 'darkorange' }} disabled={!stripe || !elements}>
                Buy
            </button>
            {/* Show error message to your customers */}
            {errorMessage && <div>{errorMessage}</div>}
        </form>
    );
};

const stripePromise = loadStripe('pk_test_51PDG2USJ5GDjCi3y3hHkmkUJ8HOtnZWG37lG8tYlrP9mVoqcgUyM7m1uj0Keu7c4pcrFNj9JqWpl5WAZxkFLG6qf007zxcHdCR');

const options = {
    mode: 'payment',
    amount: 1099,
    currency: 'usd',
    // Fully customizable with appearance API.
    appearance: {
        /*...*/
    },
};

export default function Stripe({ user_data, sub_data, hardware_data, total_cost, buy_flag }) {
    return (
        <div>
            <Elements stripe={stripePromise} options={options}>
                <CheckoutForm user_data={user_data} sub_data={sub_data} hardware_data={hardware_data} total_cost={total_cost} buy_flag={buy_flag} />
            </Elements>
        </div>
    )
};
// components/SubscribeForm.jsx
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";


const stripePromise = loadStripe("pk_test_51NFvq6ArRmO7hNaVcPS5MwczdEtM4yEMOclovA0k5LtJTxhtzKZ2SKim3p8qmvssQ7j7bREjoRRmHB9Gvz8n8Dfm00UOo9bZYg");

const CheckoutForm = ({ totalPrice }) => {

    const stripe = useStripe();
    const elements = useElements();
    const [email, setEmail] = useState("fozlerabbishuvo@gmail.com");
    const [customername, setCustomerName] = useState("Fozle Rabbi");
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
   

    const handleSubscribe = async (e) => {
        e.preventDefault();

        if (!email || !totalPrice || isNaN(totalPrice) || parseFloat(totalPrice) <= 0) {
            setMessage("Please provide a valid email and subscription amount.");
            return;
        }

        if (!stripe || !elements) {
            setMessage("Stripe has not loaded yet. Please try again later.");
            return;
        }

        setLoading(true);
        try {
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                setMessage("Payment details are missing. Please check and try again.");
                setLoading(false);
                return;
            }
            const { paymentMethod, error: paymentError } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (paymentError) {
                console.error("Error creating payment method:", paymentError);
                setMessage(paymentError.message || "Failed to create payment method.");
                setLoading(false);
                return;
            }

            const response = await axios.post('http://localhost:5000/api/v1/payment/stripeSubscription', {
                email,
                name : customername,
                amount: totalPrice.toString(),
                paymentMethodId: paymentMethod.id,
                userId : "686378d1394a32f019c80030",
            });
            
            
            if (response?.data?.customerId) {
                alert("Subscription created successfully!")
            }
        } catch (error) {
            console.error('Error creating subscription:', error);

            setMessage(error.response?.data?.error || "Failed to create subscription. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto font-sans p-6">
            <h1 className="text-center text-2xl font-bold text-gray-800">Subscribe to Our Service</h1>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-6 mt-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        readOnly
                        className="mt-1  block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Subscription Amount (USD)</label>
                    <input
                        type="number"
                        id="amount"
                        placeholder="Enter amount"
                        value={totalPrice}
                        // onChange={(e) => setAmount(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Details</label>
                    <div className="mt-1 p-3 border border-gray-300 rounded-md">
                        <CardElement className="bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white" />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className={`w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {loading ? 'Processing...' : 'Subscribe'}
                </button>

                {message && <p className={`text-center mt-4 ${message.startsWith('Subscription created') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}

               

            </form>
        </div>
    );


};


const SubscribeForm = ({ amount }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm totalPrice={amount} />
  </Elements>
);

export default SubscribeForm;

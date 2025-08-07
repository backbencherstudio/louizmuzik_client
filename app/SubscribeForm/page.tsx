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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoggedInUser } from "../store/api/authApis/authApi";

const stripePromise = loadStripe(
  "pk_test_51NFvq6ArRmO7hNaVcPS5MwczdEtM4yEMOclovA0k5LtJTxhtzKZ2SKim3p8qmvssQ7j7bREjoRRmHB9Gvz8n8Dfm00UOo9bZYg"
);

interface CheckoutFormProps {
  totalPrice: number;
}

const CheckoutForm = ({ totalPrice }: CheckoutFormProps) => {
  const { data: user, refetch } = useLoggedInUser();
  const userData = user?.data;
  console.log("userData",userData);

  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState(userData?.email);
  // const [customername, setCustomerName] = useState(userData?.name);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !userData?.email ||
      !totalPrice ||
      isNaN(totalPrice) ||
      parseFloat(totalPrice.toString()) <= 0
    ) {
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
      const { paymentMethod, error: paymentError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

      if (paymentError) {
        console.error("Error creating payment method:", paymentError);
        setMessage(paymentError.message || "Failed to create payment method.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/v1/payment/stripeSubscription",
        {
          email: userData?.email,
          name: userData?.name,
          amount: totalPrice.toString(),
          paymentMethodId: paymentMethod.id,
          userId: userData?._id,
        }
      );

      if (response?.data?.customerId) {
        alert("Subscription created successfully!");
      }
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      setMessage(
        error.response?.data?.error ||
          "Failed to create subscription. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubscribe} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-zinc-300"
            >
              Email Address
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={userData?.email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly
              className="mt-1 py-6 border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <Label
              htmlFor="amount"
              className="text-sm font-medium text-zinc-300"
            >
              Subscription Amount (USD)
            </Label>
            <Input
              type="number"
              id="amount"
              placeholder="Enter amount"
              value={totalPrice}
              required
              className="mt-1 py-6 border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-zinc-300">
              Payment Details
            </Label>
            <div className="mt-1 p-3.5 border border-zinc-700 bg-zinc-800 rounded-lg">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#ffffff",
                      "::placeholder": {
                        color: "#9ca3af",
                      },
                      backgroundColor: "transparent",
                    },
                    invalid: {
                      color: "#ef4444",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={!stripe || loading}
          className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : (
            "Subscribe with Card"
          )}
        </Button>

        {message && (
          <div
            className={`text-center p-3 rounded-lg text-sm ${
              message.startsWith("Subscription created")
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

interface SubscribeFormProps {
  amount: number;
}

const SubscribeForm = ({ amount }: SubscribeFormProps) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm totalPrice={amount} />
  </Elements>
);

export default SubscribeForm;

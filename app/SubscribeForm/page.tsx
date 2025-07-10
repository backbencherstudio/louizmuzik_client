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

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("fozlerabbishuvo@gmail.com");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    try {
      const { data } = await axios.post("http://localhost:5000/api/v1/payment/stripeSubscription", {
        customerEmail: email,
        amount,
      });

      const { clientSecret } = data;

      const cardElement = elements.getElement(CardElement);
      if (!stripe || !cardElement) {
        setErrorMsg("Stripe or Card Element not loaded.");
        setLoading(false);
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email,
          },
        },
      });

      if (result.error) {
        setErrorMsg(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setSuccess(true);
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setErrorMsg(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: 400, margin: "auto" }}>
      <h2>Subscribe - ${amount}/month</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ width: "100%", padding: 8, marginBottom: 12, backgroundColor : "green" }}
      />
      <div style={{ border: "1px solid #ccc", padding: 10, borderRadius: 4 , backgroundColor : "white"}}>
        <CardElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        {loading ? "Processing..." : `Subscribe`}
      </button>

      {errorMsg && <p style={{ color: "red", marginTop: 10 }}>{errorMsg}</p>}
      {success && (
        <p style={{ color: "green", marginTop: 10 }}>
          🎉 Subscription successful!
        </p>
      )}
    </form>
  );
};

const SubscribeForm = ({ amount }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm amount={amount} />
  </Elements>
);

export default SubscribeForm;

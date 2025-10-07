import React, { useContext, useEffect, useState } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // loading | success | failed

  const verifyPayment = async () => {
    try {
      const response = await axios.post(`${url}/api/order/verify`, {
        success,
        orderId,
      });

      if (response.data.success) {
        setStatus("success");
        setTimeout(() => navigate("/myorders"), 1500);
      } else {
        setStatus("failed");
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (err) {
      console.error(err);
      setStatus("failed");
      setTimeout(() => navigate("/"), 1500);
    }
  };

  useEffect(() => {
    verifyPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="verify">
      {status === "loading" && <div className="spinner"></div>}
      {status === "success" && <p>✅ Payment verified! Redirecting...</p>}
      {status === "failed" && <p>❌ Payment failed. Redirecting...</p>}
    </div>
  );
};

export default Verify;

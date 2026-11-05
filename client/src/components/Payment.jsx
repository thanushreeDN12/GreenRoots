import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addProgramIdToUser, fetchSingleProgram } from '../actions/programs';

const Payment = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [treeCount, setTreeCount] = useState(1);
    const [programDetails, setProgramDetails] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = JSON.parse(localStorage.getItem("profile"));
    const userId = user?.result?._id ? user.result._id : user?.newUser?._id;

    const { id } = useParams();
    const programId = id;

    // Get programs from Redux store if available
    const reduxProgram = useSelector((state) => 
      state.programs?.program?._id === id 
        ? state.programs.program 
        : Array.isArray(state.programs) 
          ? state.programs.find(p => p._id === id) 
          : null
    );

    useEffect(() => {
      if (reduxProgram) {
        setProgramDetails(reduxProgram);
      } else if (id) {
        fetch(`/api/programs/${id}`)
          .then(res => res.json())
          .then(data => {
            if (data && data._id) setProgramDetails(data);
          })
          .catch(err => console.error("Error fetching program details:", err));
      }
    }, [id, reduxProgram]);

    const unitCost = programDetails?.donationCost || 500;
    const totalAmount = unitCost * treeCount;

    // HANDLES PAYMENT
    const handlePayment = () => {
      setIsProcessing(true);
      setPaymentStatus(null);

      // Record donation with dynamic amount
      dispatch(addProgramIdToUser({ userId, programId, amount: totalAmount }));

      setTimeout(() => {
        setIsProcessing(false);
        setPaymentStatus("success");
        setTimeout(() => {
          navigate('/userprofile');
        }, 1500);
      }, 1200);
    };

    return (
      <div style={styles.card}>
        <div style={styles.badge}>🌱 Carbon Offset Donation</div>
        <h2 style={styles.title}>{programDetails?.title || "Tree Plantation Program"}</h2>
        {programDetails?.location && (
          <p style={styles.location}>📍 {programDetails.location}</p>
        )}

        <div style={styles.pricingBox}>
          <div style={styles.pricingRow}>
            <span>Cost per tree:</span>
            <strong>₹{unitCost}</strong>
          </div>
          
          <div style={{ marginTop: '14px', textAlign: 'left' }}>
            <label style={styles.label}>Select Number of Trees to Sponsor:</label>
            <div style={styles.treeSelector}>
              {[1, 2, 5, 10].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setTreeCount(count)}
                  style={treeCount === count ? styles.activeTreeBtn : styles.treeBtn}
                >
                  {count} {count === 1 ? 'Tree' : 'Trees'}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.totalRow}>
            <span>Total Donation:</span>
            <span style={styles.totalAmount}>₹{totalAmount}</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          style={{
            ...styles.payBtn,
            backgroundColor: isProcessing ? "#a3b18a" : "#2d6a4f",
            cursor: isProcessing ? "not-allowed" : "pointer",
          }}
        >
          {isProcessing ? "Securing Contribution..." : `Donate ₹${totalAmount} Now`}
        </button>

        {paymentStatus === "success" && (
          <p style={styles.successMsg}>
            ✅ Donation Successful! Directing to your impact profile...
          </p>
        )}
        {paymentStatus === "failed" && (
          <p style={styles.errorMsg}>Payment Failed. Please try again.</p>
        )}
      </div>
    );
};

const styles = {
  card: {
    maxWidth: 440,
    width: "calc(100% - 2rem)",
    margin: "2rem auto",
    textAlign: "center",
    padding: "2rem 1.25rem",
    backgroundColor: "#ffffff",
    border: "1px solid #d8e2dc",
    borderRadius: 16,
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
    fontFamily: "'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  badge: {
    display: "inline-block",
    padding: "4px 12px",
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    borderRadius: "20px",
    fontSize: "0.82rem",
    fontWeight: "700",
    marginBottom: "12px"
  },
  title: {
    margin: "0 0 6px",
    fontSize: "1.45rem",
    color: "#1b4332"
  },
  location: {
    color: "#52796f",
    fontSize: "0.92rem",
    margin: "0 0 16px"
  },
  pricingBox: {
    backgroundColor: "#f7fbf8",
    border: "1px solid #dceada",
    borderRadius: 12,
    padding: "16px",
    marginBottom: "20px"
  },
  pricingRow: {
    display: "flex",
    justifyContent: "space-between",
    color: "#2d6a4f",
    fontSize: "0.95rem"
  },
  label: {
    display: "block",
    fontSize: "0.84rem",
    fontWeight: "600",
    color: "#2d6a4f",
    marginBottom: "8px"
  },
  treeSelector: {
    display: "flex",
    gap: "8px",
    justifyContent: "space-between"
  },
  treeBtn: {
    flex: 1,
    padding: "8px 0",
    backgroundColor: "#ffffff",
    border: "1px solid #b7e4c7",
    color: "#1b4332",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  activeTreeBtn: {
    flex: 1,
    padding: "8px 0",
    backgroundColor: "#2d6a4f",
    border: "1px solid #2d6a4f",
    color: "#ffffff",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(45, 106, 79, 0.3)"
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "16px",
    paddingTop: "12px",
    borderTop: "1px dashed #b7e4c7"
  },
  totalAmount: {
    fontSize: "1.35rem",
    fontWeight: "800",
    color: "#1b4332"
  },
  payBtn: {
    width: "100%",
    padding: "0.9rem",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: "1.05rem",
    fontWeight: "700",
    transition: "all 0.2s"
  },
  successMsg: {
    color: "#2e7d32",
    marginTop: "14px",
    fontWeight: "600",
    fontSize: "0.92rem"
  },
  errorMsg: {
    color: "#c62828",
    marginTop: "14px",
    fontWeight: "600"
  }
};

export default Payment;

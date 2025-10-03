// src/features/payment/PaymentMethodsPanel.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayments, deletePayment } from "../paymentSlice";

const PaymentMethodsPanel = () => {
  const dispatch = useDispatch();
  const { payments, status, error: sliceError } = useSelector((state) => state.payment);
  const [loadingAction, setLoadingAction] = React.useState(false);

  // Fetch payments
  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    setLoadingAction(true);
    try {
      await dispatch(deletePayment(id)).unwrap();
    } catch (err) {
      alert("Delete failed: " + err);
    } finally {
      setLoadingAction(false);
    }
  };

  const PaymentItem = ({ p }) => (
    <div className="flex justify-between items-center bg-white shadow rounded p-3 mb-2">
      <div>
        <div className="font-medium text-gray-800">
          {p.payment_method === "paypal"
            ? `PayPal — ${p.transaction_id}`
            : `${p.card_brand || "Card"} ****${p.card_last4}` + (p.transaction_id ? ` — TX: ${p.transaction_id}` : "")}
        </div>
        <div className="text-sm text-gray-500">{new Date(p.created_at).toLocaleString()}</div>
      </div>
      <div className="text-gray-700 mt-1">
        Amount Paid: ${parseFloat(p.amount || 0).toFixed(2)}
      </div>
      <div className="text-gray-500 text-sm">
        Order Total: ${parseFloat(p.order_total || 0).toFixed(2)} | Status: {p.status}
      </div>
      <button
        onClick={() => handleDelete(p.id)}
        disabled={loadingAction}
        className="text-red-500 hover:text-red-700 font-semibold"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>

      {status === "loading" && <p className="text-gray-500">Loading transactions...</p>}
      {sliceError && <p className="text-red-500">{sliceError}</p>}

      <div className="mb-4">
        {payments.length === 0 ? (
          <div className="text-gray-500">No transactions found</div>
        ) : (
          payments.map((p) => <PaymentItem key={p.id} p={p} />)
        )}
      </div>
    </div>
  );
};

export default PaymentMethodsPanel;

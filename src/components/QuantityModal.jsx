import React, { useState, useEffect } from "react";

export default function QuantityModal({ show, onClose, category, onSave, defaultQty = 0 }) {
  const [quantity, setQuantity] = useState(defaultQty);

  useEffect(() => {
    if (show) setQuantity(defaultQty);
  }, [show, defaultQty]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", width: "350px" }}>
        <h3 style={{ marginTop: 0 }}>Add Quantity — {category}</h3>

        <label style={{ display: "block", marginBottom: "8px" }}>Quantity (kg)</label>
        <input
          type="number"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginBottom: "12px",
          }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "6px 12px",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ category, quantity })}
            style={{
              padding: "6px 12px",
              background: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
import React from "react";

export default function WasteTable({ data = [], onAddQuantity }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Category
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Quantity (kg)
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Last Updated
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={4}
                style={{ padding: "12px", textAlign: "center", color: "#666" }}
              >
                No data available
              </td>
            </tr>
          )}
          {data.map((item, idx) => (
            <tr key={idx}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.category}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.quantity}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.lastUpdated
                  ? new Date(item.lastUpdated).toLocaleString()
                  : "-"}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <button
                  onClick={() => onAddQuantity(item.category)}
                  style={{
                    padding: "6px 10px",
                    backgroundColor: "#2b8a3e",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Add Quantity
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

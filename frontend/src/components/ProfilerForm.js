import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProfilerForm = () => {
  const { profiler_name } = useParams();

  const [customers, setCustomers] = useState([]);
  const [models, setModels] = useState([]);
  const [storages, setStorages] = useState([]);
  const [boardTypes, setBoardTypes] = useState([]);
  const [reflowTableData, setReflowTableData] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedBoardType, setSelectedBoardType] = useState("");

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const API_BASE = "http://localhost:5001/api/users";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [c, m, s, b, r] = await Promise.all([
          fetch(`${API_BASE}/customers`).then(res => res.json()),
          fetch(`${API_BASE}/models`).then(res => res.json()),
          fetch(`${API_BASE}/storages`).then(res => res.json()),
          fetch(`${API_BASE}/boardTypes`).then(res => res.json()),
          fetch(`${API_BASE}/reflowtable`).then(res => res.json()),
        ]);

        setCustomers(c);
        setModels(m);
        setStorages(s);
        setBoardTypes(b);
        setReflowTableData(r);
      } catch (err) {
        console.error("Data fetch error:", err);
        setError("Something went wrong while fetching data.");
      }
    };

    fetchData();
  }, [profiler_name]);

  const handleAdd = async () => {
    if (!selectedCustomer || !selectedModel || !selectedStorage || !selectedBoardType) {
      alert("Please select all fields before adding.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/reflowtable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profiler_name,
          customer_name: selectedCustomer,
          model_name: selectedModel,
          storage_name: selectedStorage,
          boardtype_name: selectedBoardType,
        }),
      });

      if (res.ok) {
        alert("Record added successfully!");
        const updatedData = await fetch(`${API_BASE}/reflowtable`).then(res => res.json());
        setReflowTableData(updatedData);
      } else {
        const error = await res.json();
        console.error("Failed to add record:", error);
        alert("Maximum usage reached for this record. Please reset the table.");
      }
    } catch (err) {
      console.error("Add error:", err);
      alert("Error adding to table.");
    } finally {
      setSubmitting(false);
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "1200px", margin: "auto", padding: "30px" }}>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <button
          style={{
            padding: "10px 24px",
            backgroundColor: "#333",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "8px",
            border: "none",
            cursor: "default"
          }}
          disabled
        >
          Profiler: {profiler_name}
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: "15px", marginBottom: "30px" }}>
        <Dropdown label="Customer" options={customers} value={selectedCustomer} setValue={setSelectedCustomer} propName="customer_name" />
        <Dropdown label="Model" options={models} value={selectedModel} setValue={setSelectedModel} propName="model_name" />
        <Dropdown label="Storage" options={storages} value={selectedStorage} setValue={setSelectedStorage} propName="storage_name" />
        <Dropdown label="Board Type" options={boardTypes} value={selectedBoardType} setValue={setSelectedBoardType} propName="boardtype_name" />
      </div>

      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <button
          onClick={handleAdd}
          disabled={submitting}
          style={{
            padding: "10px 20px",
            backgroundColor: submitting ? "#888" : "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: submitting ? "not-allowed" : "pointer",
            fontSize: "16px"
          }}
        >
          {submitting ? "Adding..." : "ADD to Reflow Table"}
        </button>
      </div>

      <h3>Reflow Table Records</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Profiler</th>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Model</th>
            <th style={thStyle}>Storage</th>
            <th style={thStyle}>Board Type</th>
            <th style={thStyle}>No. of Times Used</th>
          </tr>
        </thead>
        <tbody>
          {reflowTableData?.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "15px" }}>No records found.</td>
            </tr>
          ) : (
            reflowTableData.map((row, index) => {
              const bgColor =
                row.no_of_times_used === 6 ? "red" :
                row.no_of_times_used > 3 ? "pink" : "white";

              return (
                <tr key={index} style={{ backgroundColor: bgColor, transition: "background-color 0.3s ease" }}>
                  <td style={tdStyle}>{row.profiler_name}</td>
                  <td style={tdStyle}>{row.customer_name}</td>
                  <td style={tdStyle}>{row.model_name}</td>
                  <td style={tdStyle}>{row.storage_name}</td>
                  <td style={tdStyle}>{row.boardtype_name}</td>
                  <td style={tdStyle}>{row.no_of_times_used}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

// Reusable Dropdown Component
const Dropdown = ({ label, options, value, setValue, propName }) => (
  <div style={{ flex: 1 }}>
    <label>{label}:</label>
    <select value={value} onChange={e => setValue(e.target.value)} style={{ width: "100%", padding: "8px" }}>
      <option value="">-- Select {label} --</option>
      {options.map((item, i) => (
        <option key={i} value={item[propName]}>{item[propName]}</option>
      ))}
    </select>
  </div>
);

// Table styles
const thStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  backgroundColor: "#f2f2f2",
  textAlign: "left"
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "10px"
};

export default ProfilerForm;

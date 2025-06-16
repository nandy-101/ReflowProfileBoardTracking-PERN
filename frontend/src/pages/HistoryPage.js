import { useEffect, useState } from "react";

const HistoryPage = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/users/history");
        const data = await res.json();
        setHistoryData(data);
      } catch (error) {
        console.error("Error fetching history data:", error);
        alert("Failed to fetch history data.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <>
      <header style={{
        display: "flex",
        alignItems: "center",
        padding: "15px 30px",
        backgroundColor: "#f5f5f5",
        borderBottom: "1px solid #ddd"
      }}>
        <button
          onClick={() => window.history.back()}
          style={{
            marginRight: "20px",
            padding: "8px 16px",
            backgroundColor: "#2196F3",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Back
        </button>
        <h1 style={{ margin: 0 }}>History Record of All Entries</h1>
      </header>

      <div style={{ padding: "20px" }}>
        {loading ? (
          <p>Loading history data...</p>
        ) : historyData.length === 0 ? (
          <p>No history records found.</p>
        ) : (
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px"
          }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                {Object.keys(historyData[0]).map((key) => (
                  <th
                    key={key}
                    style={{
                      padding: "10px",
                      border: "1px solid #ccc",
                      textAlign: "left"
                    }}
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historyData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td
                      key={i}
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc"
                      }}
                    >
                      {String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default HistoryPage;

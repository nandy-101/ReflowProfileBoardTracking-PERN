import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleReset = async () => {
    const confirmed = window.confirm("Are you sure you want to delete all records from the Reflow Table and History?");
    if (!confirmed) return;

    try {
      const [reflowRes, historyRes] = await Promise.all([
        fetch("http://localhost:5001/api/users/reflowtable", { method: "DELETE" }),
        fetch("http://localhost:5001/api/users/history", { method: "DELETE" }),
      ]);

      if (reflowRes.ok && historyRes.ok) {
        alert("Reflow Table and History have been reset successfully!");
        window.location.reload();
      } else {
        alert("Something went wrong while resetting one or both tables.");
      }
    } catch (err) {
      console.error("Error resetting tables:", err);
      alert("Something went wrong while resetting the tables.");
    }
  };

  const handleClick = async () => {
    const profiler_name = prompt("Enter Profiler Name:");
    if (!profiler_name) return;

    try {
      const res = await fetch("http://localhost:5001/api/users/profilers");
      const profilers = await res.json();

      const exists = profilers.some(
        (profiler) => profiler.profiler_name.toLowerCase() === profiler_name.toLowerCase()
      );

      if (!exists) {
        await fetch("http://localhost:5001/api/users/profilers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profiler_name }),
        });
        console.log("New profiler added:", profiler_name);
      } else {
        console.log("Profiler already exists:", profiler_name);
      }

      navigate(`/profiler/${profiler_name}`);
    } catch (error) {
      console.error("Error handling profiler:", error);
      alert("Failed to handle profiler. See console for details.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        backgroundColor: "#f1f1f1",
        padding: "15px 20px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "15px",
        boxShadow: "0 -1px 5px rgba(0, 0, 0, 0.1)",
        zIndex: 100,
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px 20px",
          backgroundColor: "#2196F3",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          minWidth: "120px",
        }}
      >
        Back
      </button>

      <button
        onClick={handleReset}
        style={{
          padding: "10px 20px",
          backgroundColor: "#f44336",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          minWidth: "120px",
        }}
      >
        Reset
      </button>

      <button
        onClick={handleClick}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          minWidth: "120px",
        }}
      >
        New Profiler
      </button>
      
    </div>
  );
};

export default Footer;

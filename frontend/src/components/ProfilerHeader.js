import { useNavigate, useParams } from "react-router-dom";

const ProfilerHeader = () => {
  const navigate = useNavigate();
  const { profiler_name } = useParams();

  const handleHistoryClick = () => {
    navigate(`/profiler/${profiler_name}/history`);
  };

  return (
    <header
      style={{
        position: "relative",
        padding: "20px",
        backgroundColor: "#f1f1f1",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        marginBottom: "20px"
      }}
    >
      <button
        onClick={handleHistoryClick}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 15px",
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        See History
      </button>

      <h1 style={{ textAlign: "center", margin: 0 }}>PROFILER DATA ENTRY</h1>
    </header>
  );
};

export default ProfilerHeader;

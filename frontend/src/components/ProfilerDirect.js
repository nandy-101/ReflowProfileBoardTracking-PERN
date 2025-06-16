import { useNavigate } from 'react-router-dom';

const ProfilerDirect = () => {
  const navigate = useNavigate();

  const handleClick = async () => {
    const profiler_name = prompt("Enter Profiler Name:");
    if (!profiler_name) return;

    try {
      // First, check if profiler exists
      const res = await fetch("http://localhost:5001/api/users/profilers");
      const profilers = await res.json();

      const exists = profilers.some(
        (profiler) => profiler.profiler_name.toLowerCase() === profiler_name.toLowerCase()
      );

      if (!exists) {
        // Create new profiler
        await fetch("http://localhost:5001/api/users/profilers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profiler_name }),
        });
        console.log("New profiler added:", profiler_name);
      } else {
        console.log("Profiler already exists:", profiler_name);
      }

      // Navigate to profiler page
      navigate(`/profiler/${profiler_name}`);
    } catch (error) {
      console.error("Error handling profiler:", error);
      alert("Failed to handle profiler. See console for details.");
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px' }}>
      <button
        style={{
          backgroundColor: 'gray',
          color: '#fff',
          padding: '16px 28px',
          fontSize: '18px',
          borderRadius: '12px',
          border: 'none',
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          transition: 'background 0.3s ease',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
        onMouseOut={(e) => (e.target.style.backgroundColor = 'gray')}
        onClick={handleClick}
      >
        PROFILER PAGE
      </button>
    </div>
  );
};

export default ProfilerDirect;

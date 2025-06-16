import { useState } from 'react';
import Header from '../components/Header';
import ProfilerDirect from '../components/ProfilerDirect';


const HomePage = () => {
  const [customers, setCustomers] = useState([]);
  const [models, setModels] = useState([]);
  const [storages, setStorages] = useState([]);
  const [boardTypes, setBoardTypes] = useState([]);
  const [activeSection, setActiveSection] = useState(null);

  // Input state for inserting new records
  const [newCustomer, setNewCustomer] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newStorage, setNewStorage] = useState('');
  const [newBoardType, setNewBoardType] = useState('');

  const fetchData = async (endpoint, setter, section) => {
    try {
      const res = await fetch(`http://localhost:5001/api/users/${endpoint}`);
      const data = await res.json();
      setter(data);
      setActiveSection(section);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
    }
  };

  const insertData = async (endpoint, body, onSuccess) => {
  try {
    const res = await fetch(`http://localhost:5001/api/users/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert(`Inserted into ${endpoint} successfully!`);

      // Auto-refresh the UI
      const nameKey = Object.keys(body)[0];
      const newItem = { [nameKey]: body[nameKey] };

      // Update only if the current section is active
      switch (endpoint) {
        case 'customer':
          if (activeSection === 'customers') setCustomers(prev => [...prev, newItem]);
          break;
        case 'model':
          if (activeSection === 'models') setModels(prev => [...prev, newItem]);
          break;
        case 'storage':
          if (activeSection === 'storages') setStorages(prev => [...prev, newItem]);
          break;
        case 'boardType':
          if (activeSection === 'boardTypes') setBoardTypes(prev => [...prev, newItem]);
          break;
        default:
          break;
      }

      onSuccess(); // Clear input box
    } else {
      const error = await res.json();
      alert(`Error: ${error.message}`);
    }
  } catch (err) {
    console.error(`Error inserting into ${endpoint}:`, err);
  }
};


  return (
    <>
      <Header />

      {/* INSERTION SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', padding: '20px', margin: '20px auto', maxWidth: '600px' }}>
        <div>
          <input
            type="text"
            placeholder="Enter Customer Name"
            value={newCustomer}
            onChange={(e) => setNewCustomer(e.target.value)}
          />
          <button onClick={() => insertData('customer', { customer_name: newCustomer }, () => setNewCustomer(''))}>
            Add Customer
          </button>
        </div>

        <div>
          <input
            type="text"
            placeholder="Enter Model Name"
            value={newModel}
            onChange={(e) => setNewModel(e.target.value)}
          />
          <button onClick={() => insertData('model', { model_name: newModel }, () => setNewModel(''))}>
            Add Model
          </button>
        </div>

        <div>
          <input
            type="text"
            placeholder="Enter Storage Name"
            value={newStorage}
            onChange={(e) => setNewStorage(e.target.value)}
          />
          <button onClick={() => insertData('storage', { storage_name: newStorage }, () => setNewStorage(''))}>
            Add Storage
          </button>
        </div>

        <div>
          <input
            type="text"
            placeholder="Enter BoardType Name"
            value={newBoardType}
            onChange={(e) => setNewBoardType(e.target.value)}
          />
          <button onClick={() => insertData('boardType', { boardtype_name: newBoardType }, () => setNewBoardType(''))}>
            Add BoardType
          </button>
        </div>
      </div>

      {/* VIEW SECTION */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
        <button onClick={() => fetchData('customers', setCustomers, 'customers')}>View Customers</button>
        <button onClick={() => fetchData('models', setModels, 'models')}>View Models</button>
        <button onClick={() => fetchData('storages', setStorages, 'storages')}>View Storages</button>
        <button onClick={() => fetchData('boardTypes', setBoardTypes, 'boardTypes')}>View Board Types</button>
      </div>

      {/* DISPLAY SECTION */}
      <div style={{ marginTop: '30px', padding: '20px' }}>
        {activeSection === 'customers' && (
          <>
            <h3>Customers</h3>
            <ul>{customers.map((c, i) => <li key={i}>{c.customer_name}</li>)}</ul>
          </>
        )}

        {activeSection === 'models' && (
          <>
            <h3>Models</h3>
            <ul>{models.map((m, i) => <li key={i}>{m.model_name}</li>)}</ul>
          </>
        )}

        {activeSection === 'storages' && (
          <>
            <h3>Storages</h3>
            <ul>{storages.map((s, i) => <li key={i}>{s.storage_name}</li>)}</ul>
          </>
        )}

        {activeSection === 'boardTypes' && (
          <>
            <h3>Board Types</h3>
            <ul>{boardTypes.map((b, i) => <li key={i}>{b.boardtype_name}</li>)}</ul>
          </>
        )}
      </div>

        <ProfilerDirect />

    </>
  );
};

export default HomePage;

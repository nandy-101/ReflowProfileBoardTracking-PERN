import { sql } from '../config/db.js';

// Customer Controllers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await sql`SELECT * FROM customers`;
    console.log('Fetched all customers');
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

export const createCustomer = async (req, res) => {
  const { customer_name } = req.body;
  if (!customer_name) {
    return res.status(400).json({ error: 'Customer name is required' });
  }

  try {
    await sql`INSERT INTO customers (customer_name) VALUES (${customer_name})`;
    console.log(`Created new customer: ${customer_name}`);
    res.status(201).json({ message: 'Customer created successfully' });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

// Model Controllers
export const getAllModels = async (req, res) => {
  try {
    // Run the query to fetch all models from the database.
    const models = await sql`SELECT * FROM models`;

    // Log a message to the console indicating that the data was fetched successfully.
    console.log('Fetched all models');

    // Return the list of models in the response.
    res.status(200).json(models);
  } catch (error) {
    // Log an error to the console if there was an error fetching the models.
    console.error('Error fetching models:', error);

    // Return an error response with a 500 status code and a JSON body containing an error message.
    res.status(500).json({ error: 'Failed to fetch models' });
  }
};


export const createModel = async (req, res) => {
  const { model_name } = req.body;
  if (!model_name) {
    return res.status(400).json({ error: 'Model name is required' });
  }

  try {
    await sql`INSERT INTO models (model_name) VALUES (${model_name})`;
    console.log(`Created new model: ${model_name}`);
    res.status(201).json({ message: 'Model created successfully' });
  } catch (error) {
    console.error('Error creating model:', error);
    res.status(500).json({ error: 'Failed to create model' });
  }
};

// Storage Controllers
export const getAllStorages = async (req, res) => {
  try {
    const storages = await sql`SELECT * FROM storages`;
    console.log('Fetched all storages');
    res.status(200).json(storages);
  } catch (error) {
    console.error('Error fetching storages:', error);
    res.status(500).json({ error: 'Failed to fetch storages' });
  }
};

export const createStorage = async (req, res) => {
  const { storage_name } = req.body;
  if (!storage_name) {
    return res.status(400).json({ error: 'Storage name is required' });
  }

  try {
    await sql`INSERT INTO storages (storage_name) VALUES (${storage_name})`;
    console.log(`Created new storage: ${storage_name}`);
    res.status(201).json({ message: 'Storage created successfully' });
  } catch (error) {
    console.error('Error creating storage:', error);
    res.status(500).json({ error: 'Failed to create storage' });
  }
};

// BoardType Controllers
export const getAllBoardTypes = async (req, res) => {
  try {
    const boardTypes = await sql`SELECT * FROM boardTypes`;
    console.log('Fetched all board types');
    res.status(200).json(boardTypes);
  } catch (error) {
    console.error('Error fetching board types:', error);
    res.status(500).json({ error: 'Failed to fetch board types' });
  }
};

export const createBoardType = async (req, res) => {
  const { boardtype_name } = req.body;
  if (!boardtype_name) {
    return res.status(400).json({ error: 'Board type name is required' });
  }

  try {
    await sql`INSERT INTO boardTypes (boardtype_name) VALUES (${boardtype_name})`;
    console.log(`Created new board type: ${boardtype_name}`);
    res.status(201).json({ message: 'Board type created successfully' });
  } catch (error) {
    console.error('Error creating board type:', error);
    res.status(500).json({ error: 'Failed to create board type' });
  }
};

// ReflowTable Controllers
export const getReflowTable = async (req, res) => {
  try {
    const reflowData = await sql`SELECT * FROM reflowtable`;
    console.log('Fetched reflow table data');
    res.status(200).json(reflowData);
  } catch (error) {
    console.error('Error fetching reflow table:', error);
    res.status(500).json({ error: 'Failed to fetch reflow table data' });
  }
};

export const createReflowTable = async (req, res) => {
  const { profiler_name, customer_name, model_name, storage_name, boardtype_name } = req.body;

  if (!profiler_name || !customer_name || !model_name || !storage_name || !boardtype_name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingRecord = await sql`
      SELECT no_of_times_used FROM reflowtable 
      WHERE profiler_name = ${profiler_name}
        AND customer_name = ${customer_name}
        AND model_name = ${model_name}
        AND storage_name = ${storage_name}
        AND boardtype_name = ${boardtype_name}
    `;

    if (existingRecord.length > 0) {
      const currentCount = existingRecord[0].no_of_times_used;

      if (currentCount >= 6) {
        return res.status(400).json({ error: 'Maximum usage count (6) reached' });
      }

      const updatedCount = currentCount + 1;

      await sql`
        UPDATE reflowtable 
        SET no_of_times_used = ${updatedCount}
        WHERE profiler_name = ${profiler_name}
          AND customer_name = ${customer_name}
          AND model_name = ${model_name}
          AND storage_name = ${storage_name}
          AND boardtype_name = ${boardtype_name}
      `;

      // Insert history snapshot
      await sql`
        INSERT INTO history 
          (profiler_name, customer_name, model_name, storage_name, boardtype_name, no_of_times_used) 
        VALUES 
          (${profiler_name}, ${customer_name}, ${model_name}, ${storage_name}, ${boardtype_name}, ${updatedCount})
      `;

      console.log('Incremented and logged to history');
      return res.status(200).json({ message: 'Usage count incremented and history updated' });
    }

    // Fresh insert
    await sql`
      INSERT INTO reflowtable 
        (profiler_name, customer_name, model_name, storage_name, boardtype_name) 
      VALUES 
        (${profiler_name}, ${customer_name}, ${model_name}, ${storage_name}, ${boardtype_name})
    `;

    // Insert initial history snapshot with no_of_times_used = 1
    await sql`
      INSERT INTO history 
        (profiler_name, customer_name, model_name, storage_name, boardtype_name, no_of_times_used) 
      VALUES 
        (${profiler_name}, ${customer_name}, ${model_name}, ${storage_name}, ${boardtype_name}, 1)
    `;

    console.log('Created new reflow and history record');
    res.status(201).json({ message: 'Reflow and history record created successfully' });
  } catch (error) {
    console.error('Error creating or updating reflow table:', error);
    res.status(500).json({ error: 'Failed to process record' });
  }
};

export const clearReflowTable = async (req, res) => {
  try {
    await sql`DELETE FROM reflowtable`;
    console.log('Cleared all records from reflowtable');
    res.status(200).json({ message: 'All records deleted successfully' });
  } catch (error) {
    console.error('Error clearing reflow table:', error);
    res.status(500).json({ error: 'Failed to clear table' });
  }
};

// get history in reverse order( last inserted is first displayed in table)
export const getHistory = async (req, res) => {
  try {
    const history = await sql`SELECT * FROM history ORDER BY created_at DESC`;
    console.log('Fetched all history records');
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
}



export const getAllProfilers = async (req, res) => {
  try {
    const profilers = await sql`SELECT * FROM profilers`;
    console.log('Fetched all profilers');
    res.status(200).json(profilers);
  } catch (error) {
    console.error('Error fetching profilers:', error);
    res.status(500).json({ error: 'Failed to fetch profilers' });
  }
};

export const createProfiler = async (req, res) => {
  const { profiler_name } = req.body;
  if (!profiler_name) {
    return res.status(400).json({ error: 'Profiler name is required' });
  }

  try {
    await sql`INSERT INTO profilers (profiler_name) VALUES (${profiler_name})`;
    console.log(`Created new profiler: ${profiler_name}`);
    res.status(201).json({ message: 'Profiler created successfully' });
  } catch (error) {
    console.error('Error creating profiler:', error);
    res.status(500).json({ error: 'Failed to create profiler' });
  }
};

export const getReflowTableusingProfile = async (req, res) => {
  const { profiler_name } = req.params;

  if (!profiler_name) {
    return res.status(400).json({ error: 'Profiler name is required' });
  }

  try {
    const reflowData = await sql`
      SELECT * FROM reflowtable 
      WHERE profiler_name = ${profiler_name}
    `;
    
    if (reflowData.length === 0) {
      return res.status(404).json({ error: 'No reflow data found for this profiler' });
    }

    console.log(`Fetched reflow table data for profiler: ${profiler_name}`);
    res.status(200).json(reflowData);
  } catch (error) {
    console.error('Error fetching reflow table using profile:', error);
    res.status(500).json({ error: 'Failed to fetch reflow table data' });
  }
}

//clear history table
export const clearHistoryTable = async (req, res) => {
  try {
    await sql`DELETE FROM history`;
    console.log('Cleared all records from history');
    res.status(200).json({ message: 'All records deleted successfully' });
  } catch (error) {
    console.error('Error clearing history table:', error);
    res.status(500).json({ error: 'Failed to clear table' });
  }
};

// Exported all controllers for use in routes
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const HR_API_URL = process.env.HR_API_URL || 'http://localhost:4000/hr/employees';
const PAYROLL_API_URL = process.env.PAYROLL_API_URL || 'http://localhost:4000/payroll/sync';
const HR_TOKEN = process.env.HR_TOKEN || 'dummy-hr-token';
const PAYROLL_TOKEN = process.env.PAYROLL_TOKEN || 'dummy-payroll-token';

// POST /sync route
app.post('/sync', async (req, res) => {
  try {
    console.log('🔄 Sync initiated...');

    // Step 1: Fetch employee data from HR system
    const hrResponse = await axios.get(HR_API_URL, {
      headers: { Authorization: `Bearer ${HR_TOKEN}` }
    });
    const employees = hrResponse.data;
    console.log(`✅ Retrieved ${employees.length} employee records from HR system.`);

    // Step 2: Send data to Payroll system
    const payrollResponse = await axios.post(PAYROLL_API_URL, employees, {
      headers: { Authorization: `Bearer ${PAYROLL_TOKEN}` }
    });

    console.log('✅ Payroll sync response:', payrollResponse.status);
    res.status(200).json({ message: 'Data sync completed successfully.' });

  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    res.status(500).json({ error: 'Data sync failed' });
  }
});

// Start middleware server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 EAI middleware listening on port ${PORT}`);
});

const express = require('express');
const app = express();
const PORT = 4000;

app.use(express.json());

// ✅ HR system endpoint
app.get('/hr/employees', (req, res) => {
  res.json([
    {
      employeeId: "EMP123",
      fullName: "John Doe",
      department: "HR",
      salary: 50000,
      leaveBalance: 5
    },
    {
      employeeId: "EMP124",
      fullName: "Jane Smith",
      department: "Finance",
      salary: 60000,
      leaveBalance: 3
    }
  ]);
});

// ✅ Payroll system endpoint
app.post('/payroll/sync', (req, res) => {
  console.log('📥 Received payroll sync data:', req.body);
  res.status(200).json({ message: "Payroll sync successful" });
});

app.listen(PORT, () => {
  console.log(`✅ Mock HR and Payroll server running on port ${PORT}`);
});


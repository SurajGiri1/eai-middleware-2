%dw 2.0
output application/json
---
{
  month: "2025-06",
  employees: payload map (emp) -> {
    empId: emp.employeeId,
    name: emp.fullName,
    basicPay: emp.baseSalary,
    workDays: emp.attendanceDays,
    leaveDays: emp.leaveDays,
    accountInfo: {
      accNo: emp.bankDetails.accountNumber,
      ifscCode: emp.bankDetails.ifsc
    }
  }
}

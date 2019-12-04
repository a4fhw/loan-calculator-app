
module.exports = {
  riskEvalEnabled: false,
  interestRate: 10,
  quickRiskTimer: 30000,
  highRiskTimer: 60000,
  extensionDays: 7,
  maxLoanAmount: 400,
  format: {
    date: "DD-MM-YYYY",
    dateExtended: "MMMM Do YYYY",
  },
  label: {
    common: {
      refuseLoanTitle: "We're sorry",
      refuseLoanText: "The loan is refused at this time",
      successLoanTitle: "Success",
      successLoanText: "Your loan application has been approved",
    },
    calculator: {
      calcTitle: "Calculator",
      loanAmount: "Enter loan amount (up to 400 EUR)",
      loanAmountLimitError: "Maximum loan allowed amount is 400 €",
      loanAmountNanError: "Please enter only digits",
      datepicker: "Select date (up to 30 days)",
      submit: "Submit",
      clear: "Clear",
    },
    loans: {
      loansTitle: "Existing loans",
      repayableAmount: "Repayable amount",
      loanDayCount: "Loaned for",
      extensionInterest: "Extension period interest rate",
      loanedDays: "Loaned for",
      interest: "Interest rate",
      noActiveLoans: "No active loans at this time",
    }
  }
};

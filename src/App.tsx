import React, { useState } from 'react';
import { Calculator, IndianRupee, Info, AlertTriangle } from 'lucide-react';

function App() {
  const [income, setIncome] = useState<string>('');
  const [isSalaried, setIsSalaried] = useState(false);
  const [tax, setTax] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<Array<{ slab: string; tax: number }>>([]);
  const [showInfo, setShowInfo] = useState(false);

  const calculateTax = (amount: number): { totalTax: number; breakdown: Array<{ slab: string; tax: number }> } => {
    let taxableAmount = amount;
    if (isSalaried) {
      taxableAmount = Math.max(0, taxableAmount - 75000); // Standard deduction for salaried persons
    }

    let tax = 0;
    let remainingIncome = taxableAmount;
    const breakdown = [];

    if (taxableAmount <= 1200000){
      return {totalTax: tax, breakdown:[]}
    }

    // Calculate tax for each slab
    // Above 24 lakhs - 30%
    if (remainingIncome > 2400000) {
      const taxInThisSlab = (remainingIncome - 2400000) * 0.30;
      breakdown.push({
        slab: "Above ₹24,00,000 (30%)",
        tax: taxInThisSlab
      });
      tax += taxInThisSlab;
      remainingIncome = 2400000;
    }

    // 20-24 lakhs - 25%
    if (remainingIncome > 2000000) {
      const taxInThisSlab = (remainingIncome - 2000000) * 0.25;
      breakdown.push({
        slab: "₹20,00,000 - ₹24,00,000 (25%)",
        tax: taxInThisSlab
      });
      tax += taxInThisSlab;
      remainingIncome = 2000000;
    }

    // 16-20 lakhs - 20%
    if (remainingIncome > 1600000) {
      const taxInThisSlab = (remainingIncome - 1600000) * 0.20;
      breakdown.push({
        slab: "₹16,00,000 - ₹20,00,000 (20%)",
        tax: taxInThisSlab
      });
      tax += taxInThisSlab;
      remainingIncome = 1600000;
    }

    // 12-16 lakhs - 15%
    if (remainingIncome > 1200000) {
      const taxInThisSlab = (remainingIncome - 1200000) * 0.15;
      breakdown.push({
        slab: "₹12,00,000 - ₹16,00,000 (15%)",
        tax: taxInThisSlab
      });
      tax += taxInThisSlab;
      remainingIncome = 1200000;
    }

    // 8-12 lakhs - 10%
    if (remainingIncome > 800000) {
      const taxInThisSlab = (remainingIncome - 800000) * 0.10;
      breakdown.push({
        slab: "₹8,00,000 - ₹12,00,000 (10%)",
        tax: taxInThisSlab
      });
      tax += taxInThisSlab;
      remainingIncome = 800000;
    }

    // 4-8 lakhs - 5%
    if (remainingIncome > 400000) {
      const taxInThisSlab = (remainingIncome - 400000) * 0.05;
      breakdown.push({
        slab: "₹4,00,000 - ₹8,00,000 (5%)",
        tax: taxInThisSlab
      });
      tax += taxInThisSlab;
      remainingIncome = 400000;
    }

    // 0-4 lakhs - 0%
    breakdown.push({
      slab: "₹0 - ₹4,00,000 (0%)",
      tax: 0
    });

    return { totalTax: tax, breakdown: breakdown.reverse() };
  };

  const handleCalculate = () => {
    const amount = parseFloat(income);
    if (!isNaN(amount)) {
      const result = calculateTax(amount);
      setTax(result.totalTax);
      setBreakdown(result.breakdown);
    }
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncome(e.target.value);
    setTax(null);
    setBreakdown([]);
  };

  const handleSalariedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSalaried(e.target.checked);
    setTax(null);
    setBreakdown([]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Disclaimer */}
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <p className="ml-3 text-sm text-yellow-700">
                <strong className="font-medium">Disclaimer:</strong> This calculator provides estimates only and should not be used for official tax filing purposes. Tax calculations can be complex and may vary based on individual circumstances, deductions, and exemptions. Please consult a tax professional or refer to the official Income Tax Department website for accurate tax assessment.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">Indian Income Tax Calculator 2025</h1>
          </div>

          <div className="mb-8">
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IndianRupee className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                value={income}
                onChange={handleIncomeChange}
                placeholder="Enter your annual income"
                className="block w-full pl-10 pr-4 py-3 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="salaried"
                checked={isSalaried}
                onChange={handleSalariedChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="salaried" className="ml-2 block text-sm text-gray-700">
                I am a salaried person (Eligible for ₹75,000 standard deduction)
              </label>
            </div>

            <button
              onClick={handleCalculate}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              Calculate Tax
            </button>
          </div>

          {tax !== null && (
            <div className="bg-indigo-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Tax Calculation Result</h2>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Gross Income: {formatCurrency(parseFloat(income))}</p>
                {isSalaried && (
                  <p className="text-sm text-gray-600">
                    Standard Deduction: {formatCurrency(75000)}
                    <br />
                    Taxable Income: {formatCurrency(Math.max(0, parseFloat(income) - 75000))}
                  </p>
                )}
              </div>
              <p className="text-3xl font-bold text-indigo-600 mb-4">{formatCurrency(tax)}</p>
              <p className="text-sm text-gray-600 mb-4">
                Effective Tax Rate: {((tax / parseFloat(income)) * 100).toFixed(2)}%
              </p>

              {breakdown.length > 0 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-2">Tax Breakdown</h3>
                  <div className="space-y-2">
                    {breakdown.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.slab}</span>
                        <span className="font-medium">{formatCurrency(item.tax)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="relative">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center gap-2 text-gray-600 hover:text-indigo-600"
            >
              <Info className="w-5 h-5" />
              <span>Tax Slab Information</span>
            </button>

            {showInfo && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Tax Slabs for FY 2024-25</h3>
                <ul className="space-y-2 text-sm">
                  <li>₹0 - ₹4,00,000: Nil</li>
                  <li>₹4,00,000 - ₹8,00,000: 5%</li>
                  <li>₹8,00,000 - ₹12,00,000: 10%</li>
                  <li>₹12,00,000 - ₹16,00,000: 15%</li>
                  <li>₹16,00,000 - ₹20,00,000: 20%</li>
                  <li>₹20,00,000 - ₹24,00,000: 25%</li>
                  <li>Above ₹24,00,000: 30%</li>
                </ul>
                <p className="mt-2 text-sm text-gray-600">
                  Note: This is a simplified representation of tax slabs. Actual tax calculation may vary based on various factors and deductions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
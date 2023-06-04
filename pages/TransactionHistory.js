import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { donationDapp } from "../config";
import DonationDapp from "../artifacts/contracts/DonationDapp.sol/DonationDapp.json";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  async function fetchTransactionHistory() {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(
      donationDapp,
      DonationDapp.abi,
      provider
    );

    // Fetch the contract events
    const filter = contract.filters.FundsDonated();

    // Get the past events
    const events = await contract.queryFilter(filter);

    // Process the events and extract the relevant transaction details
    const processedTransactions = events.map((event) => {
      const { from, to, amount } = event.args;
      return {
        from: from.toLowerCase(),
        to: to.toLowerCase(),
        amount: ethers.utils.formatEther(amount),
      };
    });

    setTransactions(processedTransactions);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              From
            </th>
            <th className="px-3 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              To
            </th>
            <th className="px-3 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                {transaction.from}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{transaction.to}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {transaction.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;

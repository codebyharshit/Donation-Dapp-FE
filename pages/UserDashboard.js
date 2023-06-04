import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import styles from "../styles/Home.module.css";

import { donationDapp } from "../config";

import DonationDapp from "../artifacts/contracts/DonationDapp.sol/DonationDapp.json";

export default function UserDashboard() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  async function fetchTransactionHistory() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const connectedAddress = await signer.getAddress();

    const contract = new ethers.Contract(
      donationDapp,
      DonationDapp.abi,
      signer
    );

    // Fetch the contract events
    const filter = contract.filters.FundsDonated(connectedAddress, null);

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
      {transactions ? (
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-4">Donation Details</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {/* <th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From
              </th> */}
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
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.from}
                </td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.to}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transaction.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="container mx-auto">
          You have not donated to anyone yet
        </div>
      )}
    </div>
  );
}

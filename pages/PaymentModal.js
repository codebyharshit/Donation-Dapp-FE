import React, { useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { donationDapp } from "../config";
import DonationDapp from "../artifacts/contracts/DonationDapp.sol/DonationDapp.json";

const PaymentModal = (props) => {
  const [amount, setAmount] = useState();

  const { selectedAddress } = props;
  console.log("selectedAddress", selectedAddress.toLowerCase());
  const creator = selectedAddress.toLowerCase();

  const donateToCreator = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const donation = ethers.utils.parseEther(amount);

    let contract = new ethers.Contract(donationDapp, DonationDapp.abi, signer);
    let transaction = await contract.donateToCreator(creator, {
      value: donation,
    });
    let tx = await transaction.wait();
    console.log("tx", tx);
  };

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <label className="mt-8 rounded p-4 text-black-700 font-bold">
          Creator Address
        </label>
        <input value={selectedAddress} className="mt-2 border rounded p-4" />
        <label className="mt-2 rounded p-4 text-black-700 font-bold">
          Donation Amount
        </label>
        <input
          placeholder="Enter Amount"
          className="mt-4 border rounded p-4"
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          onClick={donateToCreator}
          className="font-bold mt-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white rounded p-4 shadow-lg"
        >
          Donate To Creator
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;

import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import axios from "axios";

import { donationDapp } from "../config";

import DonationDapp from "../artifacts/contracts/DonationDapp.sol/DonationDapp.json";

export default function Creator() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    name: "",
    address: "",
    fees: "",
    file: "",
  });

  const router = useRouter();

  async function addCreator() {
    const { name, address, fees, file } = formInput;
    if (!name || !address || !fees || !file) return;

    console.log("fileUrl", fileUrl);

    const data = {
      name,
      address,
      file,
    };

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const fee = ethers.utils.parseEther(fees);
    console.log("fee", fee);

    let contract = new ethers.Contract(donationDapp, DonationDapp.abi, signer);
    let transaction = await contract.becomeCreator({
      value: fee,
    });
    let tx = await transaction.wait();
    console.log("tx", tx);

    if (tx.status === 1) {
      const response = await axios.post(
        "http://localhost:3000/addCreator",
        data
      );
      console.log("response", response);
    }

    router.push("/");
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Creator Name"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />

        <input
          placeholder="Creator Address"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, address: e.target.value })
          }
        />

        <input
          placeholder="Fees in ETH"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, fees: e.target.value })
          }
        />

        <input
          placeholder="File Url"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, file: e.target.value })
          }
        />

        {formInput.file && (
          <img className="rounded mt-4" width="350" src={formInput.file} />
        )}
        <button
          onClick={addCreator}
          className="font-bold mt-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white rounded p-4 shadow-lg"
        >
          Add Creator
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import axios from "axios";

export default function UpdateCreator() {
  const [formInput, updateFormInput] = useState({
    name: "",
    file: "",
  });

  const router = useRouter();

  async function updateCreator() {
    try {
      const { name, file } = formInput;
      if (!name || !file) return;

      const data = {
        name,
        file,
      };

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const connectedAddress = await signer.getAddress();
      console.log("connectedAddress", connectedAddress);

      const response = await axios.put(
        `http://localhost:3000/updateCreator?address=${connectedAddress}`,
        data
      );
      console.log("response", response);
      router.push("/");

    } catch (error) {
      console.log(error);
    }
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
          placeholder="File Url"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, file: e.target.value })
          }
        />

        <button
          onClick={updateCreator}
          className="font-bold mt-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white rounded p-4 shadow-lg"
        >
          Update Creator
        </button>
      </div>
    </div>
  );
}

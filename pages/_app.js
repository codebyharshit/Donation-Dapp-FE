import "../styles/globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { donationDapp } from "../config";
import DonationDapp from "../artifacts/contracts/DonationDapp.sol/DonationDapp.json";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";

function Donation({ Component, session, pageProps }) {
  const [isCreator, setCreator] = useState();
  const router = useRouter();

  useEffect(() => {
    fetchCreator();
  }, []);

  async function fetchCreator() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const connectedAddress = await signer.getAddress();

    let contract = new ethers.Contract(donationDapp, DonationDapp.abi, signer);

    const data = await contract.isCreator(connectedAddress);
    console.log("isCreator", data);
    setCreator(data);
  }


  return (
    <SessionProvider session={session}>
      <div className="border-b p-6 bg-gradient-to-b from-purple-600 to-blue-600">
        <nav className="border-b p-6 ">
          <p className="text-4xl font-bold flex justify-center text-cyan-200">
            Donation Dapp for Content Creators
          </p>
          <div className="flex justify-center p-8">
            {isCreator ? (
              <div>
                <Link href="/" className="mr-4 text-xl text-cyan-200">
                  Home
                </Link>
                <Link
                  href="/UserDashboard"
                  className="mr-6 text-xl text-cyan-200"
                >
                  User Dashboard
                </Link>
                <Link
                  href="/CreatorDashboard"
                  className="mr-6 text-xl text-cyan-200"
                >
                  Creator Dashboard
                </Link>
                <Link
                  href="/UpdateCreator"
                  className="mr-6 text-xl text-cyan-200"
                >
                  Update Creator
                </Link>
              </div>
            ) : (
              <div>
                <Link href="/" className="mr-4 text-xl text-cyan-200">
                  Home
                </Link>
                <Link href="/AddCreator" className="mr-6 text-xl text-cyan-200">
                  Become Creator
                </Link>
                <Link
                  href="/UserDashboard"
                  className="mr-6 text-xl text-cyan-200"
                >
                  User Dashboard
                </Link>
              </div>
            )}
          </div>
        </nav>

        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}

export default Donation;

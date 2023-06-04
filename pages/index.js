// // import { ethers } from "ethers";
// // import { useEffect, useState } from "react";
// // import axios, { HttpStatusCode } from "axios";
// // import Web3Modal from "web3modal";
// // import { nftaddress, nftmarketaddress } from "../config";

// // //const ipfsClient = require('ipfs-http-client');

// // import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
// // import NFTMarket from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

// export default function Home() {
//     console.log("Creator");
//   // const [nfts,setNFts]=useState([])
//   // const [loadingState,setLoadingState]=useState('not-loaded')

//   // useEffect(()=>{
//   //     loadNFTs()
//   // },[])

//   // async function loadNFTs(){
//   //     const provider= new ethers.providers.JsonRpcProvider()
//   //     const nftContract=new ethers.Contract(nftaddress,NFT.abi,provider)
//   //     const nftMarketContract=new ethers.Contract(nftmarketaddress,NFTMarket.abi,provider)
//   //     const data =await nftMarketContract.fetchMarketItems()

//   //     const items=await Promise.all(data.map(async i=>{
//   //         const tokenUri=await nftContract.tokenURI(i.tokenId)
//   //         const meta=await axios.get(tokenUri)
//   //         let price=ethers.utils.formatUnits(i.price.toString(),'ether')
//   //         let item={
//   //             price,
//   //             tokenId:i.tokenId.toNumber(),
//   //             seller:i.seller,
//   //             owner:i.owner,
//   //             image: meta.data.image,
//   //             name: meta.data.name,
//   //             description: meta.data.description
//   //         }
//   //         console.log(meta)
//   //         return item

//   //     }))
//   //     setNFts(items)
//   //     setLoadingState('loaded')
//   // }

//   // async function buyNFT(nft){
//   //     const web3Modal=new Web3Modal()
//   //     const connection =await web3Modal.connect()
//   //     const provider=new ethers.providers.Web3Provider(connection)

//   //     const signer=provider.getSigner()
//   //     const contract=new ethers.Contract(nftmarketaddress,NFTMarket.abi,signer)
//   //     const price=ethers.utils.parseUnits(nft.price.toString(),'ether')
//   //     const transaction=await contract.createMarketSale(nftaddress,nft.tokenId,{
//   //         value:price
//   //     })
//   //     await transaction.wait()
//   //     loadNFTs()
//   // }

//   // if(loadingState==="loaded" && !nfts.length)
//   // return(
//   //     <div>
//   //         <p className="px-10 py-10 text-2xl font-bold flex justify-center text-cyan-200">
//   //             There are currently no NFTs in the Marketplace.<br/> Please come back later
//   //         </p>
//   //     </div>
//   // )

//   return (
//     <div className="flex justify-center">
//       <div className="container mx-auto">
//         {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-5">
//                   {
//                     nfts.map((nft,i)=>(
//                         <div key={i} className="border shadow rounded-3xl overflow-hidden">
//                             <img src={nft.image}/>
//                             <div className="p-4">
//                                 <p style={{height:'64px'}} className="text-2xl font-semibold">{nft.name}</p>
//                                 <div style={{height:'70px', overflow:"hidden"}}>
//                                     <p className="text-gray-400">{nft.description}</p>
//                                 </div>
//                             </div>

//                             <div className='p-4 bg-blue'>
//                                 <p className='text-2xl mb-4 font-bold text-white'>{nft.price} ETH</p>
//                                 <button className="w-full bg-purple-600 text-white font-bold py-2 px-12 rounded"
//                                 onClick={()=>buyNFT(nft)}>Buy</button>
//                             </div>
//                         </div>
//                     ))
//                   }
//                 </div> */}

//         <h1>Home</h1>
//       </div>
//     </div>
//   );
// }

import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import styles from "../styles/Home.module.css";

import { donationDapp } from "../config";

import DonationDapp from "../artifacts/contracts/DonationDapp.sol/DonationDapp.json";
import PaymentModal from "./PaymentModal";
// import NFT from "../artifacts/contracts/NFT.sol/NFT.json";

export default function Home() {
  const [creators, setCreators] = useState([]);
  const [paymentModal, setPaymentModal] = useState();
  const [selectedAddress, setSelectedAddress] = useState();
  // const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadCreators();
  }, []);

  async function loadCreators() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const Address = await signer.getAddress();

    let contract = new ethers.Contract(donationDapp, DonationDapp.abi, signer);

    const data = await contract.getCreators();

    // let tx = await getCreators.wait();
    console.log("getCreators", data);
    // }

    const items = await Promise.all(
      data.map(async (i, j) => {
        let userAddress = data[j];
        const response = await axios.get(
          `http://localhost:3000/getCreator?address=${userAddress}`
        );
        const userData = await response.data;
        const result = await userData.result;
        // let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          name: result.name,
          address: result.address,
          file: result.file,
        };
        return item;
      })
    );
    setCreators(items);
  }

  const payCreator = async (e) => {
    console.log("e.target.value", e.target.value);
    setSelectedAddress(e.target.value);
    setPaymentModal(true);
  };

  return (
    <div>
      {paymentModal && <PaymentModal selectedAddress={selectedAddress} />}
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-6 gap-6 pt-5">
          {creators.map((creator, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={creator.file} className={styles["nft-image"]} />
              <div className="p-4 bg-black">
                <p className="text-2xl font-bold text-white">
                  Name -{creator.name}
                </p>
                <p className="text-2xl font-bold text-white">
                  Address -
                  {`${creator.address.substring(
                    0,
                    6
                  )}....${creator.address.substring(
                    creator.address.length - 4,
                    creator.address.length
                  )}`}
                </p>
                <button
                  onClick={payCreator}
                  value={creator.address}
                  className="font-bold w-64  mt-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white rounded p-4 shadow-lg"
                >
                  Pay Creator
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

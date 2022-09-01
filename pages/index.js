import { ethers } from "ethers";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [eth, setEth] = useState("1");
  const [quote, setQuote] = useState();
  const [usdt, setUsdt] = useState("");
  const [signer, setSigner] = useState();

  useEffect(() => {
    connectToMetamask();
    getQuote();
  }, [eth]);

  const getQuote = async () => {
    try {
      const request = await fetch(
        `https://api.0x.org/swap/v1/quote?sellToken=ETH&buyToken=USDT&sellAmount=${ethers.utils.parseEther(
          eth
        )}`
      );
      const data = await request.json();
      if (!request.ok) {
        console.error(data);
        return setUsdt(0);
      }
      setUsdt(data.buyAmount / 1e6);
      setQuote(data);
    } catch (err) {
      console.error(err);
      alert("Error getting a quote!");
    }
  };

  const connectToMetamask = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setSigner(signer);
      console.log("Account:", await signer.getAddress());
    } catch (err) {
      console.error(err);
    }
  };

  const purchaseUsdt = async () => {
    try {
      const txn = await signer.sendTransaction({
        from: quote.from,
        to: quote.to,
        data: quote.data,
        value: ethers.utils.parseEther(eth),
      });

      await txn.wait();

      alert("Purchased USDT successfully!");
    } catch (err) {
      console.error(err);
      alert("Error purchasing USDT!");
    }
  };

  return (
  <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <h1>Purchase USDT</h1>
        <input
          type="number"
          value={eth}
          onChange={(e) => setEth(e.target.value)}
          placeholder="ETH"
        />
        <input type="number" value={usdt} disabled placeholder="USDT" />
        <button onClick={purchaseUsdt}>Purchase USDT</button>
      </div>
    </div>
  )
}

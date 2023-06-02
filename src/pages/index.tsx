import Script from "next/script";
import Head from 'next/head'
import Interface from "../components/interface";

export default function Home() {
  return (
    <div>
      <Head>
        <title>PolyMix</title>
      </Head>
      <Script src="/snarkjs.js" />
      <Interface />
    </div>
  )
}

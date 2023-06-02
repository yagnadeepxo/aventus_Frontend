import { useEffect, useState } from "react";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import Navbar from "./ui/Navbar";
import { Account } from "@/types/types";

const Interface = () => {
    const [tab, setTab] = useState<string>('deposit')
    const [account, updateAccount] = useState<Account>();

    const connectMetamask = async () => {
        try {
            if (!(window as any).ethereum) {
                alert("Please install Metamask to use this app.");
                throw "no-metamask";
            }

            let accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
            let chainId = (window as any).ethereum.networkVersion;

            if (chainId != "80001") {
                alert("Please switch to Mumbai Testnet");
                throw "wrong-chain";
            }

            let activeAccount = accounts[0];
            let newAccountState = {
                chainId: chainId,
                address: activeAccount,
            };
            updateAccount(newAccountState);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div>
            <Navbar connectMetamask={connectMetamask} account={account} />
            <div className="flex flex-col mt-32 items-center justify-center">
                <div className="flex space-x-28">
                    <p
                        onClick={() => setTab("deposit")}
                        className={tab === "deposit" ? "bg-[#ef87ff] text-black font-semibold py-3 px-14 mr-1 text-lg cursor-pointer" :
                            "bg-[#783882] border border-[#793484] text-[#ef87ff] font-semibold py-3 px-14 mr-1 text-lg cursor-pointer"}>
                        Deposit
                    </p>
                    <p
                        onClick={() => setTab("withdraw")}
                        className={tab === "deposit" ? "pr-12 bg-[#783882] border border-[#793484] text-[#ef87ff] font-semibold py-3 px-14 text-lg cursor-pointer" :
                            "pr-12 bg-[#ef87ff] text-black font-semibold py-3 px-14 text-lg cursor-pointer"}>
                        Withdraw
                    </p>
                </div>
                <div className="pb-6 border-2 w-[30rem] rounded-b-xl border-[#ef87ff] px-6 pt-4">
                    {tab === "deposit" ? <Deposit account={account} /> : <Withdraw account={account} />}
                </div>
            </div>
        </div>
    )
}

export default Interface;
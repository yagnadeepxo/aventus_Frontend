import { Account } from "@/types/types.js";
import { tornadoAddress, tornadoInterface } from "@/utils/contracts";
import utils from "@/utils/utils";
import { ethers } from "ethers";
import React, { useState } from "react";
import wc from "../circuit/witness_calculator.js";
import Spinner from "./ui/Spinner";

interface IDepositProps {
    account: Account;
}

const Deposit: React.FunctionComponent<IDepositProps> = ({ account }) => {
    const [proofElements, updateProofElements] = useState("");
    const [error, setError] = useState({ message: null });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [ETHAmount, setETHAmount] = useState<number>(0.1);

    const depositEther = async () => {
        if (!canDeposit) return;

        //updateDepositButtonState(ButtonState.Disabled);
        setIsLoading(true);

        const secret = ethers.BigNumber.from(
            ethers.utils.randomBytes(32)
        ).toString();
        const nullifier = ethers.BigNumber.from(
            ethers.utils.randomBytes(32)
        ).toString();

        const input = {
            secret: utils.BN256ToBin(secret).split(""),
            nullifier: utils.BN256ToBin(nullifier).split(""),
        };

        var res = await fetch("/deposit.wasm");
        var buffer = await res.arrayBuffer();
        var depositwc = await wc(buffer);
        const r = await depositwc.calculateWitness(input, 0);

        const commitment = r[1];
        const bigNumber = ethers.BigNumber.from(commitment);
        const uint256Value = ethers.utils.hexZeroPad(
            bigNumber.toHexString(),
            32
        );
        const nullifierHash = r[2];
        const value = ethers.utils.parseEther(ETHAmount.toString());
        try {
            if (account) {
                const tx = {
                    to: tornadoAddress,
                    from: account.address,
                    value: value._hex,
                    data: tornadoInterface.encodeFunctionData("deposit", [
                        uint256Value,
                    ]),
                };

                const txHash = await (window as any).ethereum.request({
                    method: "eth_sendTransaction",
                    params: [tx],
                });
                const proofElements = {
                    nullifierHash: `${nullifierHash}`,
                    secret: secret,
                    nullifier: nullifier,
                    commitment: `${commitment}`,
                    txHash: txHash,
                };

                const btoa = (
                    text:
                        | WithImplicitCoercion<string>
                        | { [Symbol.toPrimitive](hint: "string"): string }
                ) => Buffer.from(text, "binary").toString("base64");
                updateProofElements(btoa(JSON.stringify(proofElements)));

                setIsLoading(false);
            }
        } catch (e) {
            console.log(e);
            setIsLoading(false);
        }
    };

    let canDeposit = !!account;

    const [isCopied, setIsCopied] = useState(false);

    async function copyTextToClipboard(text: string) {
        if ("clipboard" in navigator) {
            return await navigator.clipboard.writeText(text);
        } else {
            return document.execCommand("copy", true, text);
        }
    }

    // onClick handler function for the copy button
    const handleCopyClick = (text: string) => {
        // Asynchronously call copyTextToClipboard
        copyTextToClipboard(text)
            .then(() => {
                // If successful, update the isCopied state value
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 1500);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <p className="text-lg py-3">Token</p>
            <input
                value={"ETH"}
                onChange={() => console.log()}
                className="w-full inline-flex items-start justify-start py-2 pl-4 bg-white bg-opacity-0 shadow-inner border rounded border-gray-700"
            />

            <div className="flex mt-6 ml-40">
                <div className="inline-flex flex-col space-y-4 items-center justify-start w-1/4 h-full pr-8 pb-1  relative">
                    <input
                        type="radio"
                        name="ethAmount"
                        onChange={(e) => setETHAmount(0.1)}
                        value={0.1}
                        checked
                        className="w-4 h-4 rounded focus:ring-gray-700 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500"
                    />

                    <p className="text-md font-bold text-center text-gray-100">
                        0.1 ETH
                    </p>
                </div>
                <div className="inline-flex flex-col space-y-4 items-center justify-start w-1/4 h-full pr-7 pb-1 relative ">
                    <input
                        type="radio"
                        name="ethAmount"
                        onChange={(e) => setETHAmount(1)}
                        value={1}
                        className="w-4 h-4 rounded focus:ring-gray-700 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500"
                    />
                    <div className="w-[22rem] h-0.5 bg-white absolute mr-20 -top-2 -z-10" />
                    <p className="text-md font-bold text-center text-gray-100">
                        1 ETH
                    </p>
                </div>
            </div>

            {proofElements && (
                <>
                    <p className="truncate mt-6">
                        <span className="text-md font-semibold">Secret: </span>
                        <span
                            className="text-md text-gray-300 cursor-copy"
                            onClick={() => handleCopyClick(proofElements)}
                        >
                            {proofElements}
                        </span>
                    </p>
                    {isCopied && (
                        <p className="text-center text-sm pt-2">Copied!</p>
                    )}
                </>
            )}

            <button
                onClick={depositEther}
                className={
                    canDeposit
                        ? "inline-flex justify-center pt-2 pb-2.5 bg-[#ef87ff] rounded mt-8 w-full cursor-pointer"
                        : "inline-flex justify-center pt-2 pb-2.5 bg-gray-400 rounded mt-8 w-full cursor-not-allowed"
                }
            >
                <p className="text-sm font-bold leading-tight text-center text-black">
                    {isLoading ? <Spinner /> : "Deposit"}
                </p>
            </button>
        </>
    );
};

export default Deposit;

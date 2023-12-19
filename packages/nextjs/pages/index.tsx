import React, { useState } from "react";
import { useDebouncer } from "../hooks/impersonator/useDebouncer";
import { defaultAppUrl, possibleNetworks } from "./config";
import { ImpersonatorIframe, useImpersonatorIframe } from "@impersonator/iframe";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { AddressInput, InputBase } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  // i think eventually we want   const [impersonateAddress, setImpersonateAddress] = useLocalStorage<string>("impersonateAddress", "");
  const [impersonateAddress, setImpersonateAddress] = React.useState<string>("");

  const { latestTransaction } = useImpersonatorIframe();
  const [appUrl, setAppUrl] = useState(defaultAppUrl);
  const { isTyping, setIsTyping } = useDebouncer(impersonateAddress);
  const [selectedNetwork, setSelectedNetwork] = useState(possibleNetworks[0]);

  const handleAppUrlChange = (newValue: string) => {
    setAppUrl(newValue);
  };

  const handleAddressChange = (newValue: string) => {
    setIsTyping(true);
    setImpersonateAddress(newValue);
  };

  return (
    <>
      <MetaHeader />
      <div className="flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold">impersonate</h1>

        <AddressInput value={impersonateAddress} onChange={handleAddressChange} placeholder="vitalik.eth" />
        <h1 className="text-2xl font-bold">at</h1>
        <div className="w-[400px]">
          <InputBase placeholder="https://app.uniswap.org/swap" value={appUrl} onChange={handleAppUrlChange} />
        </div>
        <h1 className="text-2xl font-bold">on</h1>
        <div className="w-[200px]">
          <select
            className="select select-bordered w-full max-w-xs "
            onChange={e => {
              setSelectedNetwork(possibleNetworks[e.target.selectedIndex]);
            }}
          >
            {possibleNetworks.map(network => {
              return (
                <option key={network.name} value={network.rpcUrl}>
                  {network.name}
                </option>
              );
            })}
          </select>{" "}
        </div>
      </div>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className={"border-2 border-gray-200 rounded-md p-4"}>
          {!isTyping && selectedNetwork.rpcUrl && impersonateAddress && appUrl ? (
            <ImpersonatorIframe
              key={selectedNetwork.rpcUrl + impersonateAddress + appUrl}
              width={"1400px"} //set it to the browser width
              height={"1200px"}
              src={appUrl}
              address={impersonateAddress}
              rpcUrl={selectedNetwork.rpcUrl}
            />
          ) : (
            <div></div>
          )}
        </div>
        <div className="p-4">
          {latestTransaction ? (
            <>
              <h1>Latest transaction:</h1>
              <pre>{JSON.stringify(latestTransaction, null, 2)}</pre>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default Home;

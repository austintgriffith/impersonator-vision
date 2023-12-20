import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { ImpersonatorIframe, useImpersonatorIframe } from "@impersonator/iframe";
import type { NextPage } from "next";
import { useDebounce } from "usehooks-ts";
import { MetaHeader } from "~~/components/MetaHeader";
import { AddressInput, InputBase } from "~~/components/scaffold-eth";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

// const possibleNetworks = [
//   { name: "mainnet", rpcUrl: "https://cloudflare-eth.com" },
//   { name: "optimism", rpcUrl: " https://mainnet.optimism.io" },
// ];

const Home: NextPage = () => {
  const router = useRouter();
  const { address, networkName, url } = router.query;
  const { latestTransaction } = useImpersonatorIframe();
  const targetNetworks = getTargetNetworks();
  // i think eventually we want   const [impersonateAddress, setImpersonateAddress] = useLocalStorage<string>("impersonateAddress", "");
  const [impersonateAddress, setImpersonateAddress] = React.useState<string>(address as string);

  //const prevSelectedNetwork = possibleNetworks.find(network => network.name === networkName);
  const [selectedNetwork, setSelectedNetwork] = React.useState<any>();
  //prevSelectedNetwork ? prevSelectedNetwork : undefined,
  const [appUrl, setAppUrl] = React.useState<string>(
    // "https://app.uniswap.org/swap?chain=mainnet&inputAmount=1&outputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&inputCurrency=0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "",
  );

  const debounceImpersonateAddress = useDebounce(impersonateAddress, 1000);
  const debounceSelectedNetworkName = useDebounce(selectedNetwork, 500);
  const debounceAppUrl = useDebounce(appUrl, 500);

  const handleAppUrlChange = (newValue: string) => {
    setAppUrl(newValue);
  };

  const handleAddressChange = (newValue: string) => {
    setImpersonateAddress(newValue);
  };

  // capture address,network and app url on debounce
  useEffect(() => {
    if (Boolean(debounceImpersonateAddress)) {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          address: debounceImpersonateAddress,
          networkName: selectedNetwork ? selectedNetwork : "https://cloudflare-eth.com",
        },
      });
    }
  }, [debounceImpersonateAddress]);

  useEffect(() => {
    if (Boolean(debounceAppUrl)) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, url: appUrl },
      });
    }
  }, [debounceAppUrl]);

  useEffect(() => {
    if (Boolean(debounceSelectedNetworkName)) {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, networkName: selectedNetwork ? selectedNetwork : "https://cloudflare-eth.com" },
      });
    }
  }, [debounceSelectedNetworkName]);

  // set default values on new page reload
  useEffect(() => {
    if (address !== undefined) {
      setImpersonateAddress(address as string);
    }
    if (networkName !== undefined) {
      setSelectedNetwork(networkName);
    }
    if (url !== undefined) {
      setAppUrl(url as string);
    }
  }, [address, networkName, url]);

  return (
    <>
      <MetaHeader />
      <div className="flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold">impersonate</h1>
        <AddressInput value={impersonateAddress} placeholder="vitalik.eth" onChange={handleAddressChange} />
        <h1 className="text-2xl font-bold">at</h1>
        <div className="w-[400px]">
          <InputBase placeholder="https://app.uniswap.org/swap" value={appUrl} onChange={handleAppUrlChange} />
        </div>
        <h1 className="text-2xl font-bold">on</h1>
        <div className="w-[200px]">
          <select
            key={selectedNetwork}
            className="select select-bordered w-full max-w-xs "
            defaultValue={selectedNetwork ? selectedNetwork : ""}
            value={selectedNetwork}
            onChange={e => {
              setSelectedNetwork(targetNetworks[e.target.selectedIndex].rpcUrls.default.http[0]);
            }}
          >
            {targetNetworks.map((network: any) => {
              return (
                <option key={network.name} value={network.rpcUrls.default.http[0]}>
                  {network.name}
                </option>
              );
            })}
          </select>{" "}
        </div>
      </div>
      <div className="flex items-center flex-col flex-grow p-4 rounded-md">
        <div
          className={`${Boolean(debounceImpersonateAddress) && "border-2 border-gray-200"} rounded-md  w-full h-full`}
        >
          {debounceImpersonateAddress && (
            <div>
              {selectedNetwork && debounceImpersonateAddress && appUrl ? (
                <div className="w-full rounded-md p-1">
                  <ImpersonatorIframe
                    key={selectedNetwork + debounceImpersonateAddress + appUrl}
                    height={"1200px"}
                    width={"100%"} //set it to the browser width
                    src={appUrl}
                    address={debounceImpersonateAddress}
                    rpcUrl={selectedNetwork}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        </div>

        <div className="p-4">
          {latestTransaction ? (
            <>
              <h1 className="text-xl font-bold mb-2">Latest transaction:</h1>
              <div className="p-2 bg-gray-800 text-white rounded-md overflow-auto">
                <pre className="font-mono text-sm">
                  <code>{JSON.stringify(latestTransaction, null, 2)}</code>
                </pre>
              </div>
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

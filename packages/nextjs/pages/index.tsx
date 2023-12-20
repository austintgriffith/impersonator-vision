import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ImpersonatorIframe, useImpersonatorIframe } from "@impersonator/iframe";
import type { NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import { useDebounce } from "usehooks-ts";
import { isAddress } from "viem";
import { MetaHeader } from "~~/components/MetaHeader";
import { AddressInput, InputBase } from "~~/components/scaffold-eth";
import { getTargetNetworks } from "~~/utils/scaffold-eth";

const targetNetworks = getTargetNetworks();

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

interface ParsedPageQuery extends ParsedUrlQuery {
  address?: string;
  networkId?: string;
  url?: string;
}

const Home: NextPage = () => {
  const router = useRouter();
  const { address, networkId, url } = router.query as ParsedPageQuery;
  const { latestTransaction } = useImpersonatorIframe();
  const [impersonateAddress, setImpersonateAddress] = useState(address ?? "");

  const [selectedNetwork, setSelectedNetwork] = useState(() => {
    if (networkId !== undefined) {
      const network = targetNetworks.find(network => network.id === Number(networkId));
      return network ?? targetNetworks[0];
    }
    return targetNetworks[0];
  });
  const [appUrl, setAppUrl] = useState(url ?? "");

  const debounceImpersonateAddress = useDebounce(impersonateAddress, 1000);
  const debounceAppUrl = useDebounce(appUrl, 500);

  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        address: debounceImpersonateAddress,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceImpersonateAddress]);

  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, url: debounceAppUrl },
    });
    return;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceAppUrl]);

  return (
    <>
      <MetaHeader />
      <div className="flex flex-col items-center justify-center p-8">
        <h1 className="text-2xl font-bold">impersonate</h1>
        <AddressInput value={impersonateAddress} placeholder="vitalik.eth" onChange={setImpersonateAddress} />
        <h1 className="text-2xl font-bold">at</h1>
        <div className="w-[400px]">
          <InputBase placeholder="https://app.uniswap.org/swap" value={appUrl} onChange={setAppUrl} />
        </div>
        <h1 className="text-2xl font-bold">on</h1>
        <div className="w-[200px]">
          <select
            className="select select-bordered w-full max-w-xs "
            onChange={e => {
              setSelectedNetwork(targetNetworks[e.target.selectedIndex]);
              router.push({
                pathname: router.pathname,
                query: {
                  ...router.query,
                  networkName: targetNetworks[e.target.selectedIndex].id,
                },
              });
            }}
          >
            {targetNetworks.map(network => {
              return (
                <option key={network.id} value={network.rpcUrls.default.http[0]}>
                  {network.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="space-y-4">
        {debounceImpersonateAddress && !isAddress(debounceImpersonateAddress) && (
          <h1 className="text-xl font-bold text-center">Please enter a valid address</h1>
        )}
        {debounceAppUrl && !isValidUrl(debounceAppUrl) && (
          <h1 className="text-xl font-bold text-center">Please enter a valid URL</h1>
        )}
      </div>
      {isAddress(debounceImpersonateAddress) && isValidUrl(debounceAppUrl) ? (
        <div className="flex items-center flex-col flex-grow p-4 rounded-md">
          <div className="border-2 border-gray-200 rounded-md  w-full h-full">
            <div>
              <div className="w-full rounded-md p-1">
                <ImpersonatorIframe
                  key={selectedNetwork.name + debounceImpersonateAddress + debounceAppUrl}
                  height={"1200px"}
                  width={"100%"} //set it to the browser width
                  src={debounceAppUrl}
                  address={debounceImpersonateAddress}
                  rpcUrl={selectedNetwork.rpcUrls.default.http[0]}
                />
              </div>
            </div>
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
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Home;

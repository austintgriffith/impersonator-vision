import { ImpersonatorIframe, useImpersonatorIframe } from "@impersonator/iframe";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

//import { getTargetNetwork } from "~~/utils/scaffold-eth";

const Home: NextPage = () => {
  const { latestTransaction } = useImpersonatorIframe();

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className={"border-2 border-gray-200 rounded-md p-4"}>
          <ImpersonatorIframe
            width={"800px"}
            height={"500px"}
            src="https://app.uniswap.org/pools?chain=mainnet"
            address="0x1246956C9984EdA22A6C7C4Ea0A8c4499De016f4"
            rpcUrl={"https://rpc.scaffoldeth.io:48544/"}
          />
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

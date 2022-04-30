import { Button, Flex, Spinner } from "@chakra-ui/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector, defaultChains, chain } from "@wagmi/core";
import Avatar from "boring-avatars";

import { truncate } from "utils/truncate";

function ConnectedAccount({
  address,
  onDisconnect,
}: {
  address: string;
  onDisconnect: () => void;
}) {
  return (
    <Button
      variant="outline"
      onClick={onDisconnect}
      leftIcon={<Avatar size={20} name={address} />}
    >
      {truncate(address)}
    </Button>
  );
}

export default function ConnectWallet() {
  const { data: account } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, isConnecting } = useConnect({
    connector: new InjectedConnector({
      chains: [
        ...defaultChains,
        chain.hardhat, // Only in dev
      ],
    }),
  });

  if (isConnecting) {
    return (
      <Flex
        width={"40px"}
        height="40px"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size={"md"} />
      </Flex>
    );
  }
  const { address } = account || {};

  return address ? (
    <ConnectedAccount address={address} onDisconnect={disconnect} />
  ) : (
    <Button onClick={() => connect()}>Connect wallet</Button>
  );
}

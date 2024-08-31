import { useAccount } from "@gear-js/react-hooks";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { useState, useCallback, useEffect } from "react";
import { WalletModal } from "./walletModal";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

export function Wallet() {
  const { account, isAccountReady } = useAccount();
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const connectWallet = useCallback(async () => {
    try {
      const extensions = await web3Enable("Schola");
      if (extensions.length === 0) {
        console.log("No extension found");
        return;
      }

      const allAccounts = await web3Accounts();
      console.log("Found accounts:", allAccounts);
      setAccounts(allAccounts);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  }, []);

  useEffect(() => {
    if (isAccountReady && !account) {
      connectWallet();
    }
  }, [isAccountReady, account, connectWallet]);

  if (!isAccountReady) return null;

  return (
    <>
      <button
        className={`btn ${account ? "btn-primary" : "btn-secondary"}`}
        onClick={account ? () => setIsModalOpen(true) : connectWallet}
      >
        {account ? account.meta.name : "Connect"}
      </button>
      {isModalOpen && (
        <WalletModal
          onClose={() => setIsModalOpen(false)}
          accounts={accounts}
        />
      )}
    </>
  );
}

import { useAccount as useGearAccount } from "@gear-js/react-hooks";
import { useState } from "react";
import { WALLET } from "./consts";
import { WalletId } from "./types";
import { Account } from "@gear-js/react-hooks";

export function useWallet() {
  const { account, wallets, isAccountReady } = useGearAccount();
  const [walletId, setWalletId] = useState<WalletId | undefined>(
    typeof window !== "undefined"
      ? (localStorage.getItem("wallet") as WalletId)
      : undefined,
  );

  const resetWalletId = () => setWalletId(undefined);
  const getWalletAccounts = (id: WalletId) =>
    Object.values(wallets || {}).find((wallet) => wallet.id === id)?.accounts ||
    [];
  const saveWallet = () => walletId && localStorage.setItem("wallet", walletId);
  const removeWallet = () => localStorage.removeItem("wallet");

  const wallet = walletId && WALLET[walletId];
  const walletAccounts = walletId ? getWalletAccounts(walletId) : [];

  return {
    wallet,
    walletAccounts,
    setWalletId,
    resetWalletId,
    getWalletAccounts,
    saveWallet,
    removeWallet,
    account,
    wallets,
    isAccountReady,
  };
}

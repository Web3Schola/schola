import { useAccount } from "@gear-js/react-hooks";
import { useState, useCallback } from "react";
import { WALLET } from "./consts";
import { WalletId } from "./types";

export function useWallet() {
  const { account, wallets, isAccountReady, login, logout } = useAccount();
  const [walletId, setWalletId] = useState<WalletId | undefined>(
    typeof window !== "undefined"
      ? (localStorage.getItem("wallet") as WalletId)
      : undefined,
  );

  const resetWalletId = useCallback(() => {
    setWalletId(undefined);
    localStorage.removeItem("wallet");
  }, []);

  const saveWallet = useCallback((id: WalletId) => {
    setWalletId(id);
    localStorage.setItem("wallet", id);
  }, []);

  const getWalletAccounts = useCallback(
    (id: WalletId) => {
      return (
        Object.values(wallets || {}).find((wallet) => wallet.id === id)
          ?.accounts || []
      );
    },
    [wallets],
  );

  const wallet = walletId ? WALLET[walletId] : undefined;
  const walletAccounts = walletId ? getWalletAccounts(walletId) : [];

  return {
    wallet,
    walletAccounts,
    setWalletId: saveWallet,
    resetWalletId,
    getWalletAccounts,
    account,
    wallets,
    isAccountReady,
    login,
    logout,
  };
}

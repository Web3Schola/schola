import { useAlert } from "@gear-js/react-hooks";
import { WALLETS } from "./consts";
import { useWallet } from "./hooks";
import { WalletId } from "./types";
import { Account } from "@gear-js/react-hooks";

type Props = {
  onClose: () => void;
};

export function WalletModal({ onClose }: Props) {
  const alert = useAlert();
  const {
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
  } = useWallet();

  const handleWalletClick = (id: WalletId) => {
    setWalletId(id);
  };

  const handleAccountClick = (selectedAccount: Account) => {
    // Note: We don't have a separate login function now, so we might need to handle this differently
    // For now, let's just set the walletId and close the modal
    setWalletId(selectedAccount.meta.source as WalletId);
    saveWallet();
    onClose();
  };

  const handleLogout = () => {
    // Note: We don't have a separate logout function now, so we'll just remove the wallet
    removeWallet();
    resetWalletId();
    onClose();
  };

  const renderWalletList = () => (
    <ul className="space-y-2">
      {WALLETS.map(([id, { name, icon }]) => {
        const isEnabled = wallets && id in wallets;
        const accountsCount = getWalletAccounts(id as WalletId).length;

        return (
          <li key={id}>
            <button
              className={`btn btn-block ${isEnabled ? "btn-primary" : "btn-disabled"}`}
              onClick={() => handleWalletClick(id as WalletId)}
              disabled={!isEnabled}
            >
              <span className={`mr-2 ${icon}`}></span>
              {name}
              <span className="ml-auto text-sm">
                {isEnabled ? `${accountsCount} account(s)` : "Disabled"}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );

  const renderAccountList = () => (
    <ul className="space-y-2">
      {walletAccounts.map((acc: Account) => (
        <li key={acc.address} className="flex items-center">
          <button
            className={`btn btn-block ${
              acc.address === account?.address ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => handleAccountClick(acc)}
          >
            {acc.meta.name}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Wallet Connection</h3>
        {isAccountReady ? (
          wallet ? (
            renderAccountList()
          ) : (
            renderWalletList()
          )
        ) : (
          <p>Loading...</p>
        )}
        <div className="modal-action">
          {wallet && (
            <button className="btn btn-outline" onClick={resetWalletId}>
              Change Wallet
            </button>
          )}
          {account && (
            <button className="btn btn-error" onClick={handleLogout}>
              Logout
            </button>
          )}
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

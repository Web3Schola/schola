import { useAccount } from "@gear-js/react-hooks";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { decodeAddress } from "@gear-js/api";
import { web3FromSource } from "@polkadot/extension-dapp";

type Props = {
  onClose: () => void;
  accounts: InjectedAccountWithMeta[];
};

export function WalletModal({ onClose, accounts }: Props) {
  const { login } = useAccount();

  const handleAccountSelection = async (account: InjectedAccountWithMeta) => {
    try {
      const { signer } = await web3FromSource(account.meta.source);

      if (!signer) {
        throw new Error("No signer found");
      }

      const gearAccount = {
        address: account.address,
        meta: account.meta,
        type: account.type,
        decodedAddress: decodeAddress(account.address),
        signer,
      };

      login(gearAccount);
      onClose();
    } catch (error) {
      console.error("Error selecting account:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Select an account</h3>
        {accounts.length === 0 ? (
          <p>No accounts found. Please make sure your wallet is connected.</p>
        ) : (
          <ul>
            {accounts.map((account) => (
              <li key={account.address}>
                <button onClick={() => handleAccountSelection(account)}>
                  {account.meta.name} ({account.address.slice(0, 6)}...
                  {account.address.slice(-4)})
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

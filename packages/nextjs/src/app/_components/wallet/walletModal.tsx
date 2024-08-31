import { Signer } from "@polkadot/types/types";
import { Account, useAccount } from "@gear-js/react-hooks";
import { decodeAddress, HexString } from "@gear-js/api";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
//import { ApiPromise } from "@polkadot/api";
import { web3FromSource } from "@polkadot/extension-dapp";

type Props = {
  onClose: () => void;
  accounts: InjectedAccountWithMeta[];
};
type CustomSigner = Omit<Signer, "update"> & {
  update?: (id: number, status: any) => void;
};
type CustomAccount = Omit<Account, "signer"> & {
  signer: CustomSigner;
};
export function WalletModal({ onClose, accounts }: Props) {
  const { login } = useAccount();

  const handleAccountSelection = async (account: InjectedAccountWithMeta) => {
    try {
      const { meta } = account;
      const injector = await web3FromSource(meta.source);

      const gearAccount: CustomAccount = {
        ...account, // This spreads all properties from InjectedAccountWithMeta
        decodedAddress: decodeAddress(account.address) as HexString,
        signer: injector.signer as CustomSigner,
      };

      login(gearAccount as unknown as Account);
      onClose();
    } catch (error) {
      console.error("Error selecting account:", error);
      // You could show an error message to the user here
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

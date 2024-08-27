import { useAccount } from '@gear-js/react-hooks';
import { useState } from 'react';
import { WalletModal } from './walletModal';

export function Wallet() {
  const { account, isAccountReady } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isAccountReady) return null;

  return (
    <>
      <button
        className={`btn ${account ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => setIsModalOpen(true)}
      >
        {account ? account.meta.name : 'Connect'}
      </button>
      {isModalOpen && <WalletModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}

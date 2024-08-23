import { Entries } from "./types";

import { EnkryptSVG, PolkadotSVG, SubWalletSVG, TalismanSVG } from "./assets";

const WALLET = {
  "polkadot-js": { name: "Polkadot JS", SVG: PolkadotSVG },
  "subwallet-js": { name: "SubWallet", SVG: SubWalletSVG },
  talisman: { name: "Talisman", SVG: TalismanSVG },
  enkrypt: { name: "Enkrypt", SVG: EnkryptSVG },
};

const WALLETS = Object.entries(WALLET) as Entries<typeof WALLET>;

export { WALLET, WALLETS };

const ADDRESS = process.env.NEXT_NODE_ADDRESS as string;

const LOCAL_STORAGE = {
  ACCOUNT: "account",
  WALLET: "wallet",
};

export { ADDRESS, LOCAL_STORAGE };

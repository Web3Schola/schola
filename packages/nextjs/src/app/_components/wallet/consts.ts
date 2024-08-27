type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export const WALLET = {
  "polkadot-js": { name: "Polkadot JS", icon: "polkadot-icon" },
  "subwallet-js": { name: "SubWallet", icon: "subwallet-icon" },
  talisman: { name: "Talisman", icon: "talisman-icon" },
  enkrypt: { name: "Enkrypt", icon: "enkrypt-icon" },
};

export const WALLETS = Object.entries(WALLET) as Entries<typeof WALLET>;

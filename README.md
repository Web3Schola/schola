# 🏗 Scaffold-Schola

🚧 **WORK IN PROGRESS** 🚧  
This is part of the Schola framework, a decentralized education platform that allows students to earn tokens for completing tests. This repository contains the smart contracts and the front-end for the platform.  

We are working in a more general version of the platform, called [Scaffold-Vara](https://github.com/Web3Schola/scaffold-vara). We took inspiration from the original Scaffold-ETH repository.
Scaffold-Vara, and also Schola's Repository are designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.  

⚙️ Built using NextJS, Gear-js, Sails, Polkadot-js, DaisyUI and Typescript.

- 📦 **[Yarn Workspaces](https://github.com/D9J9V/schola/blob/main/package.json)**: Collection of yarn scripts to deploy, test, and compile smart contracts and to run, lint and build your nextjs app from the main package.
- 🔄 **CI/CD**: Local rules + Github actions to ensure the safety of your codebase.
- 🪝 **Custom hooks**: Collection of React hooks wrapper around [sails](https://github.com/gear-tech/sails) and [gear-js](https://github.com/gear-tech/gear-js) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://daisyui.com/components/): Support for DaisyUI collection of common components to quickly build your frontend.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the VARA network. Currently tested for Polkadot-js wallet extension.

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Schola, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/Web3Schola/schola
cd schola
yarn install
```

2. On a second terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`.

**What's next**:

- Edit your smart contract `lib.rs` in `packages/vara/factory`
- Edit your frontend homepage at `packages/nextjs/src/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
- Edit your scripts in `packages/vara/factory/package.json` & `packages/nextjs/package.json`. Then run them using `yarn <script-name>`.
- Edit your smart contract and build it by running: `yarn build`
- Edit your smart contract's js-interface by running: `generate-js-client`. You'll see the result at `packahes/nextjs/contracts`

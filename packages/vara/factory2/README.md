# Trivia Factory

A decentralized trivia game platform built on the Gear Protocol.

## Overview

Trivia Factory allows users to create, manage, and play trivia games on the blockchain. It leverages the power of smart contracts to ensure fair gameplay and transparent reward distribution.

## Features

- Create custom trivia games with questions, answers, and rewards
- Play existing trivia games
- Update and delete trivia games (owner only)
- View all trivia games and their details
- Automatic reward distribution for correct answers

## Project Structure

The workspace includes the following packages:

- `trivia-factory`: Main package for building the WASM binary and IDL file
- `trivia-factory-app`: Core business logic for the Trivia Factory program
- `trivia-factory-client`: Client library for interacting with the Trivia Factory program

## Getting Started

### Prerequisites

- Rust and Cargo
- wasm32-unknown-unknown target: `rustup target add wasm32-unknown-unknown`

### Building

To build the WASM binary:

```bash
cargo build --release
```

The WASM binary will be available in the `target/wasm32-unknown-unknown/release/` directory.

### Testing

Run the integration tests:

```bash
cargo test
```

## Usage

[Include examples of how to use the Trivia Factory, both on-chain and off-chain]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

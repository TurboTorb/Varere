module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    loc_ecommerce_ecommerce: {
      network_id: "*",
      port: 8545,
      host: "127.0.0.1"
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  mocha: {},
  compilers: {
    solc: {
      version: "0.8.4"
    }
  }
};

const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.RPC_URL, {
      reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 15,
        onTimeout: false,
      },
    })
  );

  module.exports = {
    web3
  }
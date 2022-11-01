const Utils = {
    zeroAddress: "0x0000000000000000000000000000000000000000",
    formatAsCurrency: function(num, places) {
        // Create our number formatter.
        if (places === undefined) places = 2;
        let formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: places, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
            maximumFractionDigits: places, // (causes 2500.99 to be printed as $2,501)
        });
        return formatter.format(num);
      },

      getUserAddress: async function () {
        try {
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            console.log("accounts: ", accounts);
            if (accounts.length == 0) {
                console.log("NO ACCOUNTS CONNECTED");
            }
            const acct = accounts[0];
            console.log("userAddress: ", acct);
            return acct;
        } catch (error) {
            console.error("error: ", error);
        }
    }
}

export default Utils;
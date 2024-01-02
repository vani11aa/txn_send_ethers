
const { ethers } = require ("ethers");
require ("dotenv").config();

// Add the address of the wallet receiving the funds
const destinationAddress = "0x77c85dC1bc35F3674E115a8C21fA9c9B8EEdc9d3";

const main = async () => {
    //provider connects to the tenderly node, url is pulled from .env
    provider = new ethers.providers.JsonRpcProvider(process.env.TENDERLY_URL);

    //set up sender
    const sender = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    //balanceBefore holds the balance of the destination address before sending
    const balanceBefore = await provider.getBalance(destinationAddress);
    console.log(`Destination balance before sending: ${ethers.utils.formatEther(balanceBefore)} ETH`);
    console.log("Sending...\n");

    //adjust the amount to send
    const tx = await sender.sendTransaction({to:destinationAddress, value: ethers.utils.parseEther("0.0011")});
    console.log("Sent!!!");
    console.log(`TXN hash: ${tx.hash}`);
    console.log("Waiting for reciept...");

    //waits for the block to be mined
    await provider.waitForTransaction(tx.hash, 1, 150000).then(() => {});

    //prints link to the txn on tenderly dashboard
    console.log(`TX details: https://dashboard.tenderly.co/tx/sepolia/${tx.hash}\n`);

    //shows the new balance of the destination address
    const balanceAfter = await provider.getBalance(destinationAddress);
    console.log(`Destination balance after sending: ${ethers.utils.formatEther(balanceAfter)} ETH`);
}

main ()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Home.module.css';
import Web3Modal from 'web3modal';
import { providers, Contract } from 'ethers';

import Header from '../components/header';
import { WHITELIST_CONTRACT_ADDRESS, whitelistAbi } from '../constants';

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [hasJoinedWhitelist, setHasJoinedWhitelist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalWhitelisted, setTotalWhitelisted] = useState(0);
  const web3ModalRef = useRef();

  /**
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the signing capabilities of metamask attached
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();

    if (chainId !== 4) {
      try {
        await provider.send('wallet_switchEthereumChain', [{ chainId: '0x4' }]);
      } catch (error) {
        console.log(error);
      }
    }

    if (needSigner) {
      return web3Provider.getSigner();
    }
    return web3Provider;
  };

  /**
   * addAddressToWhitelist: Adds the current connected address to the whitelist
   */
  const addAddressToWhitelist = async () => {
    try {
      // We need a Signer here since this is a 'write' transaction.

      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
      // update methods
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        whitelistAbi,
        signer
      );
      // call the addToWhitelisted from the contract
      const tx = await whitelistContract.addToWhitelisted();

      setIsLoading(true);

      // wait for the transaction to get mined
      await tx.wait();
      // get the updated number of addresses in the whitelist
      await getNumberOfWhitelisted();
      setHasJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * getNumberOfWhitelisted:  gets the number of whitelisted addresses
   */
  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner(true);

      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        whitelistAbi,
        provider
      );

      const _numberOfWhitelisted = await whitelistContract.totalWhitelisted();
      const hexToNumber = parseInt(_numberOfWhitelisted._hex, 16);
      setTotalWhitelisted(hexToNumber);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * checkIfAddressInWhitelist: Checks if the address is in whitelist
   */
  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        whitelistAbi,
        signer
      );

      const address = await signer.getAddress();

      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setHasJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };

  /*
    connectWallet: Connects the MetaMask wallet
  */
  const connectWallet = async () => {
    try {
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();

      setIsLoading(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();

      setIsWalletConnected(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  /*
    renderButton: Returns a button based on the state of the dapp
  */
  const renderButton = () => {
    if (isWalletConnected) {
      if (hasJoinedWhitelist) {
        return <p className={styles.description}>Congrats! You are in 🎉</p>;
      } else if (isLoading) {
        return <button className={styles.button}>loading...</button>;
      } else {
        return (
          <button className={styles.button} onClick={addAddressToWhitelist}>
            Join the Whitelist
          </button>
        );
      }
    }
    return (
      <button className={styles.button} onClick={connectWallet}>
        Connect your wallet
      </button>
    );
  };

  useEffect(() => {
    if (!isWalletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: 'rinkeby',
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
    connectWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWalletConnected]);

  return (
    <div>
      <Head>
        <title>Whippp</title>
        <meta name="description" content="Whippp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Get youself Whippped!</h1>
          <p className={styles.description}>
            Launching the new NFT collection in approx 10 days. Get yourself
            whitelisted and be a part of the community!
          </p>
          <p className={styles.description}>
            WhiteListed users gets a 10 min presale period where they can mint a
            guaranteed NFT.
          </p>
          {isWalletConnected && (
            <div className={styles.description}>
              {totalWhitelisted} have already joined the Whitelist.{' '}
              {hasJoinedWhitelist ? '' : 'When are you joining?'}
            </div>
          )}
          {renderButton()}
        </div>
      </div>
    </div>
  );
}

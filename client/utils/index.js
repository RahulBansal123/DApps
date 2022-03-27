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
    await provider.send('wallet_switchEthereumChain', [{ chainId: '0x4' }]);
  }

  if (needSigner) {
    return web3Provider.getSigner();
  }
  return web3Provider;
};

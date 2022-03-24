import { Token, Token__factory, Bridge, Bridge__factory } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

declare module "mocha" {
  export interface Context {
    TokenContract: Token__factory;
    BridgeContract: Bridge__factory;
    tokenEth: Token;
    tokenBsc: Token;
    bridgeEth: Bridge;
    bridgeBsc: Bridge;
    owner: SignerWithAddress;
    addr1: SignerWithAddress;
    addr2: SignerWithAddress;
    validator: SignerWithAddress;
  }
}

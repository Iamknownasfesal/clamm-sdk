import { CoinMetadata, SuiClient } from '@mysten/sui.js/client';
import {
  TransactionArgument,
  TransactionBlock,
  TransactionObjectArgument,
  TransactionResult,
} from '@mysten/sui.js/transactions';

interface MaybeTxb {
  txb?: TransactionBlock;
}

export interface ClammConstructor {
  suiClient: SuiClient;
  packageAddress: string;
  suiTearsAddress: string;
  network: 'testnet' | 'mainnet' | 'devnet';
  coinDecimalAddress?: string | null;
}

export type CoinMeta = CoinMetadata & {
  type: string;
};

export type MoveObjectArgument = string | TransactionObjectArgument;

export type TransactionNestedResult = Extract<
  TransactionArgument,
  { index: number; resultIndex: number; kind: 'NestedResult' }
>;

export interface NewStableArgs extends MaybeTxb {
  typeArguments: string[];
  coins: MoveObjectArgument[];
  lpCoinTreasuryCap: MoveObjectArgument;
  a?: bigint;
}

export interface NewVolatileArgs extends MaybeTxb {
  typeArguments: string[];
  coins: MoveObjectArgument[];
  lpCoinTreasuryCap: MoveObjectArgument;
  a?: bigint;
  gamma?: bigint;
  extraProfit?: bigint;
  adjustmentStep?: bigint;
  maHalfTime?: bigint;
  midFee?: bigint;
  outFee?: bigint;
  gammaFee?: bigint;
  prices: bigint[];
}

export interface SharePoolArgs {
  txb: TransactionBlock;
  pool: TransactionNestedResult;
}

export interface NewPoolReturn {
  txb: TransactionBlock;
  pool: TransactionNestedResult;
  poolAdmin: TransactionNestedResult;
  lpCoin: TransactionNestedResult;
}

export interface AddLiquidityArgs extends MaybeTxb {
  pool: InterestPool | string;
  minAmount?: bigint;
  coinsIn: MoveObjectArgument[];
}

export interface AddLiquidityReturn {
  txb: TransactionBlock;
  lpCoin: TransactionResult;
}

export interface RemoveLiquidityArgs extends MaybeTxb {
  pool: InterestPool | string;
  minAmounts?: readonly bigint[];
  lpCoin: MoveObjectArgument;
}

export interface RemoveLiquidityReturn extends MaybeTxb {
  txb: TransactionBlock;
  coinsOut: TransactionNestedResult[];
}

export interface SwapArgs extends MaybeTxb {
  pool: InterestPool | string;
  coinInType: string;
  coinOutType: string;
  coinIn: MoveObjectArgument;
  minAmount?: bigint;
}

export interface SwapReturn {
  txb: TransactionBlock;
  coinOut: TransactionResult;
}

interface Pool<T> {
  poolObjectId: string;
  stateId: string;
  lpCoinType: string;
  isStable: boolean;
  coinTypes: readonly string[];
  poolAdminAddress: string;
  state: T;
}

export interface StableFees {
  feeInPercent: bigint;
  feeOutPercent: bigint;
  adminFeePercent: bigint;
}

export interface RebalancingParams {
  adjustmentStep: bigint;
  extraProfit: bigint;
  maHalfTime: bigint;
}

export interface VolatileFees {
  adminFee: bigint;
  gammaFee: bigint;
  midFee: bigint;
  outFee: bigint;
}

export interface StablePoolState {
  lpCoinSupply: bigint;
  lpCoinDecimals: number;
  balances: readonly bigint[];
  initialA: bigint;
  futureA: bigint;
  initialATime: bigint;
  futureATime: bigint;
  nCoins: number;
  fees: StableFees;
}

export interface CoinState {
  index: number;
  lastPrice: bigint;
  price: bigint;
  priceOracle: bigint;
  type: string;
}

export interface VolatilePoolState {
  a: bigint;
  futureA: bigint;
  gamma: bigint;
  initialTime: bigint;
  futureGamma: bigint;
  futureTime: bigint;
  adminBalance: bigint;
  balances: readonly bigint[];
  d: bigint;
  fees: VolatileFees;
  lastPriceTimestamp: bigint;
  lpCoinSupply: bigint;
  maxA: bigint;
  minA: bigint;
  nCoins: number;
  rebalancingParams: RebalancingParams;
  virtualPrice: bigint;
  xcpProfit: bigint;
  xcpProfitA: bigint;
  notAdjusted: boolean;
  coinStateMap: Record<string, CoinState>;
}

export type StablePool = Pool<StablePoolState>;
export type VolatilePool = Pool<VolatilePoolState>;
export type InterestPool = StablePool | VolatilePool;

import { TransactionBlock } from '@mysten/sui.js/transactions';

import {
  CLAMM,
  executeTx,
  keypair,
  log,
  STABLE_POOL_USDC_TREASURY_CAP,
  STABLE_POOL_USDC_USDT_OBJECT_ID,
} from '../utils.script';

(async () => {
  try {
    const pool = await CLAMM.getPool(STABLE_POOL_USDC_USDT_OBJECT_ID);

    const initTxb = new TransactionBlock();

    // USDC has 6 decimals
    const coinIn = initTxb.moveCall({
      target: '0x2::coin::mint',
      typeArguments: [pool.coinTypes[0]],
      arguments: [
        initTxb.object(STABLE_POOL_USDC_TREASURY_CAP),
        initTxb.pure(10_000_000n),
      ],
    });

    const { coinOut, txb } = await CLAMM.swap({
      txb: initTxb,
      pool,
      coinIn,
      coinInType: pool.coinTypes[0],
      coinOutType: pool.coinTypes[1],
    });

    txb.transferObjects([coinOut], txb.pure(keypair.toSuiAddress()));

    const response = await executeTx(txb);
    log(response);
  } catch (e) {
    console.log(e);
  }
})();

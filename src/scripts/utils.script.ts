import { bcs } from '@mysten/sui.js/bcs';
import {
  getFullnodeUrl,
  SuiClient,
  SuiObjectResponse,
} from '@mysten/sui.js/client';
import { OwnedObjectRef } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import {
  TransactionBlock,
  TransactionResult,
} from '@mysten/sui.js/transactions';
import { fromHEX, normalizeSuiAddress, toHEX } from '@mysten/sui.js/utils';
import dotenv from 'dotenv';
import { pathOr } from 'ramda';
import invariant from 'tiny-invariant';
import util from 'util';

import { CLAMM as CLAMM_ } from '../clamm';
import * as template from './template/move_bytecode_template.js';

dotenv.config();

export const keypair = Ed25519Keypair.fromSecretKey(
  Uint8Array.from(Buffer.from(process.env.KEY!, 'base64')).slice(1),
);

const getCoinTemplateByteCode = () =>
  'a11ceb0b060000000a01000c020c1e032a2d04570a05616307c401e70108ab0360068b04570ae204050ce704360007010d02060212021302140000020001020701000002010c01000102030c0100010404020005050700000a000100011105060100020808090102020b0c010100030e0501010c030f0e01010c04100a0b00050c030400010402070307050d040f02080007080400020b020108000b03010800010a02010805010900010b01010900010800070900020a020a020a020b01010805070804020b030109000b0201090001060804010504070b030109000305070804010b0301080002090005010b020108000d434f494e5f54454d504c4154450c436f696e4d65746164617461064f7074696f6e0b5472656173757279436170095478436f6e746578740355726c04636f696e0d636f696e5f74656d706c6174650f6372656174655f63757272656e63790b64756d6d795f6669656c6404696e6974116d696e745f616e645f7472616e73666572156e65775f756e736166655f66726f6d5f6279746573066f7074696f6e137075626c69635f73686172655f6f626a6563740f7075626c69635f7472616e736665720673656e64657204736f6d65087472616e736665720a74785f636f6e746578740375726c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020201090a02070653594d424f4c0a0205044e414d450a020c0b4445534352495054494f4e0a02040375726c030800000000000000000520000000000000000000000000000000000000000000000000000000000000000000020109010000000002190b0007000701070207030704110738000a0138010c020c030d0307050a012e11060b0138020b03070638030b0238040200';

const getLpCoinTemplateByteCode = () =>
  'a11ceb0b060000000a01000c020c1e032a2704510805594c07a501c90108ee026006ce032b0af903050cfe0328000a010c02060211021202130001020001020701000002000c01000102030c01000104040200050507000009000100011005060100020708090102030d0501010c030e0d01010c040f0a0b00050b03040001040207040c030202080007080400010b02010800010a02010805010900010b01010900010800070900020a020a020a020b01010805070804020b030109000b02010900010608040105010b03010800020900050c436f696e4d65746164617461074c505f434f494e064f7074696f6e0b5472656173757279436170095478436f6e746578740355726c04636f696e0f6372656174655f63757272656e63790b64756d6d795f6669656c6404696e6974076c705f636f696e156e65775f756e736166655f66726f6d5f6279746573066f7074696f6e137075626c69635f73686172655f6f626a6563740f7075626c69635f7472616e736665720673656e64657204736f6d65087472616e736665720a74785f636f6e746578740375726c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020201090a02070653594d424f4c0a0205044e414d450a020c0b4445534352495054494f4e0a02040375726c00020108010000000002120b0007000701070207030704110638000a0138010c020b012e110538020b0238030200';

const Address = bcs.bytes(32).transform({
  // To change the input type, you need to provide a type definition for the input
  input: (val: string) => fromHEX(val),
  output: val => toHEX(val),
});

const updateDecimals = (modifiedByteCode: Uint8Array, decimals: number = 9) =>
  template.update_constants(
    modifiedByteCode,
    bcs.u8().serialize(decimals).toBytes(),
    bcs.u8().serialize(9).toBytes(),
    'U8',
  );

const updateSymbol = (modifiedByteCode: Uint8Array, symbol: string) =>
  template.update_constants(
    modifiedByteCode,
    bcs.string().serialize(symbol.trim()).toBytes(),
    bcs.string().serialize('SYMBOL').toBytes(),
    'Vector(U8)',
  );

const updateName = (modifiedByteCode: Uint8Array, name: string) => {
  return template.update_constants(
    modifiedByteCode,
    bcs.string().serialize(name.trim()).toBytes(),
    bcs.string().serialize('NAME').toBytes(),
    'Vector(U8)',
  );
};

const updateDescription = (modifiedByteCode: Uint8Array, description: string) =>
  template.update_constants(
    modifiedByteCode,
    bcs.string().serialize(description.trim()).toBytes(),
    bcs.string().serialize('DESCRIPTION').toBytes(),
    'Vector(U8)',
  );

const updateUrl = (modifiedByteCode: Uint8Array, url: string) =>
  template.update_constants(
    modifiedByteCode,
    bcs.string().serialize(url).toBytes(),
    bcs.string().serialize('url').toBytes(),
    'Vector(U8)',
  );

const updateMintAmount = (modifiedByteCode: Uint8Array, supply: bigint) =>
  template.update_constants(
    modifiedByteCode,
    bcs.u64().serialize(supply.toString()).toBytes(),
    bcs.u64().serialize(0).toBytes(),
    'U64',
  );

const updateTreasuryCapRecipient = (
  modifiedByteCode: Uint8Array,
  recipient: string,
) =>
  template.update_constants(
    modifiedByteCode,
    Address.serialize(recipient).toBytes(),
    Address.serialize(normalizeSuiAddress('0x0')).toBytes(),
    'Address',
  );

export const client = new SuiClient({ url: getFullnodeUrl('testnet') });

invariant(process.env.CLAMM && process.env.SUI_TEARS, 'env not set');

export const CLAMM = new CLAMM_({
  suiClient: client,
  packageAddress: process.env.CLAMM,
  suiTearsAddress: process.env.SUI_TEARS,
  network: 'testnet',
});

interface GetByteCodeArgs {
  decimals: number;
  totalSupply: bigint;
  name: string;
  imageUrl: string;
  symbol: string;
  recipient: string;
  description: string;
}

export const getCoinBytecode = (info: GetByteCodeArgs) => {
  const templateByteCode = fromHEX(getCoinTemplateByteCode());

  const modifiedByteCode = template.update_identifiers(templateByteCode, {
    COIN_TEMPLATE: info.symbol.toUpperCase(),
    coin_template: info.symbol.toLowerCase(),
  });

  let updated = updateDecimals(modifiedByteCode, info.decimals);

  updated = updateSymbol(updated, info.symbol);
  updated = updateName(updated, info.name);

  updated = updateDescription(updated, info.description ?? '');
  updated = updateUrl(updated, info.imageUrl ?? '');

  const supply = info.totalSupply * 10n ** BigInt(info.decimals || 9);

  updated = updateMintAmount(updated, supply);
  updated = updateTreasuryCapRecipient(updated, info.recipient);

  return updated;
};

const getLpCoinBytecode = (info: GetByteCodeArgs) => {
  const templateByteCode = fromHEX(getLpCoinTemplateByteCode());

  const modifiedByteCode = template.update_identifiers(templateByteCode, {
    LP_COIN: info.symbol.toUpperCase().replaceAll('-', '_'),
    lp_coin: info.symbol.toLowerCase().replaceAll('-', '_'),
  });

  let updated = updateDecimals(modifiedByteCode, 9);

  updated = updateSymbol(updated, info.symbol);
  updated = updateName(updated, info.name);

  updated = updateDescription(updated, info.description ?? '');
  updated = updateUrl(updated, info.imageUrl ?? '');

  return updated;
};

export const executeTx = async (txb: TransactionBlock) => {
  const result = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: txb,
    options: {
      showEffects: true,
    },
    requestType: 'WaitForLocalExecution',
  });

  // return if the tx hasn't succeed
  if (result.effects?.status?.status !== 'success') {
    console.log('\n\nCreating a new stable pool failed');
    return;
  }

  console.log('SUCCESS!');

  // get all created objects IDs
  const createdObjectIds = result.effects.created!.map(
    (item: OwnedObjectRef) => item.reference.objectId,
  );

  // fetch objects data
  return client.multiGetObjects({
    ids: createdObjectIds,
    options: { showContent: true, showType: true, showOwner: true },
  });
};

interface CoinData {
  treasuryCap: null | string;
  coinMetadata: null | string;
  coin: string;
  coinType: string;
}

const getCoinType = (x: string) =>
  x.split('0x2::coin::CoinMetadata<')[1].slice(0, -1);

const extractCoinData = (x: SuiObjectResponse[]) =>
  x.reduce(
    (acc, elem) => {
      if (elem.data?.content?.dataType === 'moveObject') {
        const type = elem.data.content.type;

        const isCoinMetadata = type.startsWith('0x2::coin::CoinMetadata<');
        const isCoin = type.startsWith('0x2::coin::Coin<');
        const isTreasuryCap = type.startsWith('0x2::coin::TreasuryCap<');

        if (isCoinMetadata)
          return {
            ...acc,
            coinMetadata: pathOr('', ['id', 'id'], elem.data.content.fields),
            coinType: getCoinType(elem.data.content.type),
          };
        if (isCoin)
          return {
            ...acc,
            coin: pathOr('', ['id', 'id'], elem.data.content.fields),
          };
        if (isTreasuryCap)
          return {
            ...acc,
            treasuryCap: pathOr('', ['id', 'id'], elem.data.content.fields),
          };

        return acc;
      } else {
        return acc;
      }
    },
    { treasuryCap: '', coinMetadata: '', coin: '', coinType: '' } as CoinData,
  );

export const createCoin = async (info: GetByteCodeArgs) => {
  const txb = new TransactionBlock();

  txb.setGasBudget(50_000_000);

  const [upgradeCap] = txb.publish({
    modules: [[...getCoinBytecode(info)]],
    dependencies: [normalizeSuiAddress('0x1'), normalizeSuiAddress('0x2')],
  });

  txb.transferObjects([upgradeCap], txb.pure(keypair.toSuiAddress()));

  const result = await executeTx(txb);
  return extractCoinData(result || []);
};

export const createLPCoin = async (info: GetByteCodeArgs) => {
  const txb = new TransactionBlock();
  txb.setGasBudget(50_000_000);

  const [upgradeCap] = txb.publish({
    modules: [[...getLpCoinBytecode(info)]],
    dependencies: [normalizeSuiAddress('0x1'), normalizeSuiAddress('0x2')],
  });

  txb.transferObjects([upgradeCap], txb.pure(keypair.toSuiAddress()));

  const result = await executeTx(txb);
  return extractCoinData(result || []);
};

export const log = (x: unknown) =>
  console.log(util.inspect(x, false, null, true));

export const sleep = async (ms = 0) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const PRECISION = 1000000000000000000n;

export const STABLE_POOL_USDC_USDT_OBJECT_ID =
  '0xaba1ea8dd79da0236001f91a46e35c624630c9063fbb837483613aec44a15288';

export const VOLATILE_POOL_USDC_BTC_OBJECT_ID =
  '0x0f576fec03e56e7c9d0d1e2563a8fadb12e02cb55be80b7afa4e6d542b15472a';

export const STABLE_POOL_USDC_TREASURY_CAP =
  '0x48a52eeacbfed8d9c30c20ef6fab4b3987986233fe56e85dfca2011a8a9a71e4';

export const STABLE_POOL_USDT_TREASURY_CAP =
  '0x9f21f074c7645c71ad614007abfb2333ed02a6f7841707bcb07e97f1d4802819';

export const VOLATILE_POOL_USDC_TREASURY_CAP =
  '0x6e7a09318227641aac984361e6fa2f899ff5ec435acbbb56431ab05111ca7661';

export const VOLATILE_POOL_BTC_TREASURY_CAP =
  '0x13700769e1fe3fe7d9830ae3c9d5340d62cd42f05a1ccf5630fadd158c3693d7';

export function removeLeadingZeros(address: string): string {
  return (address as any).replaceAll(/0x0+/g, '0x');
}

export async function getCoinOfValue(
  txb: TransactionBlock,
  coinType: string,
  coinValue: bigint,
): Promise<TransactionResult> {
  let coinOfValue: TransactionResult;
  coinType = removeLeadingZeros(coinType);
  if (coinType === '0x2::sui::SUI') {
    coinOfValue = txb.splitCoins(txb.gas, [txb.pure(coinValue)]);
  } else {
    const paginatedCoins = await client.getCoins({
      owner: keypair.toSuiAddress(),
      coinType,
    });

    const [firstCoin, ...otherCoins] = paginatedCoins.data;

    const firstCoinInput = txb.object(firstCoin.coinObjectId);

    if (otherCoins.length > 0) {
      txb.mergeCoins(
        firstCoinInput,
        otherCoins.map(coin => coin.coinObjectId),
      );
    }
    coinOfValue = txb.splitCoins(firstCoinInput, [txb.pure(coinValue)]);
  }
  return coinOfValue;
}

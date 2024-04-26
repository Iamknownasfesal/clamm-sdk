let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;
let wasm;
const { TextDecoder, TextEncoder } = require(`util`);

let cachedTextDecoder = new TextDecoder('utf-8', {
  ignoreBOM: true,
  fatal: true,
});

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
  if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];

  if (typeof heap_next !== 'number') throw new Error('corrupt heap');

  heap[idx] = obj;
  return idx;
}

function getObject(idx) {
  return heap[idx];
}

function _assertBoolean(n) {
  if (typeof n !== 'boolean') {
    throw new Error('expected a boolean argument');
  }
}

function _assertNum(n) {
  if (typeof n !== 'number') throw new Error('expected a number argument');
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString =
  typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
      }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
          read: arg.length,
          written: buf.length,
        };
      };

function passStringToWasm0(arg, malloc, realloc) {
  if (typeof arg !== 'string') throw new Error('expected a string argument');

  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length, 1) >>> 0;
    getUint8Memory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len, 1) >>> 0;

  const mem = getUint8Memory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7f) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, (len = offset + arg.length * 3), 1) >>> 0;
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);
    if (ret.read !== arg.length) throw new Error('failed to pass whole string');
    offset += ret.written;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

function isLikeNone(x) {
  return x === undefined || x === null;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
  if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachedInt32Memory0;
}

let cachedFloat64Memory0 = null;

function getFloat64Memory0() {
  if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
    cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
  }
  return cachedFloat64Memory0;
}

function dropObject(idx) {
  if (idx < 132) return;
  heap[idx] = heap_next;
  heap_next = idx;
}

function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}

function debugString(val) {
  // primitive types
  const type = typeof val;
  if (type == 'number' || type == 'boolean' || val == null) {
    return `${val}`;
  }
  if (type == 'string') {
    return `"${val}"`;
  }
  if (type == 'symbol') {
    const description = val.description;
    if (description == null) {
      return 'Symbol';
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == 'function') {
    const name = val.name;
    if (typeof name == 'string' && name.length > 0) {
      return `Function(${name})`;
    } else {
      return 'Function';
    }
  }
  // objects
  if (Array.isArray(val)) {
    const length = val.length;
    let debug = '[';
    if (length > 0) {
      debug += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug += ', ' + debugString(val[i]);
    }
    debug += ']';
    return debug;
  }
  // Test for built-in
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    // Failed to match the standard '[object ClassName]'
    return toString.call(val);
  }
  if (className == 'Object') {
    // we're a user defined class or Object
    // JSON.stringify avoids problems with cycles, and is generally much
    // easier than looping through ownProperties of `val`.
    try {
      return 'Object(' + JSON.stringify(val) + ')';
    } catch (_) {
      return 'Object';
    }
  }
  // errors
  if (val instanceof Error) {
    return `${val.name}: ${val.message}\n${val.stack}`;
  }
  // TODO we could test for more things here, like `Set`s and `Map`s.
  return className;
}

function _assertBigInt(n) {
  if (typeof n !== 'bigint') throw new Error('expected a bigint argument');
}

let cachedBigInt64Memory0 = null;

function getBigInt64Memory0() {
  if (
    cachedBigInt64Memory0 === null ||
    cachedBigInt64Memory0.byteLength === 0
  ) {
    cachedBigInt64Memory0 = new BigInt64Array(wasm.memory.buffer);
  }
  return cachedBigInt64Memory0;
}
/**
 * Get the version of the crate (useful for testing the package).
 * @returns {string}
 */
module.exports.version = function () {
  let deferred1_0;
  let deferred1_1;
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    wasm.version(retptr);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    deferred1_0 = r0;
    deferred1_1 = r1;
    return getStringFromWasm0(r0, r1);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
    wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
  }
};

function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1, 1) >>> 0;
  getUint8Memory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}
/**
 * Deserialize the `Uint8Array`` bytecode into a JSON object.
 *
 * ```javascript
 * import * as template from '@mysten/move-binary-template';
 *
 * const json = template.deserialize( binary );
 * console.log( json, json.identifiers );
 * ```
 * @param {Uint8Array} binary
 * @returns {any}
 */
module.exports.deserialize = function (binary) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passArray8ToWasm0(binary, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.deserialize(retptr, ptr0, len0);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    if (r2) {
      throw takeObject(r1);
    }
    return takeObject(r0);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
};

function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
 * Update the identifiers in the module bytecode, given a map of old -> new identifiers.
 * Returns the updated bytecode.
 *
 * ```javascript
 * import * as template from '@mysten/move-binary-template';
 *
 * const updated = template.update_identifiers( binary, {
 *     'TEMPLATE': 'NEW_VALUE',
 *     'template': 'new_value',
 *     'Name':     'NewName'
 * });
 * ```
 * @param {Uint8Array} binary
 * @param {any} map
 * @returns {Uint8Array}
 */
module.exports.update_identifiers = function (binary, map) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passArray8ToWasm0(binary, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.update_identifiers(retptr, ptr0, len0, addHeapObject(map));
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    var r3 = getInt32Memory0()[retptr / 4 + 3];
    if (r3) {
      throw takeObject(r2);
    }
    var v2 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 1);
    return v2;
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
};

/**
 * Updates a constant in the constant pool. Because constants don't have names,
 * the only way to identify them is by their type and value.
 *
 * The value of a constant is BCS-encoded and the type is a string representation
 * of the `SignatureToken` enum. String identifier for `SignatureToken` is a
 * capitalized version of the type: U8, Address, Vector(Bool), Vector(U8), etc.
 *
 * ```javascript
 * import * as template from '@mysten/move-binary-template';
 * import { bcs } from '@mysten/bcs';
 *
 * let binary = template.update_constants(
 *     binary, // Uint8Array
 *     bcs.u64().serialize(0).toBytes(),      // new value
 *     bcs.u64().serialize(100000).toBytes(), // old value
 *     'U64'                                  // type
 * );
 * ```
 * @param {Uint8Array} binary
 * @param {Uint8Array} new_value
 * @param {Uint8Array} expected_value
 * @param {string} expected_type
 * @returns {Uint8Array}
 */
module.exports.update_constants = function (
  binary,
  new_value,
  expected_value,
  expected_type,
) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passArray8ToWasm0(binary, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArray8ToWasm0(new_value, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passArray8ToWasm0(expected_value, wasm.__wbindgen_malloc);
    const len2 = WASM_VECTOR_LEN;
    const ptr3 = passStringToWasm0(
      expected_type,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len3 = WASM_VECTOR_LEN;
    wasm.update_constants(
      retptr,
      ptr0,
      len0,
      ptr1,
      len1,
      ptr2,
      len2,
      ptr3,
      len3,
    );
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    var r3 = getInt32Memory0()[retptr / 4 + 3];
    if (r3) {
      throw takeObject(r2);
    }
    var v5 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 1);
    return v5;
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
};

/**
 * Convenience method to analyze the constant pool; returns all constants in order
 * with their type and BCS value.
 *
 * ```javascript
 * import * as template from '@mysten/move-binary-template';
 *
 * let consts = template.get_constants(binary);
 * ```
 * @param {Uint8Array} binary
 * @returns {any}
 */
module.exports.get_constants = function (binary) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passArray8ToWasm0(binary, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.get_constants(retptr, ptr0, len0);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    if (r2) {
      throw takeObject(r1);
    }
    return takeObject(r0);
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
};

/**
 * Serialize the JSON module into a `Uint8Array` (bytecode).
 * @param {any} json_module
 * @returns {Uint8Array}
 */
module.exports.serialize = function (json_module) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    wasm.serialize(retptr, addHeapObject(json_module));
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var r2 = getInt32Memory0()[retptr / 4 + 2];
    var r3 = getInt32Memory0()[retptr / 4 + 3];
    if (r3) {
      throw takeObject(r2);
    }
    var v1 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 1);
    return v1;
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
};

function logError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    let error = (function () {
      try {
        return e instanceof Error
          ? `${e.message}\n\nStack:\n${e.stack}`
          : e.toString();
      } catch (_) {
        return '<failed to stringify thrown value>';
      }
    })();
    console.error(
      'wasm-bindgen: imported JS function that was not marked as `catch` threw an error:',
      error,
    );
    throw e;
  }
}

function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    wasm.__wbindgen_exn_store(addHeapObject(e));
  }
}
/**
 * A transformed constant from the constant pool.
 */
class Constant {
  constructor() {
    throw new Error('cannot invoke `new` directly');
  }

  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;

    return ptr;
  }

  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_constant_free(ptr);
  }
}
module.exports.Constant = Constant;

module.exports.__wbindgen_error_new = function (arg0, arg1) {
  const ret = new Error(getStringFromWasm0(arg0, arg1));
  return addHeapObject(ret);
};

module.exports.__wbindgen_is_undefined = function (arg0) {
  const ret = getObject(arg0) === undefined;
  _assertBoolean(ret);
  return ret;
};

module.exports.__wbindgen_in = function (arg0, arg1) {
  const ret = getObject(arg0) in getObject(arg1);
  _assertBoolean(ret);
  return ret;
};

module.exports.__wbindgen_boolean_get = function (arg0) {
  const v = getObject(arg0);
  const ret = typeof v === 'boolean' ? (v ? 1 : 0) : 2;
  _assertNum(ret);
  return ret;
};

module.exports.__wbindgen_string_get = function (arg0, arg1) {
  const obj = getObject(arg1);
  const ret = typeof obj === 'string' ? obj : undefined;
  var ptr1 = isLikeNone(ret)
    ? 0
    : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
  var len1 = WASM_VECTOR_LEN;
  getInt32Memory0()[arg0 / 4 + 1] = len1;
  getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};

module.exports.__wbindgen_is_bigint = function (arg0) {
  const ret = typeof getObject(arg0) === 'bigint';
  _assertBoolean(ret);
  return ret;
};

module.exports.__wbindgen_is_object = function (arg0) {
  const val = getObject(arg0);
  const ret = typeof val === 'object' && val !== null;
  _assertBoolean(ret);
  return ret;
};

module.exports.__wbindgen_is_string = function (arg0) {
  const ret = typeof getObject(arg0) === 'string';
  _assertBoolean(ret);
  return ret;
};

module.exports.__wbindgen_jsval_eq = function (arg0, arg1) {
  const ret = getObject(arg0) === getObject(arg1);
  _assertBoolean(ret);
  return ret;
};

module.exports.__wbindgen_shr = function (arg0, arg1) {
  const ret = getObject(arg0) >> getObject(arg1);
  return addHeapObject(ret);
};

module.exports.__wbindgen_bigint_from_u64 = function (arg0) {
  const ret = BigInt.asUintN(64, arg0);
  return addHeapObject(ret);
};

module.exports.__wbindgen_number_get = function (arg0, arg1) {
  const obj = getObject(arg1);
  const ret = typeof obj === 'number' ? obj : undefined;
  if (!isLikeNone(ret)) {
    _assertNum(ret);
  }
  getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
  getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
};

module.exports.__wbindgen_number_new = function (arg0) {
  const ret = arg0;
  return addHeapObject(ret);
};

module.exports.__wbindgen_string_new = function (arg0, arg1) {
  const ret = getStringFromWasm0(arg0, arg1);
  return addHeapObject(ret);
};

module.exports.__wbindgen_jsval_loose_eq = function (arg0, arg1) {
  const ret = getObject(arg0) == getObject(arg1);
  _assertBoolean(ret);
  return ret;
};

module.exports.__wbindgen_object_clone_ref = function (arg0) {
  const ret = getObject(arg0);
  return addHeapObject(ret);
};

module.exports.__wbindgen_bigint_from_u128 = function (arg0, arg1) {
  const ret =
    (BigInt.asUintN(64, arg0) << BigInt(64)) | BigInt.asUintN(64, arg1);
  return addHeapObject(ret);
};

module.exports.__wbg_String_88810dfeb4021902 = function () {
  return logError(function (arg0, arg1) {
    const ret = String(getObject(arg1));
    const ptr1 = passStringToWasm0(
      ret,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc,
    );
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
  }, arguments);
};

module.exports.__wbg_getwithrefkey_5e6d9547403deab8 = function () {
  return logError(function (arg0, arg1) {
    const ret = getObject(arg0)[getObject(arg1)];
    return addHeapObject(ret);
  }, arguments);
};

module.exports.__wbg_set_841ac57cff3d672b = function () {
  return logError(function (arg0, arg1, arg2) {
    getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
  }, arguments);
};

module.exports.__wbg_new_898a68150f225f2e = function () {
  return logError(function () {
    const ret = [];
    return addHeapObject(ret);
  }, arguments);
};

module.exports.__wbg_get_44be0491f933a435 = function () {
  return logError(function (arg0, arg1) {
    const ret = getObject(arg0)[arg1 >>> 0];
    return addHeapObject(ret);
  }, arguments);
};

module.exports.__wbg_set_502d29070ea18557 = function () {
  return logError(function (arg0, arg1, arg2) {
    getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
  }, arguments);
};

module.exports.__wbg_isArray_4c24b343cb13cfb1 = function () {
  return logError(function (arg0) {
    const ret = Array.isArray(getObject(arg0));
    _assertBoolean(ret);
    return ret;
  }, arguments);
};

module.exports.__wbg_length_fff51ee6522a1a18 = function () {
  return logError(function (arg0) {
    const ret = getObject(arg0).length;
    _assertNum(ret);
    return ret;
  }, arguments);
};

module.exports.__wbg_instanceof_ArrayBuffer_39ac22089b74fddb = function () {
  return logError(function (arg0) {
    let result;
    try {
      result = getObject(arg0) instanceof ArrayBuffer;
    } catch {
      result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
  }, arguments);
};

module.exports.__wbg_call_cb65541d95d71282 = function () {
  return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
  }, arguments);
};

module.exports.__wbg_next_ddb3312ca1c4e32a = function () {
  return handleError(function (arg0) {
    const ret = getObject(arg0).next();
    return addHeapObject(ret);
  }, arguments);
};

module.exports.__wbg_next_526fc47e980da008 = function () {
  return logError(function (arg0) {
    const ret = getObject(arg0).next;
    return addHeapObject(ret);
  }, arguments);
};

module.exports.__wbg_done_5c1f01fb660d73b5 = function () {
  return logError(function (arg0) {
    const ret = getObject(arg0).done;
    _assertBoolean(ret);
    return ret;
  }, arguments);
};

module.exports.__wbg_value_1695675138684bd5 = function () {
  return logError(function (arg0) {
    const ret = getObject(arg0).value;
    return addHeapObject(ret);
  }, arguments);
};

module.exports.__wbg_isSafeInteger_bb8e18dd21c97288 = function () {
  return logError(function (arg0) {
    const ret = Number.isSafeInteger(getObject(arg0));
    _assertBoolean(ret);
    return ret;
  }, arguments);
};

module.exports.__wbg_entries_e51f29c7bba0c054 = function () {
  return logError(function (arg0) {
    const ret = Object.entries(getObject(arg0));
    return addHeapObject(ret);
  }, arguments);
};

module.exports.__wbg_new_b51585de1b234aff = function () {
  return logError(function () {
    const ret = new Object();
    return addHeapObject(ret);
  }, arguments);
};

module.exports.__wbg_iterator_97f0c81209c6c35a = function () {
  return logError(function () {
    const ret = Symbol.iterator;
    return addHeapObject(ret);
  }, arguments);
};

module.exports.__wbg_instanceof_Uint8Array_d8d9cb2b8e8ac1d4 = function () {
  return logError(function (arg0) {
    let result;
    try {
      result = getObject(arg0) instanceof Uint8Array;
    } catch {
      result = false;
    }
    const ret = result;
    _assertBoolean(ret);
    return ret;
  }, arguments);
};

module.exports.__wbg_new_8125e318e6245eed = function () {
  return logError(function (arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
  }, arguments);
};

module.exports.__wbg_length_72e2208bbc0efc61 = function () {
  return logError(function (arg0) {
    const ret = getObject(arg0).length;
    _assertNum(ret);
    return ret;
  }, arguments);
};

module.exports.__wbg_set_5cf90238115182c3 = function () {
  return logError(function (arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
  }, arguments);
};

module.exports.__wbindgen_is_function = function (arg0) {
  const ret = typeof getObject(arg0) === 'function';
  _assertBoolean(ret);
  return ret;
};

module.exports.__wbindgen_object_drop_ref = function (arg0) {
  takeObject(arg0);
};

module.exports.__wbg_get_97b561fb56f034b5 = function () {
  return handleError(function (arg0, arg1) {
    const ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
  }, arguments);
};

module.exports.__wbg_buffer_085ec1f694018c4f = function () {
  return logError(function (arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
  }, arguments);
};

module.exports.__wbindgen_debug_string = function (arg0, arg1) {
  const ret = debugString(getObject(arg1));
  const ptr1 = passStringToWasm0(
    ret,
    wasm.__wbindgen_malloc,
    wasm.__wbindgen_realloc,
  );
  const len1 = WASM_VECTOR_LEN;
  getInt32Memory0()[arg0 / 4 + 1] = len1;
  getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};

module.exports.__wbindgen_bigint_get_as_i64 = function (arg0, arg1) {
  const v = getObject(arg1);
  const ret = typeof v === 'bigint' ? v : undefined;
  if (!isLikeNone(ret)) {
    _assertBigInt(ret);
  }
  getBigInt64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? BigInt(0) : ret;
  getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
};

module.exports.__wbindgen_throw = function (arg0, arg1) {
  throw new Error(getStringFromWasm0(arg0, arg1));
};

module.exports.__wbindgen_memory = function () {
  const ret = wasm.memory;
  return addHeapObject(ret);
};

const path = require('path').join(__dirname, 'move_bytecode_template_bg.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;

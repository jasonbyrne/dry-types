import * as date from "./date";
import * as currency from "./currency";
import * as number from "./number";
import * as string from "./string";
import * as util from "./util";
import * as object from "./object";
import * as array from "./array";
import * as is from "./is";
import * as regex from "./regex";
import * as random from "./random";
import * as hash from "./hash";
import * as enumModule from "./enum";
import * as password from "./password";
import * as address from "./address";
import * as phone from "./phone";
import * as url from "./url";

// Export all types
export * from "./generics";
export * from "./enum";

// Export all functions as named exports
export * from "./date";
export * from "./currency";
export * from "./number";
export * from "./string";
export * from "./util";
export * from "./object";
export * from "./array";
export * from "./is";
export * from "./regex";
export * from "./random";
export * from "./hash";
export * from "./enum";
export * from "./password";
export * from "./address";
export * from "./phone";
export * from "./url";

// Default export for convenience
const dry = {
  ...date,
  ...currency,
  ...number,
  ...string,
  ...util,
  ...object,
  ...array,
  ...is,
  ...regex,
  ...random,
  ...hash,
  ...enumModule,
  ...password,
  ...address,
  ...phone,
  ...url,
};

export default dry;

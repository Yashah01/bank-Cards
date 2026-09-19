/**
 * CardSphere India - Comprehensive Master Card Database
 * Aggregates all verified retail credit cards from the Comprehensive Card Directory (Master Extract)
 * 135 distinct base products across 15+ premier banking issuers in India.
 */

import { HDFC_CARDS } from './cards/hdfc.js';
import { SBI_CARDS } from './cards/sbi.js';
import { AXIS_CARDS } from './cards/axis.js';
import { ICICI_CARDS } from './cards/icici.js';
import { IDFC_CARDS } from './cards/idfc.js';
import { KOTAK_CARDS } from './cards/kotak.js';
import { INDUSIND_CARDS } from './cards/indusind.js';
import { AMEX_CARDS } from './cards/amex.js';
import { SC_CARDS } from './cards/sc.js';
import { RBL_CARDS } from './cards/rbl.js';
import { YES_CARDS } from './cards/yes.js';
import { AU_CARDS } from './cards/au.js';
import { BOB_CARDS } from './cards/bob.js';
import { HSBC_FEDERAL_OTHERS_CARDS } from './cards/hsbc_federal_others.js';

export const CARDS = [
  ...HDFC_CARDS,
  ...SBI_CARDS,
  ...AXIS_CARDS,
  ...ICICI_CARDS,
  ...IDFC_CARDS,
  ...KOTAK_CARDS,
  ...INDUSIND_CARDS,
  ...AMEX_CARDS,
  ...SC_CARDS,
  ...RBL_CARDS,
  ...YES_CARDS,
  ...AU_CARDS,
  ...BOB_CARDS,
  ...HSBC_FEDERAL_OTHERS_CARDS
];

/*
 * SPDX-FileCopyrightText: Fedired
 * SPDX-License-Identifier: AGPL-3.0-only
 */


import { secureRndstr } from '@/misc/secure-rndstr.js';

// eslint-disable-next-line import/no-default-export
export default () => secureRndstr(16);

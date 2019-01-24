import fp from 'lodash/fp';
import { curryDb } from '../../../lib/connect'
import { attachModels } from '../lib/attachModels'
import { prettyReply } from '../../../lib/response-lib'
export const provideDb = fp.compose(curryDb, attachModels, prettyReply);

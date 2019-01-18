import fp from 'lodash/fp';
import { curryDb } from '../../../lib/connect'
import { attachModels } from '../lib/attachModels'
export const provideDb = fp.compose(curryDb, attachModels);

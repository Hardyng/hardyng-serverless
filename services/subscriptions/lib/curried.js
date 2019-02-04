import fp from "lodash/fp";
import { curryDb, closeConn } from "../../../lib/connect";
import { attachModels } from "../lib/attachModels";
import { prettyReply } from "../../../lib/response-lib";
import { getUserFromDb } from "./getUserFromDb";
export const provideDb = fp.compose(
  curryDb,
  attachModels,
  prettyReply
);
export const provideLoggedUser = fp.compose(getUserFromDb);

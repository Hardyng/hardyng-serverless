async function me({ LoggedUser, User, event, ...props }) {
  return await LoggedUser.populate("subscriptions")
    .populate("topics")
    .execPopulate();
}
export default me;

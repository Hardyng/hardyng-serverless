import { provideDb } from "./lib/curried";
import { getUserFromDb } from "./lib/getUserFromDb";
async function updateTopic({ LoggedUser, Topic, event, ...props }) {
  const query = {
    _id: event.pathParameters.id,
    owner: LoggedUser._id
  };
  const { image, name, description } = JSON.parse(event.body);
  return await Topic.findOneAndUpdate(
    query,
    {
      image,
      name,
      description
    },
    {
      new: true
    }
  );
}
export const handler = provideDb(getUserFromDb(updateTopic));

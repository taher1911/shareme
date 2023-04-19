import { client } from "./client";
import { v4 as uuidv4 } from "uuid";

export const savePin = (id, alreadySaved, userId) => {
  if (!alreadySaved) {
    client
      .patch(id)
      .setIfMissing({ save: [] })
      .insert("after", "save[-1]", [
        {
          _key: uuidv4(),
          userId: userId,
          postedBy: {
            _type: "postedBy",
            _ref: userId,
          },
        },
      ])
      .commit();
  }
};

export const unSave = (pinId, userId, savedArray) => {
  const newArray = savedArray?.filter((el) => el.postedBy._id !== userId);

  client.patch(pinId).set({ save: newArray }).commit();
};

export const deletePin = (id) => {
  client.delete(id).then(() => {
    window.location.reload();
  });
};

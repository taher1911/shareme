import React, { useState, useEffect } from "react";

import { userSavedPinsQuery } from "../../utils/data";
import { fetchUser } from "../../utils/fetchUser";
import { client } from "../../sanity/client";

import MasonryLayout from "./MasonryLayout";
import Loading from "../Loading/Loading";

const SavedPins = () => {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = fetchUser();

  useEffect(() => {
    const query = userSavedPinsQuery(user.sub);
    client.fetch(query).then((data) => {
      setPins(data);
      setLoading(false);
    });
  }, [user?.sub]);

  return (
    <div>
      {loading && <Loading message={"Loading..."} />}

      {!loading && pins?.length === 0 && (
        <p className="text-center text-xl font-md">No Saved Images.</p>
      )}
      {pins?.length > 0 && <MasonryLayout pins={pins} />}
    </div>
  );
};

export default SavedPins;

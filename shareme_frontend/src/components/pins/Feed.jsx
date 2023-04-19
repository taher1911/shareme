import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { client } from "../../sanity/client";
import { searchQuery, feedQuery } from "../../utils/data";
import MasonryLayout from "./MasonryLayout";
import Loading from "../Loading/Loading";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      const query = searchQuery(categoryId);

      client
        .fetch(query)
        .then((data) => {
          setPins(data);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    } else {
      client
        .fetch(feedQuery)
        .then((data) => {
          setPins(data);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, [categoryId]);

  if (loading)
    return (
      <Loading main={false} message="We are adding new ideas to your feed!" />
    );
  return (
    <div id="content_container">
      {pins?.length === 0 && (
        <p className="capitalize text-center">there is no images yet.</p>
      )}
      {pins && <MasonryLayout pins={pins} />}
    </div>
  );
};

export default Feed;

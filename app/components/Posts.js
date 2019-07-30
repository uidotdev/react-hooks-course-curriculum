import React from "react";
import PropTypes from "prop-types";
import { fetchMainPosts } from "../utils/api";
import Loading from "./Loading";
import PostsList from "./PostsList";

const reducer = (state, action) => {
  if (action.type == "loading") {
    return {
      posts: null,
      error: null,
      loading: true
    };
  } else if (action.type == "success") {
    return {
      posts: action.posts,
      loading: false,
      error: null
    };
  } else if (action.type == "error") {
    return {
      ...state,
      error: action.message,
      loading: false
    };
  } else {
    throw new Error("Action type not implemented");
  }
};

const initialState = {
  posts: null,
  error: null,
  loading: true
};

export default function Posts(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { posts, error, loading } = state;
  const { type } = props;

  React.useEffect(() => {
    dispatch({ type: "loading" });

    fetchMainPosts(type)
      .then(posts => dispatch({ type: "success", posts }))
      .catch(({ message }) => dispatch({ type: "error", message }));
  }, [type]);

  if (loading === true) {
    return <Loading />;
  }

  if (error) {
    return <p className="center-text error">{error}</p>;
  }

  return <PostsList posts={posts} />;
}

Posts.propTypes = {
  type: PropTypes.oneOf(["top", "new"])
};

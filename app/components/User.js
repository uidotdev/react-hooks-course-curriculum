import React from "react";
import queryString from "query-string";
import { fetchUser, fetchPosts } from "../utils/api";
import Loading from "./Loading";
import { formatDate } from "../utils/helpers";
import PostsList from "./PostsList";

const reducer = (state, action) => {
  if (action.type == "user_success") {
    return {
      ...state,
      user: action.user,
      loadingUser: false
    };
  } else if (action.type == "posts_success") {
    return {
      ...state,
      posts: action.posts,
      loadingPosts: false,
      error: null
    };
  } else if (action.type == "error") {
    return {
      ...state,
      error: action.message,
      loadingUser: false,
      loadingPosts: false
    };
  } else {
    throw new Error("Action type not implemented");
  }
};

const initialState = {
  user: null,
  posts: null,
  loadingUser: true,
  loadingPosts: true,
  error: null
};

export default function Post(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { user, posts, loadingUser, loadingPosts, error } = state;
  const { id } = queryString.parse(props.location.search);

  React.useEffect(() => {
    fetchUser(id)
      .then(user => {
        dispatch({ type: "user_success", user });
        return fetchPosts(user.submitted.slice(0, 30));
      })
      .then(posts => dispatch({ type: "posts_success", posts }))
      .catch(({ message }) => dispatch({ type: "error", message }));
  }, [id]);

  if (error) {
    return <p className="center-text error">{error}</p>;
  }

  return (
    <React.Fragment>
      {loadingUser === true ? (
        <Loading text="Fetching User" />
      ) : (
        <React.Fragment>
          <h1 className="header">{user && user.id}</h1>
          <div className="meta-info-light">
            <span>
              joined <b>{user && formatDate(user.created)}</b>
            </span>
            <span>
              has <b>{user && user.karma.toLocaleString()}</b> karma
            </span>
          </div>
          <p dangerouslySetInnerHTML={{ __html: user && user.about }} />
        </React.Fragment>
      )}
      {loadingPosts === true ? (
        loadingUser === false && <Loading text="Fetching posts" />
      ) : (
        <React.Fragment>
          <h2>Posts</h2>
          <PostsList posts={posts} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

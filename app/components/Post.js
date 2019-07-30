import React from "react";
import queryString from "query-string";
import { fetchItem, fetchComments } from "../utils/api";
import Loading from "./Loading";
import PostMetaInfo from "./PostMetaInfo";
import Title from "./Title";
import Comment from "./Comment";

const reducer = (state, action) => {
  if (action.type == "fetch_post_success") {
    return {
      ...state,
      post: action.data,
      loadingPost: false
    };
  } else if (action.type == "fetch_comments_success") {
    return {
      ...state,
      comments: action.data,
      loadingComments: false
    };
  } else if (action.type == "error") {
    this.setState({
      error: message,
      loadingPost: false,
      loadingComments: false
    });
    return {
      ...state,
      error: actionmessage,
      loadingPost: false,
      loadingComments: false
    };
  }
};

const initialState = {
  post: null,
  loadingPost: true,
  comments: null,
  loadingComments: true,
  error: null
};

export default function Post(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    const { id } = queryString.parse(props.location.search);

    fetchItem(id)
      .then(post => {
        dispatch({ type: "fetch_post_success", data: post });
        return fetchComments(post.kids || []);
      })
      .then(comments =>
        dispatch({ type: "fetch_comments_success", data: comments })
      )
      .catch(({ message }) => dispatch({ type: "error", message }));
  }, []);

  const { post, loadingPost, comments, loadingComments, error } = state;

  if (error) {
    return <p className="center-text error">{error}</p>;
  }

  return (
    <React.Fragment>
      {loadingPost === true ? (
        <Loading text="Fetching post" />
      ) : (
        <React.Fragment>
          <h1 className="header">
            <Title url={post.url} title={post.title} id={post.id} />
          </h1>
          <PostMetaInfo
            by={post.by}
            time={post.time}
            id={post.id}
            descendants={post.descendants}
          />
          <p dangerouslySetInnerHTML={{ __html: post.text }} />
        </React.Fragment>
      )}
      {loadingComments === true ? (
        loadingPost === false && <Loading text="Fetching comments" />
      ) : (
        <React.Fragment>
          {comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

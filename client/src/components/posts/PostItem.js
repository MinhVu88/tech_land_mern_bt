import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { postActions } from "../../redux/actions/postActions";

const PostItem = ({
  post: { _id, content, username, userId, avatar, likes, comments, postDate },
  showActions
}) => {
  const dispatch = useDispatch();

  const authLoading = useSelector(state => state.auth.loading);
  const authUserId = useSelector(state => state.auth.user._id);

  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${userId}`}>
          <img className="round-img" src={avatar} alt="" />
          <h4>{username}</h4>
        </Link>
      </div>

      <div>
        <p className="my-1">{content}</p>

        <p className="post-date">
          Posted on <Moment format="YYYY/MM/DD">{postDate}</Moment>
        </p>

        {showActions && (
          <>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => dispatch(postActions.likePostById(_id))}
            >
              <i className="fas fa-thumbs-up"></i>{" "}
              <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
            </button>

            <button
              type="button"
              className="btn btn-light"
              onClick={() => dispatch(postActions.unlikePostById(_id))}
            >
              <i className="fas fa-thumbs-down"></i>
            </button>

            <Link to={`/posts/${_id}`} className="btn btn-primary">
              Discussion{" "}
              {comments.length > 0 && (
                <span className="comment-count">{comments.length}</span>
              )}
            </Link>

            {!authLoading && userId === authUserId && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => dispatch(postActions.deletePostById(_id))}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

PostItem.defaultProps = { showActions: true };

export default PostItem;

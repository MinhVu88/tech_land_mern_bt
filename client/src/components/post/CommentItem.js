import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Moment from "react-moment";
import { postActions } from "../../redux/actions/postActions";

const CommentItem = ({
  postId,
  comment: { _id, content, userId, username, avatar, commentDate }
}) => {
  const dispatch = useDispatch();

  const authLoading = useSelector(state => state.auth.loading);
  const authUserId = useSelector(state => state.auth.user._id);

  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${userId}`}>
          <img className="round-img" src={avatar} alt="pic" />
          <h4>{username}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{content}</p>
        <p className="post-date">
          Posted on <Moment format="YYYY/MM/DD">{commentDate}</Moment>
        </p>
        {!authLoading && userId === authUserId && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => dispatch(postActions.deletePostComment(postId, _id))}
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentItem;

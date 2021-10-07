import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { postActions } from "../../redux/actions/postActions";
import Spinner from "../layout/Spinner";
import PostItem from "../posts/PostItem";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

const Post = () => {
  const dispatch = useDispatch();

  const params = useParams();
  const postIdUrl = params.postId;

  const post = useSelector(state => state.post.post);
  const loading = useSelector(state => state.post.loading);

  useEffect(() => {
    const get_post_by_id = async () =>
      await dispatch(postActions.getPostById(postIdUrl));

    get_post_by_id();
  }, [dispatch]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <>
      <Link to="/posts" className="btn">
        Back to Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postIdUrl={postIdUrl} />
      <div className="comments">
        {post.comments.map(comment => (
          <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </>
  );
};

export default Post;

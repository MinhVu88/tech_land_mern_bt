import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postActions } from "../../redux/actions/postActions";
import Spinner from "../layout/Spinner";
import PostForm from "./PostForm";
import PostItem from "./PostItem";

const Posts = () => {
  const dispatch = useDispatch();

  const posts = useSelector(state => state.post.posts);
  const loading = useSelector(state => state.post.loading);

  useEffect(() => {
    const get_posts = async () => await dispatch(postActions.getPosts());

    get_posts();
  }, [dispatch]);

  return loading ? (
    <Spinner />
  ) : (
    <>
      <h1 className="large text-primary">Posts</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome to Tech Land
      </p>
      <PostForm />
      <div className="posts">
        {posts.map(post => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </>
  );
};

export default Posts;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaUser,
  FaHeart,
  FaRegHeart,
  FaComment,
  FaEdit,
  FaTrash,
  FaEllipsisH,
  FaTimes,
} from "react-icons/fa";
import "./PostCard.css";

const PostCard = ({ post, currentUser, onDelete, onUpdate }) => {
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser?._id));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isAuthor = currentUser?._id === post.author._id;

  const handleLike = async () => {
    if (!currentUser) {
      toast.error("Please login to like posts");
      return;
    }

    try {
      const response = await axios.put(`/api/posts/${post._id}/like`);
      const updatedPost = response.data;
      setIsLiked(updatedPost.likes.includes(currentUser._id));
      setLikeCount(updatedPost.likes.length);
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please login to comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setIsSubmittingComment(true);

    try {
      const response = await axios.post(`/api/posts/${post._id}/comments`, {
        content: newComment.trim(),
      });
      const updatedPost = response.data;
      onUpdate(updatedPost);
      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      const message = error.response?.data?.message || "Failed to add comment";
      toast.error(message);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) {
      toast.error("Post content cannot be empty");
      return;
    }

    setIsSubmittingEdit(true);

    try {
      const response = await axios.put(`/api/posts/${post._id}`, {
        content: editContent.trim(),
      });
      onUpdate(response.data);
      setIsEditing(false);
      toast.success("Post updated successfully!");
    } catch (error) {
      console.error("Error updating post:", error);
      const message = error.response?.data?.message || "Failed to update post";
      toast.error(message);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`/api/posts/${post._id}`);
        onDelete(post._id);
        toast.success("Post deleted successfully!");
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("Failed to delete post");
      }
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author">
          <div className="author-avatar">
            {post.author.profilePicture ? (
              <img src={post.author.profilePicture} alt={post.author.name} />
            ) : (
              <FaUser />
            )}
          </div>
          <div className="author-info">
            <Link to={`/user/${post.author._id}`} className="author-name">
              {post.author.name}
            </Link>
            <span className="post-time">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        {isAuthor && (
          <div className="post-menu">
            <button
              className="menu-button"
              onClick={() => setShowMenu(!showMenu)}
            >
              <FaEllipsisH />
            </button>

            {showMenu && (
              <div className="menu-dropdown">
                <button
                  className="menu-item"
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                >
                  <FaEdit />
                  Edit
                </button>
                <button
                  className="menu-item delete"
                  onClick={() => {
                    handleDelete();
                    setShowMenu(false);
                  }}
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="post-content">
        {isEditing ? (
          <div className="edit-form">
            <textarea
              className="form-control"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows="3"
              maxLength="1000"
            />
            <div className="edit-actions">
              <button
                className="btn btn-primary"
                onClick={handleEdit}
                disabled={isSubmittingEdit}
              >
                {isSubmittingEdit ? "Saving..." : "Save"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(post.content);
                }}
                disabled={isSubmittingEdit}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p>{post.content}</p>
        )}
      </div>

      <div className="post-actions">
        <button
          className={`action-button ${isLiked ? "liked" : ""}`}
          onClick={handleLike}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
          <span>{likeCount}</span>
        </button>

        <button
          className="action-button"
          onClick={() => setShowComments(!showComments)}
        >
          <FaComment />
          <span>{post.comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleComment} className="comment-form">
            <input
              type="text"
              className="form-control"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isSubmittingComment}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmittingComment || !newComment.trim()}
            >
              {isSubmittingComment ? "Posting..." : "Post"}
            </button>
          </form>

          <div className="comments-list">
            {post.comments.length === 0 ? (
              <p className="no-comments">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              post.comments.map((comment, index) => (
                <div key={index} className="comment">
                  <div className="comment-author">
                    <div className="comment-avatar">
                      {comment.user.profilePicture ? (
                        <img
                          src={comment.user.profilePicture}
                          alt={comment.user.name}
                        />
                      ) : (
                        <FaUser />
                      )}
                    </div>
                    <div className="comment-info">
                      <Link
                        to={`/user/${comment.user._id}`}
                        className="comment-author-name"
                      >
                        {comment.user.name}
                      </Link>
                      <span className="comment-time">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;

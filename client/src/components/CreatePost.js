import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUser, FaPaperPlane } from "react-icons/fa";
import "./CreatePost.css";

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Please enter some content");
      return;
    }

    if (content.length > 1000) {
      toast.error("Post content cannot exceed 1000 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/posts", {
        content: content.trim(),
      });
      const newPost = response.data;

      setContent("");
      onPostCreated(newPost);
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      const message = error.response?.data?.message || "Failed to create post";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post">
      <div className="create-post-header">
        <div className="user-avatar">
          {user.profilePicture ? (
            <img src={user.profilePicture} alt={user.name} />
          ) : (
            <FaUser />
          )}
        </div>
        <div className="user-info">
          <h4>{user.name}</h4>
          <span className="user-email">{user.email}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <textarea
            className="form-control post-textarea"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="3"
            maxLength="1000"
            disabled={isSubmitting}
          />
          <div className="character-count">{content.length}/1000</div>
        </div>

        <div className="create-post-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? (
              "Posting..."
            ) : (
              <>
                <FaPaperPlane />
                Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;

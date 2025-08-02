import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import axios from "axios";
import toast from "react-hot-toast";
import "./Home.css";

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (page = 1) => {
    try {
      const response = await axios.get(`/api/posts?page=${page}&limit=10`);
      const { posts: newPosts, totalPages } = response.data;

      if (page === 1) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }

      setHasMore(page < totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post._id !== postId));
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts((prev) =>
      prev.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  const loadMorePosts = () => {
    if (!loading && hasMore) {
      fetchPosts(currentPage + 1);
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="container">
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="container">
        <div className="home-content">
          <div className="main-feed">
            {user && <CreatePost onPostCreated={handleCreatePost} />}

            <div className="posts-section">
              {posts.length === 0 ? (
                <div className="no-posts">
                  <h3>No posts yet</h3>
                  <p>Be the first to share something with the community!</p>
                </div>
              ) : (
                <>
                  {posts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      currentUser={user}
                      onDelete={handleDeletePost}
                      onUpdate={handleUpdatePost}
                    />
                  ))}

                  {hasMore && (
                    <div className="load-more">
                      <button
                        className="btn btn-secondary"
                        onClick={loadMorePosts}
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Load More Posts"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

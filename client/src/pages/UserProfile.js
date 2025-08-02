import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import PostCard from "../components/PostCard";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUser, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";
import "./Profile.css";

const UserProfile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/users/${id}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user profile");
    } finally {
      setUserLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`/api/users/${id}/posts`);
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <div className="error">
          <h2>User not found</h2>
          <p>The user you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="container">
        <div className="profile-content">
          <div className="profile-header">
            <div className="profile-card">
              <div className="profile-avatar">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} />
                ) : (
                  <FaUser />
                )}
              </div>

              <div className="profile-info">
                <h1 className="profile-name">{user.name}</h1>
                <p className="profile-email">{user.email}</p>

                {user.bio && <p className="profile-bio">{user.bio}</p>}

                <div className="profile-details">
                  {user.location && (
                    <div className="profile-detail">
                      <FaMapMarkerAlt />
                      <span>{user.location}</span>
                    </div>
                  )}

                  {user.website && (
                    <div className="profile-detail">
                      <FaGlobe />
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {user.website}
                      </a>
                    </div>
                  )}
                </div>

                <div className="profile-stats">
                  <div className="stat">
                    <span className="stat-number">{posts.length}</span>
                    <span className="stat-label">Posts</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">
                      {new Date(user.createdAt).getFullYear()}
                    </span>
                    <span className="stat-label">Joined</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-posts">
            <h2>
              {user.name}'s Posts ({posts.length})
            </h2>

            {loading ? (
              <div className="loading">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="no-posts">
                <h3>No posts yet</h3>
                <p>{user.name} hasn't shared any posts yet.</p>
              </div>
            ) : (
              <div className="posts-list">
                {posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    currentUser={currentUser}
                    onDelete={() => {}} // Can't delete other users' posts
                    onUpdate={(updatedPost) => {
                      setPosts((prev) =>
                        prev.map((post) =>
                          post._id === updatedPost._id ? updatedPost : post
                        )
                      );
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

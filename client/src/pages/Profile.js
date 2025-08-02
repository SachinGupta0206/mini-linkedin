import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import PostCard from "../components/PostCard";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEdit,
  FaMapMarkerAlt,
  FaGlobe,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import "./Profile.css";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
  });

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`/api/users/${user._id}/posts`);
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditData({
      name: user.name,
      bio: user.bio || "",
      location: user.location || "",
      website: user.website || "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const result = await updateProfile(editData);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user.name,
      bio: user.bio || "",
      location: user.location || "",
      website: user.website || "",
    });
  };

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post._id !== postId));
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts((prev) =>
      prev.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading profile...</div>
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
                {isEditing ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editData.name}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        maxLength="50"
                      />
                    </div>

                    <div className="form-group">
                      <label>Bio</label>
                      <textarea
                        className="form-control"
                        value={editData.bio}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        rows="3"
                        maxLength="500"
                        placeholder="Tell us about yourself..."
                      />
                      <div className="character-count">
                        {editData.bio.length}/500
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Location</label>
                      <div className="input-group">
                        <FaMapMarkerAlt className="input-icon" />
                        <input
                          type="text"
                          className="form-control"
                          value={editData.location}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          maxLength="100"
                          placeholder="Enter your location"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Website</label>
                      <div className="input-group">
                        <FaGlobe className="input-icon" />
                        <input
                          type="url"
                          className="form-control"
                          value={editData.website}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              website: e.target.value,
                            }))
                          }
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>

                    <div className="edit-actions">
                      <button className="btn btn-primary" onClick={handleSave}>
                        <FaSave />
                        Save Changes
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={handleCancel}
                      >
                        <FaTimes />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
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

                    <button
                      className="btn btn-secondary edit-button"
                      onClick={handleEdit}
                    >
                      <FaEdit />
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="profile-posts">
            <h2>Your Posts ({posts.length})</h2>

            {posts.length === 0 ? (
              <div className="no-posts">
                <h3>No posts yet</h3>
                <p>Start sharing your thoughts with the community!</p>
              </div>
            ) : (
              <div className="posts-list">
                {posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    currentUser={user}
                    onDelete={handleDeletePost}
                    onUpdate={handleUpdatePost}
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

export default Profile;

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Card from '../components/common/Card';
import authService from '../services/authService';
import { FaUser, FaEdit, FaCamera } from 'react-icons/fa';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: '',
    address: '',
    profilePicture: user?.profilePicture || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(user?.profilePicture || '');

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        profilePicture: user.profilePicture || ''
      });
      setImagePreview(user.profilePicture || '');
    }
  }, [user]);

  // Compress image to reduce size
  const compressImage = (file, maxWidth = 400, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxWidth) {
              width *= maxWidth / height;
              height = maxWidth;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB before compression)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('❌ Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setMessage('❌ Please select an image file');
        return;
      }

      try {
        // Compress image
        const compressedImage = await compressImage(file);
        setImagePreview(compressedImage);
        setUserData({ ...userData, profilePicture: compressedImage });
        setMessage('');
      } catch (error) {
        setMessage('❌ Error processing image');
        console.error('Image compression error:', error);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Create update object with only changed fields
      const updateData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        address: userData.address
      };

      // Add profile picture if changed
      if (userData.profilePicture !== user?.profilePicture) {
        updateData.profilePicture = userData.profilePicture;
      }

      const response = await authService.updateProfile(updateData);
      
      // Update local user context
      if (setUser) {
        setUser({ ...user, ...response.data });
      }

      setMessage('✅ Profile updated successfully!');
      setEditing(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Update error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Error updating profile';
      setMessage('❌ ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original user data
    setUserData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      address: user?.address || '',
      profilePicture: user?.profilePicture || ''
    });
    setImagePreview(user?.profilePicture || '');
    setEditing(false);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaUser className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                  <p className="text-gray-600 mt-1">Manage your profile information</p>
                </div>
              </div>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaEdit size={16} />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg border ${
                message.includes('✅') 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {message}
              </div>
            )}

            {/* Profile Card */}
            <Card className="mb-6">
              <div className="p-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </div>
                    )}
                  </div>
                  
                  {editing && (
                    <div>
                      <label htmlFor="profileImage" className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <FaCamera size={16} />
                        Change Photo
                      </label>
                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500 mt-2">Max 5MB • Will be compressed</p>
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                {!editing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">First Name</p>
                        <p className="text-lg font-semibold text-gray-900">{userData.firstName || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Last Name</p>
                        <p className="text-lg font-semibold text-gray-900">{userData.lastName || 'Not set'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="text-lg font-semibold text-gray-900">{userData.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Role</p>
                      <p className="text-lg font-semibold text-gray-900 capitalize">{user?.role}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                      <p className="text-lg font-semibold text-gray-900">{userData.phoneNumber || 'Not set'}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Address</p>
                      <p className="text-lg font-semibold text-gray-900">{userData.address || 'Not set'}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={userData.firstName}
                          onChange={e => setUserData({ ...userData, firstName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={userData.lastName}
                          onChange={e => setUserData({ ...userData, lastName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={userData.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={userData.phoneNumber}
                        onChange={e => setUserData({ ...userData, phoneNumber: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+212 6XX XXX XXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <textarea
                        value={userData.address}
                        onChange={e => setUserData({ ...userData, address: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your address"
                        rows="3"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
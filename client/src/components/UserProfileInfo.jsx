import { Calendar, MapPin, PenBox, Verified } from 'lucide-react';
import moment from 'moment';
import React from 'react';
import { useUser } from '@clerk/clerk-react';

const UserProfileInfo = ({ user, posts, profileId, setShowEdit }) => {
  const { user: currentUser } = useUser();
  const isOwnProfile = !profileId || profileId === currentUser?.id;

  // Format numbers with K/M suffixes
  const formatCount = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count;
  };

  return (
    <div className="relative py-6 px-6 md:px-10 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row items-start gap-8">

        {/* Profile Picture */}
        <div className="w-32 h-32 border-4 border-white shadow-lg absolute -top-16 left-6 md:left-10 rounded-full overflow-hidden">
          <img
            src={user.profile_picture || user.imageUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main User Info */}
        <div className="w-full flex flex-col pt-20 md:pt-0 md:pl-40">

          <div className="flex flex-col md:flex-row items-start justify-between w-full">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.full_name || user.fullName}
                </h1>
                {(user.is_verified || user.verified) && (
                  <Verified className="w-6 h-6 text-purple-500" />
                )}
              </div>

              <p className="text-gray-600 text-sm">
                {user.username ? `@${user.username}` : 'Add username'}
              </p>
            </div>

            {/* Edit button for profile owner */}
            {isOwnProfile && (
              <button
                onClick={() => setShowEdit(true)}
                className="mt-4 md:mt-0 bg-purple-500 cursor-pointer flex items-center gap-2 py-2 px-4 rounded-full text-white border border-purple-600 hover:bg-purple-600 transition-colors"
              >
                <PenBox className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Bio + Metadata */}
          <div className="mt-6">
            <p className="text-gray-800 text-sm whitespace-pre-line">
              {user.bio || (isOwnProfile ? 'No bio added. Click edit to add one!' : 'No bio yet')}
            </p>

            <div className="flex flex-wrap items-center gap-x-8 mt-4 text-sm text-gray-500">
              {user.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </span>
              )}

              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Joined {moment(user.createdAt || user.created_at).fromNow()}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-10 mt-6 pt-4 border-t border-purple-200">
            <div className="text-center">
              <span className="text-lg font-bold text-gray-900">{formatCount(posts.length)}</span>
              <span className="text-xs ml-1 text-gray-600">Posts</span>
            </div>

            <div className="text-center">
              <span className="text-lg font-bold text-gray-900">
                {formatCount(user.followers?.length || 0)}
              </span>
              <span className="text-xs ml-1 text-gray-600">Followers</span>
            </div>

            <div className="text-center">
              <span className="text-lg font-bold text-gray-900">
                {formatCount(user.following?.length || 0)}
              </span>
              <span className="text-xs ml-1 text-gray-600">Following</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfileInfo;
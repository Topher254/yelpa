import React, { useState } from 'react'
import { Pencil } from 'lucide-react';
import { userService } from '../services/userService';
import toast from 'react-hot-toast';

const ProfileModal = ({ setShowEdit, user, onProfileUpdate }) => {
    const [editForm, setEditForm] = useState({
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        profile_picture: null,
        cover_photo: null,
        full_name: user.full_name || ''
    });
    const [loading, setLoading] = useState(false);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            // Prepare form data for file upload
            const formData = new FormData();
            formData.append('username', editForm.username);
            formData.append('bio', editForm.bio);
            formData.append('location', editForm.location);
            formData.append('full_name', editForm.full_name);
            
            if (editForm.profile_picture) {
                formData.append('profile_picture', editForm.profile_picture);
            }
            if (editForm.cover_photo) {
                formData.append('cover_photo', editForm.cover_photo);
            }

            await userService.updateUserProfile(user._id, formData);
            toast.success('Profile updated successfully!');
            onProfileUpdate();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 sm:p-8'>
                <h1 className='text-2xl font-bold text-gray-900 mb-6'>Edit Profile</h1>
                <form className='space-y-6' onSubmit={handleSaveProfile}>

                    {/* Profile Picture */}
                    <div className='flex items-center gap-4'>
                        <div className='relative group'>
                            <img 
                                src={editForm.profile_picture ? URL.createObjectURL(editForm.profile_picture) : user.profile_picture} 
                                className='w-24 h-24 rounded-full object-cover border-2 border-purple-500 shadow-md'
                                alt="Profile"
                            />
                            <div className='absolute bottom-0 right-0 bg-purple-500 p-1 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition'>
                                <Pencil className='w-4 h-4 text-white'/>
                            </div>
                            <input 
                                type='file' 
                                accept='image/*' 
                                id='profile_picture' 
                                className='absolute inset-0 opacity-0 cursor-pointer rounded-full' 
                                onChange={(e) => setEditForm({ ...editForm, profile_picture: e.target.files[0] })} 
                            />
                        </div>
                        <div className='flex flex-col'>
                            <p className='font-semibold text-gray-700'>{user.full_name}</p>
                            <p className='text-gray-500 text-sm'>@{user.username}</p>
                        </div>
                    </div>

                    {/* Cover Photo */}
                    <div className='relative group'>
                        <img 
                            src={editForm.cover_photo ? URL.createObjectURL(editForm.cover_photo) : user.cover_photo} 
                            className='w-full h-40 object-cover rounded-lg border border-gray-200 shadow-sm'
                            alt="Cover"
                        />
                        <div className='absolute top-2 right-2 bg-purple-500 p-1 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition'>
                            <Pencil className='w-5 h-5 text-white'/>
                        </div>
                        <input 
                            type='file' 
                            accept='image/*' 
                            id='cover_photo' 
                            className='absolute inset-0 opacity-0 cursor-pointer rounded-lg' 
                            onChange={(e) => setEditForm({ ...editForm, cover_photo: e.target.files[0] })} 
                        />
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className='block text-gray-700 font-medium mb-1'>
                            Full Name
                        </label>
                        <input 
                            type='text' 
                            placeholder='Enter full name' 
                            className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500' 
                            value={editForm.full_name}
                            onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className='block text-gray-700 font-medium mb-1'>
                            Username
                        </label>
                        <input 
                            type='text' 
                            placeholder='Enter username' 
                            className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500' 
                            value={editForm.username}
                            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className='block text-gray-700 font-medium mb-1'>
                            Bio
                        </label>
                        <textarea 
                            rows={3} 
                            placeholder='Enter bio' 
                            className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none' 
                            value={editForm.bio}
                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className='block text-gray-700 font-medium mb-1'>
                            Location
                        </label>
                        <input 
                            type='text' 
                            placeholder='Enter location' 
                            className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500' 
                            value={editForm.location}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        />
                    </div>

                    {/* Buttons */}
                    <div className='flex justify-end gap-4 mt-4'>
                        <button 
                            type='button' 
                            onClick={() => setShowEdit(false)} 
                            className='bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full transition disabled:opacity-50'
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type='submit' 
                            className='bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-full transition disabled:opacity-50'
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default ProfileModal;
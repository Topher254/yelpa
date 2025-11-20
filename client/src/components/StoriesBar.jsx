import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react';
import moment from 'moment'
import StoryModel from './StoryModel';
import StoryViewer from './StoryViewer';
import { storyService } from '../services/storyService';

const StoriesBar = () => {
    const [stories, setStories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [viewStory, setViewStory] = useState(null);

    const fetchStories = async () => {
        try {
            const response = await storyService.getStories();
            // Flatten the grouped stories
            const allStories = response.flatMap(group => group.stories || []);
            setStories(allStories);
        } catch (error) {
            console.error('Error fetching stories:', error);
            setStories([]);
        }
    }

    useEffect(() => {
        fetchStories();
    }, [])

    const handleStoryCreated = () => {
        fetchStories(); // Refresh stories after creating a new one
        setShowModal(false);
    }

    return (
        <div className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4'>
            <div className='flex gap-4 pb-5'>
                {/* ADD STORY CARD */}
                <div onClick={() => { setShowModal(true) }} className='rounded-lg shadow-sm min-w-30 max-w-30 max-h-40 aspect-3/4 cursor-pointer hover:shadow-lg
        transition-all duration-300 border-2 border-dashed border-purple-500 bg-linear-to-b from-purple-100 to-white'>
                    <div className='h-full flex flex-col items-center justify-center'>
                        <div className='size-10 bg-purple-500 rounded-full flex items-center justify-center mb-3'>
                            <Plus className='w-5 h-5 text-white' />
                        </div>
                        <p className='text-sm font-medium text-slate-700 text-center'>Create a Yelp</p>
                    </div>
                </div>
                {/* story cards */}
                {
                    stories.map((story, index) => (
                        <div onClick={() => { setViewStory(story) }} key={story._id} className={` p-2 relative rounded-lg shadow min-w-30 max-h-40 cursor-pointer
                        hover:shadow-lg transition-all duration-200 bg-linear-to-b from-purple-500 to-purple-600 active:scale-95`}>
                            <img src={story.user?.profile_picture} alt='image' className='absolute size-8 top-3 left-3text-white  z-10 rounded-full ring ring-gray-100 shadow' />
                            <p className='absolute top-18 left-3 text-white  text-sm truncate max-w-24'>{story.content}</p>
                            <p className='absolute bottom-1 text-white right-2 z-10 text-xs'>{moment(story.createdAt).fromNow()}</p>

                            {
                                story.media_type !== 'text' && (
                                    <div className='absolute inset-0 rounded-lg bg-black overflow-hidden'>
                                        {story.media_type === 'image' ?
                                            <img src={story.media_url} alt='story image' className='h-full w-full object-cover hover:scale-110 transition
                             duration-500 opacity-70 hover:opacity-80 rounded-lg' />
                                            :
                                            <video src={story.media_url} className='h-full w-full object-cover hover:scale-110 transition
                             duration-500 opacity-70 hover:opacity-80 rounded-lg' />
                                        }
                                    </div>
                                )
                            }
                        </div>
                    ))
                }
            </div>
            {/* add story modal */}
            {
                showModal && <StoryModel setShowModal={setShowModal} onStoryCreated={handleStoryCreated} />
            }
            {/* display story */}
            {
                viewStory && <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />
            }
        </div>
    )
}

export default StoriesBar
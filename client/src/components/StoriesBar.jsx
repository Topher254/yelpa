import React, { useEffect, useState } from 'react'
import { dummyStoriesData } from '../assets/assets';
import { Plus } from 'lucide-react';
import moment from 'moment'
import StoryModel from './StoryModel';

const StoriesBar = () => {
    const [stories, setStories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [viewStory, setViewStory] = useState(null);


    const fetchStories = async () => {
        setStories(dummyStoriesData)
    }


    useEffect(() => {
        fetchStories();
    }, [])
    return (
        <div className='w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4'>
            <div className='flex gap-4 pb-5'>
                {/* ADDD STORY CAR */}
                <div onClick={()=>{setShowModal(true)}} className='rounded-lg shadow-sm min-w-30 max-w-30 max-h-40 aspect-3/4 cursor-pointer hover:shadow-lg
        transition-all duration-300 border-2 border-dashed border-blue-500 bg-linear-to-b from-blue-100 to-white'>
                    <div className='h-full flex flex-col items-center justify-center'>
                        <div className='size-10 bg-blue-500 rounded-full flex items-center justify-center mb-3'>
                            <Plus className='w-5 h-5 text-white' />
                        </div>
                        <p className='text-sm font-medium text-slate-700 text-center'>Create a Yelp</p>

                    </div>

                </div>
                {/* story cards */}
                {
                    stories.map((story, index) => (
                        <div key={index} className={` p-2 relative rounded-lg shadow min-w-30 max-h-40 cursor-pointer
                        hover:shadow-lg transition-all duration-200 bg-linear-to-b from-blue-500 to-indigo-600 active:scale-95`}>
                            <img src={story.user.profile_picture} alt='image' className='absolute size-8 top-3 left-3text-white  z-10 rounded-full ring ring-gray-100 shadow' />
                            <p className='absolute top-18 left-3 text-white  text-sm truncate max-w-24'>{story.content}</p>
                            <p className='absolute bottom-1 text-white right-2 z-10 text-xs'>{moment(story.createdAt).fromNow()}</p>

                            {
                                story.media_type !== 'text' && (
                                    <div className='absolute inset-0 rounded-lg bg-black overflow-hidden'>
                                        {story.media_type === 'image' ?
                                            <img src={story.media_url} alt='story image' className='h-full w-full object-cover hover:scale-110 transition
                             duration-500 opacity-70 hover:opacity-80 rounded-lg'/>
                                            :
                                            <video src={story.media_url} className='h-full w-full object-cover hover:scale-110 transition
                             duration-500 opacity-70 hover:opacity-80 rounded-lg'/>
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
showModal&&<StoryModel setShowModal={setShowModal} fetchStories={fetchStories}/>
            }
        </div>
    )
}

export default StoriesBar

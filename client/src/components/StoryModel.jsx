import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react'

const StoryModel = ({ setShowModal, fetchStories }) => {
    const bgColors = [
        "#FF5A5F", // red
        "#007AFF", // blue
        "#34C759", // green
        "#FF9500", // orange
        "#AF52DE", // purple
        "#FF2D55",  // pink,
        "#000000"
    ];


    const [mode, setMode] = useState('text');
    const [background, setBackground] = useState(bgColors[0]);
    const [text, setText] = useState('')
    const [media, setMedia] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)



    const handleMediaUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setMedia(file);
            setPreviewUrl(URL.createObjectURL(file))

        }
    };


    const handleCreateStory = async () => {

    }



    return (
        <div className='fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4'>
            <div className='w-full max-w-md'>
                <div className='text-center mb-4 flex items-center justify-between'>
                    <button onClick={() => { setShowModal(false) }} className='text-white p-2 cursor-pointer'><ArrowLeft /></button>
                    <h2 className='text-lg font-semibold'>Create a Yelp</h2>
                    <span className='w-10'></span>
                </div>
                <div className='rounded-lg h-96 flex items-center justify-center relative' style={{ backgroundColor: background }}>
                    {mode === 'text' && (
                        <textarea name='' className='bg-transaparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none' placeholder='Yelp Here ...'
                            onChange={(e) => { setText(e.target.value) }} value={text}
                        ></textarea>
                    )}

                    {mode === 'media' && previewUrl && (
                        media.type.startsWith('image') ? (
                            <img src={previewUrl} alt="image" className="object-contain max-h-full" />
                        ) : (
                            <video src={previewUrl} className="object-contain max-h-full" controls />
                        )
                    )}


                </div>

                <div className='flex mt-4 gap-2'>
                {bgColors.map((color)=>(
                    <button
                    onClick={()=>{setBackground(color)}}
                     key={color} className='w-6 h-6 rounded-full ring cursor-pointer' style={{backgroundColor:color}}/>
                ))}



                </div>


                <div>
                    
                </div>

            </div>

        </div>
    )
}

export default StoryModel

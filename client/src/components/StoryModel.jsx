import { ArrowLeft, TextIcon, Upload } from 'lucide-react';
import React, { useState } from 'react'
import {toast} from 'react-hot-toast'
import { useNavigate } from 'react-router';
const StoryModel = ({ setShowModal, fetchStories }) => {
    const bgColors = [
        "#FF5A5F", // red
        "#007AFF", // purple
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

    const navigate = useNavigate()



    const handleMediaUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setMedia(file);
            setPreviewUrl(URL.createObjectURL(file))

        }
    };


    const handleCreateStory = async () => {
        try {
            navigate('/')
        } catch (error) {
            toast.error(error.message);
        }

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


                <div className='flex gap-2 mt-4'>
                <button onClick={()=>{setMode('text');setMedia(null);setPreviewUrl(null)}} className={`flex-1 cursor-pointer flex items-center gap-2 p-2 rounded ${mode==='text'?'bg-white text-black':'bg-zinc-800'}`}>
                    <TextIcon size={18}/>Text
                </button>
                    <label className={`flex-1 border border-gray-500 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${mode==='media'?'bg-white text-black':'bg-zinc-800'}`}>
                        <input onChange={(e)=>{handleMediaUpload(e);setMode('media')}} type='file' accept='image/*,video/*' className='hidden'/>
                        <Upload/>Photo/Video
                    </label>
                </div>
               <button className='flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-purple-500 hover:bg-purple-600 active:scale-95 transition cursor-pointer'
                    onClick={()=>toast.promise(handleCreateStory(),{
                        loading:'Saving ...',
                        success:<p>Yelp Added</p>,
                        error:e=><p>{e.message}</p>
                        
                        })} >Post Yelp</button>

            </div>

        </div>
    )
}

export default StoryModel

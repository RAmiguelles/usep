import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Image({url}) {
    const [src,setSrc]=useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(url);
                const data = response.data;
                const imageUrl = data.sprites.versions['generation-v']['black-white'].animated.front_default;
                setSrc(imageUrl);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [url]); 

    return(
        <>
        <img src={src} alt="" srcset="" />
        </>
    )

}

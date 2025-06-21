import React from 'react';
import Navbar from '../components/Navbar';
import Search from '../components/Search';

export default function Home() {
    return (
        <div>
            <Navbar />
            <div className='home-container'>
                <Search />
            </div>
        </div>
    );
}
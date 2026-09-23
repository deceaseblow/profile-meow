import React from 'react';

function Music() {
    return (
        <div>
            <div className="flex justify-center items-center p-4">
                <iframe
                    src="https://open.spotify.com/embed/playlist/5O7Mtyh1zXuLg7pYrhF8sF?utm_source=generator"
                    width="100%"
                    height="380"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-2xl shadow-lg"
                    title="Spotify Playlist"
                ></iframe>
            </div>
            <div className="flex justify-center items-center p-4">
                <iframe
                    src="https://open.spotify.com/embed/playlist/7458BuN8XTzduHceh2A22e?utm_source=generator"
                    width="100%"
                    height="380"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-2xl shadow-lg"
                    title="Spotify Playlist"
                ></iframe>
            </div>
        </div>
    );
}

export default Music;

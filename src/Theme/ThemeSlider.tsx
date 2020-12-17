import React, { useState } from 'react';
import './ThemeSlider.css';
import Heads from '../assets/heads.png'
import Tails from '../assets/tails.png'

export default function ThemeSlider() {
    const [value, setValue] = useState(false)

    function toggleTheme() {
        setValue(!value)
        document.documentElement.classList.add("color-theme-in-transition")
        document.documentElement.setAttribute("data-theme", `${value}`)
        window.setTimeout(() => {
            document.documentElement.classList.remove("color-theme-in-transition")
        }, 1000)
    }

    return (
        <div style={wrapper}>
            <input
                checked={value}
                onChange={toggleTheme}
                className="themeSlider"
                id={`themeSlider-new`}
                type="checkbox"
            />
            <label
                style={value ? { background: '#1a1a1d' } : { background: '#DBD5B5' }}
                className="themeSlider-label"
                htmlFor={`themeSlider-new`}
            >
                <span
                    className={`themeSlider-button`}
                    style={value ? { backgroundImage: `url(${Tails})` } : { backgroundImage: `url(${Heads})` }}
                />
            </label>
        </div>
    );
};

const wrapper: React.CSSProperties = {
    position: 'fixed',
    top: '1rem',
    right: '1rem'
}

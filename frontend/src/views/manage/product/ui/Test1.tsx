

import React, { useState } from 'react';

const Test1 = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div>
            <button onClick={toggleExpand}>
                {isExpanded ? 'Collapse' : 'Expand'}
            </button>
            <div
                style={{
                    height: isExpanded ? 'auto' : '0px',
                    overflow: 'hidden',
                    transition: 'height 0.3s ease',
                }}
            >
                <p>This is the expandable content!</p>
                <p>More content here...</p>
            </div>
        </div>
    );
};

export default Test1;
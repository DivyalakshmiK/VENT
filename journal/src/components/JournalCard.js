import React, { useState } from 'react';
import './JournalCard.css';

const JournalCard = ({ entry }) => {
    const [expanded, setExpanded] = useState(false);

    const handleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <div className={`journal-card ${expanded ? 'expanded' : ''}`} onClick={handleExpand}>
            <div className="journal-header">
                <p className="entry-date">{new Date(entry.date).toLocaleDateString()}</p>
            </div>
            <div className="journal-content">
                {expanded ? entry.content : entry.content.slice(0, 100) + '...'}
            </div>
            {expanded && (
                <div className="read-more">
                    <p>Click to collapse</p>
                </div>
            )}
        </div>
    );
};

export default JournalCard;

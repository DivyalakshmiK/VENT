import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JournalList.css';

const JournalEntry = ({ date, content, onClick, isEvenDate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    onClick(content);
  };

  return (
    <div
      className={`journal-entry ${isOpen ? 'open' : ''} ${isEvenDate ? 'even-date' : 'odd-date'}`}
      onClick={handleClick}
    >
      <div className="entry-header">
        <div className="entry-date">{new Date(date).toLocaleDateString()}</div>
      </div>
      <div className="entry-content">
        <p>{isOpen ? content : content.substring(0, 60) + '...'}</p>
      </div>
    </div>
  );
};

const JournalList = () => {
  const [entries, setEntries] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get-entries', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setEntries(response.data);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, []);

  const handleEntryClick = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Group entries by date
  const groupedEntries = entries.reduce((acc, entry) => {
    const date = new Date(entry.date).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {});

  // Convert grouped entries to array and sort by date
  const sortedDates = Object.keys(groupedEntries).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="journal-list">
      <h1>Your Journal Timeline</h1>
      <div className="timeline">
        {sortedDates.map((date, index) => (
          <React.Fragment key={date}>
            <h2 className="date-header">{date}</h2>
            {groupedEntries[date].map((entry) => (
              <JournalEntry
                key={entry._id}
                date={entry.date}
                content={entry.content}
                onClick={handleEntryClick}
                isEvenDate={index % 2 === 0}
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      {showModal && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <p>{modalContent}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalList;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Calendar.css';

// Simple Card component
const Card = ({ children, className }) => (
  <div className={`card ${className}`}>{children}</div>
);

// Simple ScrollArea component
const ScrollArea = ({ children, className }) => (
  <div className={`scroll-area ${className}`}>{children}</div>
);

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [sentimentData, setSentimentData] = useState({});
  const [journalEntries, setJournalEntries] = useState([]);
  const [monthSummary, setMonthSummary] = useState({ summary: '', quote: '' });

  useEffect(() => {
    fetchSentimentData();
    fetchJournalEntries();
    generateMonthSummary();
  }, [currentDate, selectedDate]);

  const fetchSentimentData = async () => {
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    try {
      const response = await axios.get('http://localhost:5000/get-sentiment-data', {
        params: {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString()
        },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setSentimentData(response.data);
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
    }
  };

  const fetchJournalEntries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-entries', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setJournalEntries(response.data);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    }
  };

  const generateMonthSummary = () => {
    const monthSentiment = Object.values(sentimentData).reduce((acc, val) => acc + val, 0) / Object.values(sentimentData).length;
    let summary = '';
    let quote = '';

    if (monthSentiment > 0.5) {
      summary = "You had a great month!";
      quote = "Happiness is when what you think, what you say, and what you do are in harmony. - Mahatma Gandhi";
    } else if (monthSentiment > 0) {
      summary = "You had a good month overall.";
      quote = "The only way to do great work is to love what you do. - Steve Jobs";
    } else if (monthSentiment > -0.5) {
      summary = "This month had its ups and downs.";
      quote = "The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela";
    } else {
      summary = "This month was challenging.";
      quote = "In the middle of difficulty lies opportunity. - Albert Einstein";
    }

    setMonthSummary({ summary, quote });
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.5) return '#4CAF50'; // Very positive (green)
    if (sentiment > 0) return '#8BC34A'; // Positive (light green)
    if (sentiment === 0) return '#FFF'; // Neutral (white)
    if (sentiment > -0.5) return '#FFEB3B'; // Negative (yellow)
    return '#F44336'; // Very negative (red)
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const renderCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const sentiment = sentimentData[dateString] || 0;
      const backgroundColor = getSentimentColor(sentiment);
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateClick(day)}
          style={{ backgroundColor }}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const formatTime = (date) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(date).toLocaleTimeString(undefined, options);
  };

  const renderJournalEntries = () => {
    const entriesToShow = selectedDate
      ? journalEntries.filter(entry => new Date(entry.date).toDateString() === selectedDate.toDateString())
      : journalEntries.filter(entry => new Date(entry.date).toDateString() === new Date().toDateString());

    return (
      <Card className="journal-entries">
        <h3 className="entries-title">
          {selectedDate ? formatDate(selectedDate) : 'Today\'s'} Entries
        </h3>
        <ScrollArea className="entries-scroll-area">
          {entriesToShow.map((entry, index) => (
            <div key={index} className="entry">
              <p className="entry-time">{formatTime(entry.date)}</p>
              <p className="side-entry">{entry.content}</p>
            </div>
          ))}
        </ScrollArea>
      </Card>
    );
  };

  const renderMonthSummary = () => (
    <Card className="month-summary">
      <h3 className="summary-title">Month Summary</h3>
      <ScrollArea className="summary-scroll-area">
        <p className="summary-content">{monthSummary.summary}</p>
        <p className="summary-quote">{monthSummary.quote}</p>
      </ScrollArea>
    </Card>
  );

  return (
    <div className="enhanced-calendar">
      <div className="calendar-container">
        <div className="calendar">
          <div className="calendar-header">
            <button onClick={prevMonth}>&lt;</button>
            <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
            <button onClick={nextMonth}>&gt;</button>
          </div>
          <div className="calendar-weekdays">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          <div className="calendar-days">
            {renderCalendarDays()}
          </div>
        </div>
      </div>
      <div className="sidebar">
        {renderMonthSummary()}
        {renderJournalEntries()}
      </div>
    </div>
  );
};

export default Calendar;
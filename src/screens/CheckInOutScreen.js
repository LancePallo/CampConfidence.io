import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseConfig';
import { useParams, useNavigate } from 'react-router-dom';
import './CheckInOutScreen.css'; // Import your CSS file

const CheckInOutScreen = () => {
  const { week = 'Week 1', day = 'Monday' } = useParams(); // Retrieve the selected week from the route params
  const navigate = useNavigate();

  const [campers, setCampers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [status, setStatus] = useState({});

  useEffect(() => {
    const fetchCampers = async () => {
      try {
        const checkInColumn = `checkIn${day}`;
        const checkOutColumn = `checkOut${day}`;
        
        let query = supabase
          .from(week)
          .select(`Participant, "${checkInColumn}", "${checkOutColumn}"`);
        
        if (day === 'Monday' || day === 'Wednesday' || day === 'Friday') {
          query = query
            .or('"Event / Category".ilike.%Full Week%, "Event / Category".ilike.%M/W/F%');
        } else if (day === 'Tuesday' || day === 'Thursday') {
          query = query
            .or('"Event / Category".ilike.%Full Week%, "Event / Category".ilike.%T/TH%');
        }

        const { data, error } = await query;
        if (error) {
          alert(`Error fetching data: ${error.message}`);
        } else {
          if (data.length === 0) {
            alert(`No data found for ${week}`);
          }
          const sortedData = data.sort((a, b) => a.Participant.localeCompare(b.Participant));
          setCampers(sortedData);

          const initialStatus = {};
          sortedData.forEach((camper) => {
            initialStatus[camper.Participant] = {
              checkIn: camper[checkInColumn],
              checkOut: camper[checkOutColumn],
            };
          });
          setStatus(initialStatus);
        }
      } catch (err) {
        alert(`Unexpected error: ${err.message}`);
      }
    };

    fetchCampers();
  }, [week, day]);

  const handleCheckInOut = (type, person) => {
    setModalType(type);
    setSelectedPerson(person);
    setModalVisible(true);
  };

  const handleDone = async () => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedTime = `${formattedHours}:${minutes} ${period}`;

    const checkColumn = modalType === 'Check-In' ? `checkIn${day}` : `checkOut${day}`;

    const updateData = {
      [checkColumn]: `${nameInput} (${formattedTime})`,
    };

    try {
      const { data, error } = await supabase
        .from(week)
        .update(updateData)
        .eq('Participant', selectedPerson)
        .select();

      if (error) {
        alert(`Error updating data: ${error.message}`);
      } else {
        setStatus((prevStatus) => ({
          ...prevStatus,
          [selectedPerson]: {
            ...prevStatus[selectedPerson],
            [modalType === 'Check-In' ? 'checkIn' : 'checkOut']: `${nameInput} (${formattedTime})`,
          },
        }));
        setModalVisible(false);
        setNameInput('');
      }
    } catch (err) {
      alert(`Unexpected error: ${err.message}`);
    }
  };

  const renderItem = (item) => (
    <div className="person-container" key={item.Participant}>
      <span className="person-name">{item.Participant}</span>
      <button
        className="check-button"
        onClick={() => handleCheckInOut('Check-In', item.Participant)}
      >
        {status[item.Participant]?.checkIn ? status[item.Participant].checkIn : 'Check-In'}
      </button>
      <button
        className="check-button"
        onClick={() => handleCheckInOut('Check-Out', item.Participant)}
      >
        {status[item.Participant]?.checkOut ? status[item.Participant].checkOut : 'Check-Out'}
      </button>
    </div>
  );

  return (
    <div className="container">
      {campers.length === 0 ? (
        <span className="no-data-text">No campers found for {week}</span>
      ) : (
        <ul>
          {campers.map(renderItem)}
        </ul>
      )}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-view">
            <span className="modal-text">{`${modalType} - ${selectedPerson}`}</span>
            <input
              className="input"
              placeholder="Your name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
            <div className="modal-buttons-container">
              <button
                className="modal-button cancel-button"
                onClick={() => setModalVisible(false)}
              >
                Cancel
              </button>
              <button
                className="modal-button done-button"
                onClick={handleDone}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInOutScreen;

import React, { useState, useEffect } from 'react';
import { Checkbox, Button, Modal, TextField, MenuItem, Select, Typography, Box } from '@mui/material';
import { supabase } from './supabaseConfig'; // Import the Supabase client
import { useParams } from 'react-router-dom';

const columns = [
  'Age', 'SS', 'DO', 'B1', 'B2', 'B3', 'B4', 'B5', 'ET', 'PU', 'On Bus', 'Off Bus', 'Check-In 1', 'Check-In 2', 'Check-In 3', 'Check-In 4', 'On Bus 2', 'Off Bus 2'
];

const columnMappings = {
  'On Bus': 'OnBus',
  'Off Bus': 'OffBus',
  'Check-In 1': 'CheckIn1',
  'Check-In 2': 'CheckIn2',
  'Check-In 3': 'CheckIn3',
  'Check-In 4': 'CheckIn4',
  'On Bus 2': 'OnBus2',
  'Off Bus 2': 'OffBus2',
};

const RosterScreen = () => {
  const { week, day } = useParams(); // Retrieve the selected week and day from the route params

  const [campers, setCampers] = useState([]);
  const [checked, setChecked] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('All');
  const [items, setItems] = useState([
    { label: 'All', value: 'All' },
    { label: 'Alligators', value: 'Alligators' },
    { label: 'Bears', value: 'Bears' },
    { label: 'Cheetahs', value: 'Cheetahs' },
    { label: 'Dolphins', value: 'Dolphins' },
  ]);
  const [buttonStates, setButtonStates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [checkInModalVisible, setCheckInModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [currentCol, setCurrentCol] = useState(null);
  const [initials, setInitials] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchCampers = async () => {
      try {
        let query = supabase
          .from(week)
          .select(`Participant, Age, SS${day}, DO${day}, B1${day}, B2${day}, B3${day}, B4${day}, B5${day}, ET${day}, PU${day}, OnBus${day}, OffBus${day}, CheckIn1${day}, CheckIn2${day}, CheckIn3${day}, CheckIn4${day}, OnBus2${day}, OffBus2${day}`);

        if (day === 'Monday' || day === 'Wednesday' || day === 'Friday') {
          query = query
            .or('"Event / Category".ilike.%Full Week%, "Event / Category".ilike.%M/W/F%');
        } else if (day === 'Tuesday' || day === 'Thursday') {
          query = query
            .or('"Event / Category".ilike.%Full Week%, "Event / Category".ilike.%T/TH%');
        }

        const { data, error } = await query;
        if (error) {
          console.error("Error fetching data:", error);
          alert(`Error fetching data: ${error.message}`);
        } else {
          console.log("Fetched data:", data);
          if (data.length === 0) {
            alert(`No data found for ${week}`);
          }
          const sortedData = data.sort((a, b) => parseInt(a.Age) - parseInt(b.Age));
          setCampers(sortedData);

          // Initialize checked state for SS checkboxes and buttons
          const initialCheckedState = {};
          const initialButtonStates = {};
          sortedData.forEach((camper, index) => {
            initialCheckedState[`${index}-1`] = camper[`SS${day}`];
            initialButtonStates[`${index}-2`] = camper[`DO${day}`];
            initialButtonStates[`${index}-3`] = camper[`B1${day}`];
            initialButtonStates[`${index}-4`] = camper[`B2${day}`];
            initialButtonStates[`${index}-5`] = camper[`B3${day}`];
            initialButtonStates[`${index}-6`] = camper[`B4${day}`];
            initialButtonStates[`${index}-7`] = camper[`B5${day}`];
            initialButtonStates[`${index}-8`] = camper[`ET${day}`];
            initialButtonStates[`${index}-9`] = camper[`PU${day}`];
            initialCheckedState[`${index}-10`] = camper[`OnBus${day}`];
            initialCheckedState[`${index}-11`] = camper[`OffBus${day}`];
            initialButtonStates[`${index}-12`] = camper[`CheckIn1${day}`];
            initialButtonStates[`${index}-13`] = camper[`CheckIn2${day}`];
            initialButtonStates[`${index}-14`] = camper[`CheckIn3${day}`];
            initialButtonStates[`${index}-15`] = camper[`CheckIn4${day}`];
            initialCheckedState[`${index}-16`] = camper[`OnBus2${day}`];
            initialCheckedState[`${index}-17`] = camper[`OffBus2${day}`];
          });
          setChecked(initialCheckedState);
          setButtonStates(initialButtonStates);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        alert(`Unexpected error: ${err.message}`);
      }
    };

    fetchCampers();
  }, [week, day]);

  useEffect(() => {
    // Update the checked state when the selected category changes
    const initialCheckedState = {};
    const initialButtonStates = {};
    const displayedCampers = selectedCategory === 'All' ? campers : splitCampersByCategory(campers)[selectedCategory];
    displayedCampers.forEach((camper, rowIndex) => {
      initialCheckedState[`${rowIndex}-1`] = camper[`SS${day}`];
      initialButtonStates[`${rowIndex}-2`] = camper[`DO${day}`];
      initialButtonStates[`${rowIndex}-3`] = camper[`B1${day}`];
      initialButtonStates[`${rowIndex}-4`] = camper[`B2${day}`];
      initialButtonStates[`${rowIndex}-5`] = camper[`B3${day}`];
      initialButtonStates[`${rowIndex}-6`] = camper[`B4${day}`];
      initialButtonStates[`${rowIndex}-7`] = camper[`B5${day}`];
      initialButtonStates[`${rowIndex}-8`] = camper[`ET${day}`];
      initialButtonStates[`${rowIndex}-9`] = camper[`PU${day}`];
      initialCheckedState[`${rowIndex}-10`] = camper[`OnBus${day}`];
      initialCheckedState[`${rowIndex}-11`] = camper[`OffBus${day}`];
      initialButtonStates[`${rowIndex}-12`] = camper[`CheckIn1${day}`];
      initialButtonStates[`${rowIndex}-13`] = camper[`CheckIn2${day}`];
      initialButtonStates[`${rowIndex}-14`] = camper[`CheckIn3${day}`];
      initialButtonStates[`${rowIndex}-15`] = camper[`CheckIn4${day}`];
      initialCheckedState[`${rowIndex}-16`] = camper[`OnBus2${day}`];
      initialCheckedState[`${rowIndex}-17`] = camper[`OffBus2${day}`];
    });
    setChecked(initialCheckedState);
    setButtonStates(initialButtonStates);
  }, [selectedCategory, campers]);

  const splitCampersByCategory = (campers) => {
    return campers.reduce((acc, camper) => {
      const category = camper['Event / Category'] || 'All';
      if (!acc[category]) acc[category] = [];
      acc[category].push(camper);
      return acc;
    }, {});
  };

  const updateSupabaseColumn = async (rowIndex, columnName, value) => {
    const camper = campers[rowIndex];
    const columnKey = columnMappings[columnName] || columnName;

    const { error } = await supabase
      .from(week)
      .update({ [columnKey]: value })
      .eq('Participant', camper.Participant);

    if (error) {
      console.error('Error updating Supabase:', error);
      alert(`Error updating Supabase: ${error.message}`);
    }
  };

  const handleCheckboxPress = (rowIndex, columnName) => {
    const key = `${rowIndex}-${columns.indexOf(columnName)}`;
    const newChecked = !checked[key];
    setChecked({ ...checked, [key]: newChecked });
    updateSupabaseColumn(rowIndex, columnName, newChecked);
  };

  const handleButtonPress = (rowIndex, columnName) => {
    const key = `${rowIndex}-${columns.indexOf(columnName)}`;
    const newState = !buttonStates[key];
    setButtonStates({ ...buttonStates, [key]: newState });

    if (columnName.startsWith('Check-In')) {
      setCurrentRow(rowIndex);
      setCurrentCol(columnName);
      setModalVisible(true);
    } else {
      updateSupabaseColumn(rowIndex, columnName, newState);
    }
  };

  const handleModalSubmit = async () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const value = `${initials} - ${time}`;

    setModalVisible(false);
    setButtonStates({ ...buttonStates, [`${currentRow}-${columns.indexOf(currentCol)}`]: value });

    updateSupabaseColumn(currentRow, currentCol, value);

    // Update the CheckInNotes field
    const camper = campers[currentRow];
    const { error } = await supabase
      .from(week)
      .update({ [`CheckInNotes${day}`]: notes })
      .eq('Participant', camper.Participant);

    if (error) {
      console.error('Error updating Supabase:', error);
      alert(`Error updating Supabase: ${error.message}`);
    }

    // Reset initials and notes
    setInitials('');
    setNotes('');
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const renderedCampers = selectedCategory === 'All' ? campers : splitCampersByCategory(campers)[selectedCategory];

  return (
    <Box padding={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Typography variant="h4">Roster</Typography>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          displayEmpty
        >
          {items.map(item => (
            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
          ))}
        </Select>
      </Box>
      <Box border={1} borderColor="divider">
        <Box display="flex">
          <Typography variant="h6" flex={1}>Name</Typography>
          {columns.map((column, index) => (
            <Typography key={index} variant="h6" flex={1} align="center">{column}</Typography>
          ))}
        </Box>
        {renderedCampers.map((camper, rowIndex) => (
          <Box key={rowIndex} display="flex">
            <Typography variant="body1" flex={1}>{camper.Participant}</Typography>
            {columns.map((column, colIndex) => {
              const key = `${rowIndex}-${colIndex}`;
              if (column === 'SS' || column.startsWith('On Bus') || column.startsWith('Off Bus')) {
                return (
                  <Checkbox
                    key={colIndex}
                    checked={!!checked[key]}
                    onChange={() => handleCheckboxPress(rowIndex, column)}
                    style={{ flex: 1, textAlign: 'center' }}
                  />
                );
              } else {
                return (
                  <Button
                    key={colIndex}
                    variant={buttonStates[key] ? "contained" : "outlined"}
                    onClick={() => handleButtonPress(rowIndex, column)}
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    {buttonStates[key] ? 'On' : 'Off'}
                  </Button>
                );
              }
            })}
          </Box>
        ))}
      </Box>
      <Modal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <Box padding={2} bgcolor="background.paper" margin="auto" borderRadius={1} maxWidth={400}>
          <Typography variant="h6">Check-In Information</Typography>
          <TextField
            value={initials}
            onChange={e => setInitials(e.target.value)}
            label="Initials"
            fullWidth
            margin="normal"
          />
          <TextField
            value={notes}
            onChange={e => setNotes(e.target.value)}
            label="Notes"
            fullWidth
            margin="normal"
          />
          <Button onClick={handleModalSubmit} variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default RosterScreen;

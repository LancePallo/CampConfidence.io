import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { Checkbox } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { supabase } from './supabaseConfig'; // Import the Supabase client
import { useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

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
  const route = useRoute();
  const { week, day } = route.params; // Retrieve the selected week and day from the route params

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
            initialCheckedState[`${index}-17`] = camper[`OffBus2${day}`]; // Assuming 'DO' is at column index 2, adjust if needed
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
    const splitSize = Math.ceil(campers.length / 4);
    return {
      Alligators: campers.slice(0, splitSize),
      Bears: campers.slice(splitSize, splitSize * 2),
      Cheetahs: campers.slice(splitSize * 2, splitSize * 3),
      Dolphins: campers.slice(splitSize * 3),
    };
  };

  const updateSupabaseColumn = async (rowIndex, columnName, value) => {
    const camper = campers[rowIndex];
    const mappedColumnName = columnMappings[columnName] || columnName;
  
    console.log(`Updating Supabase: Participant: ${camper.Participant}, Column: ${mappedColumnName}, Value: ${value}`);

    const { error } = await supabase
      .from(week)
      .update({ [`${mappedColumnName}${day}`]: value })
      .eq('Participant', camper.Participant);
  
    if (error) {
      console.error('Error updating Supabase:', error);
      alert(`Error updating Supabase: ${error.message}`);
    }
  };  
  
  const toggleCheckbox = async (rowIndex, colIndex) => {
    const key = `${rowIndex}-${colIndex}`;
    const isChecked = !checked[key];
  
    setChecked(prevState => ({ ...prevState, [key]: isChecked }));
  
    const columnName = columns[colIndex];
    await updateSupabaseColumn(rowIndex, columnName, isChecked);
  };

  const handleButtonPress = (rowIndex, colIndex) => {
    setCurrentRow(rowIndex);
    setCurrentCol(colIndex);
  
    const key = `${rowIndex}-${colIndex}`;
    const state = buttonStates[key];
  
    if (columns[colIndex].includes('Check-In')) {
      setInitials(state ? state.split(' ')[0] : ''); // Set initials if available
      setCheckInModalVisible(true);
    } else {
      if (state) {
        const parts = state.split(' - ');
        setInitials(parts[0]); // Set initials
        setNotes(parts[1] || ''); // Set notes if available
      } else {
        setInitials('');
        setNotes('');
      }
      setModalVisible(true);
    }
  };  

  const handleDonePress = async () => {
    const key = `${currentRow}-${currentCol}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
    if (columns[currentCol].includes('Check-In')) {
      const combinedData = `${initials} ${timestamp}`
      setButtonStates(prevState => ({
        ...prevState,
        [key]: combinedData,
      }));
      setCheckInModalVisible(false);

      const columnName = columns[currentCol];
      await updateSupabaseColumn(currentRow, columnName, combinedData);
    } else {
      const combinedData = `${initials} - ${notes}`;
      setButtonStates(prevState => ({
        ...prevState,
        [key]: combinedData,
      }));
      setModalVisible(false);
  
      const columnName = columns[currentCol];
      await updateSupabaseColumn(currentRow, columnName, combinedData);
    }
  
    setInitials('');
    setNotes('');
  };
  
  const getHeaderColor = (category) => {
    switch (category) {
      case 'Alligators':
        return 'green';
      case 'Bears':
        return 'blue';
      case 'Cheetahs':
        return 'orange';
      case 'Dolphins':
        return 'purple';
      default:
        return 'red';
    }
  };

  const getButtonColor = (rowIndex, colIndex) => {
    const key = `${rowIndex}-${colIndex}`;
    const checkInColumns = ['Check-In 1', 'Check-In 2', 'Check-In 3', 'Check-In 4', 'Check-In 5'];
  
    if (checkInColumns.includes(columns[colIndex])) {
      return 'white'; // Check-in columns remain white
    }
  
    return buttonStates[key] ? 'red' : 'white'; // Other columns can turn red
  };

  const getButtonText = (rowIndex, colIndex) => {
    const key = `${rowIndex}-${colIndex}`;
    const state = buttonStates[key];
    if (!state) return '';
    const isCheckInColumn = columns[colIndex].includes('Check-In');
    return isCheckInColumn ? state : state.substring(0, 2);
  };

  const getNotesText = (rowIndex, colIndex) => {
    const key = `${rowIndex}-${colIndex}`;
    const state = buttonStates[key];
    return state && typeof state !== 'string' ? state.notes : '';
  };

  const categorizedCampers = splitCampersByCategory(campers);
  const displayedCampers = selectedCategory === 'All' ? campers : categorizedCampers[selectedCategory];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: getHeaderColor(selectedCategory) }]}>
        <Text style={styles.mainHeaderText}>{selectedCategory}</Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          containerStyle={styles.pickerContainer}
          style={styles.picker}
          dropDownStyle={styles.dropdown}
          onChangeValue={(itemValue) => setSelectedCategory(itemValue)}
        />
      </View>
      <ScrollView style={styles.verticalScroll} contentContainerStyle={styles.verticalContentContainer}>
        <View style={styles.tableContainer}>
          <View style={styles.fixedColumn}>
            <View style={styles.fixedHeader}>
              <Text style={styles.fixedHeaderText}>Name</Text>
            </View>
            {displayedCampers.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.fixedRow}>
                <Text style={styles.fixedCell}>{row.Participant}</Text>
              </View>
            ))}
          </View>
          <ScrollView horizontal>
            <View>
              <View style={styles.headerRow}>
                {columns.map((col, index) => (
                  <View key={index} style={styles.headerCell}>
                    <Text style={styles.headerText}>{col}</Text>
                  </View>
                ))}
              </View>
              {displayedCampers.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {columns.map((col, colIndex) => (
                    <View key={colIndex} style={styles.cell}>
                      {col === 'Age' ? (
                        <Text style={styles.ageCell}>{row.Age}</Text>
                      ) : ['SS'].includes(col) ? (
                        <Checkbox
                          status={checked[`${rowIndex}-${colIndex}`] ? 'checked' : 'unchecked'}
                          onPress={() => toggleCheckbox(rowIndex, colIndex)}
                          color="green"
                          uncheckedColor="gray"
                          style={styles.checkBoxCell}
                        />
                      ) : ['On Bus'].includes(col) ? (
                        <Checkbox
                          status={checked[`${rowIndex}-${colIndex}`] ? 'checked' : 'unchecked'}
                          onPress={() => toggleCheckbox(rowIndex, colIndex)}
                          color="green"
                          style={styles.checkBoxCell}
                        />
                      ) : ['Off Bus'].includes(col) ? (
                        <Checkbox
                          status={checked[`${rowIndex}-${colIndex}`] ? 'checked' : 'unchecked'}
                          onPress={() => toggleCheckbox(rowIndex, colIndex)}
                          color="green"
                          style={styles.checkBoxCell}
                        />
                      ) : ['On Bus 2'].includes(col) ? (
                        <Checkbox
                          status={checked[`${rowIndex}-${colIndex}`] ? 'checked' : 'unchecked'}
                          onPress={() => toggleCheckbox(rowIndex, colIndex)}
                          color="green"
                          style={styles.checkBoxCell}
                        />
                      ) : ['Off Bus 2'].includes(col) ? (
                        <Checkbox
                          status={checked[`${rowIndex}-${colIndex}`] ? 'checked' : 'unchecked'}
                          onPress={() => toggleCheckbox(rowIndex, colIndex)}
                          color="green"
                          style={styles.checkBoxCell}
                        />
                      ):(
                        <TouchableOpacity
                          onPress={() => handleButtonPress(rowIndex, colIndex)}
                          style={[styles.cellButton, { backgroundColor: getButtonColor(rowIndex, colIndex) }]}
                        >
                          <Text style={styles.buttonText}>{getButtonText(rowIndex, colIndex)}</Text>
                          {getNotesText(rowIndex, colIndex) !== '' }
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
      {/* General Modal */}
      <Modal
        visible={modalVisible}
        supportedOrientations={['landscape']}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>{currentRow !== null && campers[currentRow].Participant}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Initials"
              value={initials}
              onChangeText={setInitials}
            />
            <TextInput
              style={styles.modalNotes}
              placeholder="Notes"
              value={notes}
              onChangeText={setNotes}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDoneButton}
                onPress={handleDonePress}
              >
                <Text style={styles.modalButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Check-In Modal */}
      <Modal
        visible={checkInModalVisible}
        supportedOrientations={['landscape']}
        transparent
        animationType="slide"
        onRequestClose={() => setCheckInModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>{currentRow !== null && campers[currentRow].Participant}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Initials"
              value={initials}
              onChangeText={setInitials}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setCheckInModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDoneButton}
                onPress={handleDonePress}
              >
                <Text style={styles.modalButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      height: height,
      width: width,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 40,
      paddingVertical: 5,
      zIndex: 1,
      elevation: 1,
    },
    mainHeaderText: {
      fontSize: 50,
      fontWeight: 'bold',
    },
    headerText: {
      fontSize: 19,
      fontWeight: 'bold',
    },
    pickerContainer: {
      height: 40,
      width: 135,
      marginTop: 5,
      marginBottom: 15,
    },
    picker: {
      height: 40,
      borderColor: 'white',
    },
    dropdown: {
      backgroundColor: 'white',
    },
    verticalScroll: {
      flex: 1,
    },
    verticalContentContainer: {
      flexGrow: 1,
    },
    tableContainer: {
      flexDirection: 'row',
    },
    fixedColumn: {
      width: 220,
      borderRightWidth: 1,
      borderColor: '#ddd',
    },
    fixedHeader: {
      flexDirection: 'column',
      backgroundColor: '#f0f0f0',
      borderBottomWidth: 2,
      borderColor: '#ddd',
    },
    fixedHeaderText: {
      padding: 10,
      fontWeight: 'bold',
      fontSize: 21,
    },
    fixedRow: {
      flexDirection: 'column',
      borderBottomWidth: 2,
      borderColor: '#ddd',
      backgroundColor: '#fff',
    },
    fixedCell: {
      padding: 5,
      borderBottomWidth: 0,
      borderColor: '#ddd',
      fontSize: 20,
    },
    headerRow: {
      flexDirection: 'row',
      backgroundColor: '#f0f0f0',
    },
    headerCell: {
      paddingBottom: 10,
      paddingTop: 11,
      borderWidth: 1,
      borderColor: '#ddd',
      width: 125,
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
    },
    cell: {
      borderWidth: 1,
      borderColor: '#ddd',
      width: 125,
      height: 38.5,
      justifyContent: 'center',
    },
    ageCell: {
      color: 'black',
      fontSize: 20,
      textAlign: 'center',
    },
    checkBoxCell: {
      alignSelf: 'center',
      width: 24, // Width of the checkbox
  height: 24, // Height of the checkbox
  borderWidth: 2, // Border width
  borderColor: 'black',
    },
    cellText: {
      textAlign: 'center',
      fontSize: 17,
    },
    cellButton: {
      padding: 6,
      height: 35,
      //justifyContent: 'center',
      alignItems: 'center',
    },
    boldText: {
      fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
      },
    modalHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
      },
    modalInput: {
        width: '100%',
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
      },
    modalNotes: {
        width: '100%',
        height: 90,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
      },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      },
    modalButton: {
        padding: 10,
        backgroundColor: '#f44336',
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
      },
    modalDoneButton: {
        padding: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
      },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
      },
    });
  
export default RosterScreen;
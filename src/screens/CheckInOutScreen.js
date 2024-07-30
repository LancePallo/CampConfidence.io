import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Dimensions
} from 'react-native';
import { supabase } from './supabaseConfig';
import { useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const CheckInOutScreen = () => {
  const route = useRoute();
  const { week, day } = route.params; // Retrieve the selected week from the route params

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
          //console.error("Error fetching data:", error);
          alert(`Error fetching data: ${error.message}`);
        } else {
          //console.log("Fetched data:", data);
          if (data.length === 0) {
            alert(`No data found for ${week}`);
          }
          const sortedData = data.sort((a, b) => a.Participant.localeCompare(b.Participant));
          setCampers(sortedData);

          // Update status state based on fetched data
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
        //console.error("Unexpected error:", err);
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
    const minutes = currentTime.getMinutes().toString().padStart(2, '0'); // Ensure two-digit minutes
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // Convert to 12-hour format
    const formattedTime = `${formattedHours}:${minutes} ${period}`;

    const checkColumn = modalType === 'Check-In' ? `checkIn${day}` : `checkOut${day}`;

    const updateData = {
      [checkColumn]: `${nameInput} (${formattedTime})`,
    };

    //console.log('Updating column:', checkColumn);
    //console.log('Update data:', updateData);
    //console.log('Selected person:', selectedPerson);

    try {
      const { data, error } = await supabase
        .from(week)
        .update(updateData)
        .eq('Participant', selectedPerson)
        .select(); // Fetch updated row to verify the update

      if (error) {
        //console.error("Error updating data:", error);
        alert(`Error updating data: ${error.message}`);
      } else {
        //console.log('Updated data:', data);
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
      //console.error("Unexpected error:", err);
      alert(`Unexpected error: ${err.message}`);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.personContainer}>
      <Text style={styles.personName}>{item.Participant}</Text>
      <TouchableOpacity
        style={styles.checkButton}
        onPress={() => handleCheckInOut('Check-In', item.Participant)}
      >
        <Text style={styles.buttonText}>
          {status[item.Participant]?.checkIn ? status[item.Participant].checkIn : 'Check-In'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.checkButton}
        onPress={() => handleCheckInOut('Check-Out', item.Participant)}
      >
        <Text style={styles.buttonText}>
          {status[item.Participant]?.checkOut ? status[item.Participant].checkOut : 'Check-Out'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {campers.length === 0 ? (
        <Text style={styles.noDataText}>No campers found for {week}</Text>
      ) : (
        <FlatList
          data={campers}
          renderItem={renderItem}
          keyExtractor={(item) => item.Participant}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        supportedOrientations={['landscape']}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{`${modalType} - ${selectedPerson}`}</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={nameInput}
            onChangeText={setNameInput}
          />
          <View style={styles.modalButtonsContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.doneButton]}
              onPress={handleDone}
            >
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 0,
    height: height,
    width: width,
  },
  personContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  personName: {
    fontSize: 30,
    flex: 1,
  },
  checkButton: {
    backgroundColor: '#007BFF',
    padding: 20,
    borderRadius: 9,
    marginHorizontal: 10,
    marginRight: 70,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  modalView: {
    margin: '15%',
    marginLeft: '20%',
    width: '60%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 30,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  doneButton: {
    backgroundColor: '#4CAF50',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
  },
});

export default CheckInOutScreen;

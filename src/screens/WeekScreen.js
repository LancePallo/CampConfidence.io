import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const weeks = [
  'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5',
  'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10'
];

const WeekScreen = ({ navigation, setIsLoggedIn }) => {
  const handleLogout = () => {
    setIsLoggedIn(false); // Set login state to false
    //navigation.navigate('LoginScreen'); // Navigate to login screen
  };

  const renderButton = ({ item }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate('DayScreen', { week: item })}
    >
      <Text style={styles.buttonText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={weeks}
        renderItem={renderButton}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingTop: 100,
    height: height,
    width: width,
  },
  row: {
    justifyContent: 'space-around',
    marginVertical: 4,
    marginHorizontal: 70,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    margin: 10,
    borderRadius: 50,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default WeekScreen;

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const DayScreen = ({ route, navigation }) => {
  const { week } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{`${week}`}</Text>
      <View style={styles.buttonsContainer}>
        {days.map(day => (
          <TouchableOpacity
            key={day}
            style={styles.button}
            onPress={() => navigation.navigate('ChoiceScreen', { week, day })}
          >
            <Text style={styles.buttonText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: height,
    width: width,
  },
  text: {
    fontSize: 30,
    marginBottom: 20,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    marginVertical: 5,
    borderRadius: 50,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});

export default DayScreen;
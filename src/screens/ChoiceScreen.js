import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const choices = ['Check In/Out', 'Staff'];

const ChoiceScreen = ({ navigation, route }) => {
  const { week, day } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{`${week} - ${day}`}</Text>
      <View style={styles.buttonsContainer}>
        {choices.map(choice => (
          <TouchableOpacity
            key={choice}
            style={styles.button}
            onPress={() => {
              if (choice === 'Check In/Out') {
                navigation.navigate('CheckInOutScreen', { week, day });
              } else if (choice === 'Staff') {
                navigation.navigate('RosterScreen', { week, day });
              }
            }}
          >
            <Text style={styles.buttonText}>{choice}</Text>
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

export default ChoiceScreen;

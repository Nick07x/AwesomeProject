import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Ribbon} from './src/Ribbon';
import data from './data/data.json';

const App = () => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Dota 2 shop</Text>
      <View style={styles.ribbonWrapper}>
        <Ribbon data={data.items.filter(item => !item.recipe)}></Ribbon>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: '#CCCCCC',
    padding: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  ribbonWrapper: {
    paddingHorizontal: 20,
  },
});

export default App;

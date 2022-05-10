import React, {useRef, useCallback} from 'react';
import {View, StyleSheet, Image, Text, Pressable} from 'react-native';

import {debounce} from './utils';

const debounceTime = 1000;

export const RibbonItem = ({data, onClick}) => {
  const self = useRef(null);

  function onPress() {
    if (onClick) {
      self.current.measure((fx, fy, width, height, px, py) => {
        // console.log('measure = ', fx, fy, px, py, width, height);
        console.log('click');
        onClick(data.id, px, py, width, height);
      });
    }
  }

  const onPressDebounced = useCallback(debounce(onPress, debounceTime), [
    debounceTime,
  ]);

  return (
    <Pressable onPress={onPressDebounced}>
      <View ref={self} style={styles.container} onLayout={() => {}}>
        <Image
          style={styles.logo}
          source={{
            uri: data.url_image,
          }}
        />
        <Text style={styles.text}>{`Name: ${data.localized_name}`}</Text>
        <Text style={styles.text}>{`Cost: ${data.cost}`}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 5,
  },
  logo: {
    width: '100%',
    height: '60%',
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
  },
});

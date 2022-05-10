import React, {useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {RibbonItem} from './RibbonItem';
import {Slider} from './slider';

const sliderItemWidth = 120;
const sliderItemHeigth = 160;

export const Ribbon = ({data}) => {
  const [itemData, setItemData] = useState(null);

  const renderItem = ({item}) => (
    <View style={styles.itemWrapper}>
      <RibbonItem data={item} onClick={onPressItem} />
    </View>
  );

  const onPressItem = (id, x, y) => {
    setItemData({id, x, y, width: sliderItemWidth, height: sliderItemHeigth});
  };

  const onSliderClose = () => {
    setSliderVisible(false);
  };

  return (
    <View>
      <Slider data={data} itemData={itemData} onClose={onSliderClose}></Slider>
      <FlatList
        columnWrapperStyle={styles.columnWrapperStyle}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  columnWrapperStyle: {
    justifyContent: 'space-between',
  },
  itemWrapper: {
    marginVertical: 5,
    width: sliderItemWidth,
    height: sliderItemHeigth,
    shadowColor: '#000000',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.5,
    elevation: 5,
    backgroundColor: '#BBBBBB',
  },
});

import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import {RibbonItem} from './RibbonItem';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const sliderContentWidth = windowWidth * 0.8;
const sliderContentHeight = windowHeight * 0.5;

const sliderButtonWidth = windowWidth * 0.1;

const sliderItemWidth = windowWidth * 0.4;
const sliderItemHeight = windowHeight * 0.3;

const closeButtonHeight = 50;

export const Slider = ({data, onClose, itemData}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [clonedItem, setClonedItem] = useState(null);
  const [showSlider, setShowSlider] = useState(false);
  const [animItem, setAnimItem] = useState(new Animated.Value(0));

  const slider = useRef(null);
  const currentIndex = useRef(0);

  const cloneItem = ({id, x, y, width, height}) => {
    currentIndex.current = data.findIndex(item => item.id === id);

    const itemData = data.find(item => item.id === id);

    const styles = StyleSheet.create({
      clonedItem: {
        position: 'absolute',
        left: x,
        top: y,
      },
    });

    return (
      <View style={{width: width, height: height}}>
        <RibbonItem data={itemData} style={styles.clonedItem}></RibbonItem>
      </View>
    );
  };

  useEffect(() => {
    if (itemData) {
      setModalVisible(true);
      setAnimItem(new Animated.Value(0));
      const cloned = cloneItem(itemData);

      setClonedItem(cloned);
      setShowAnimation(true);
    }
  }, [itemData]);

  useEffect(() => {
    if (showAnimation && itemData) {
      slider.current.scrollToIndex({
        index: currentIndex.current,
        Animated: false,
      });

      const config = {
        duration: 1000,
        toValue: 1,
        easing: Easing.ease,
      };

      Animated.timing(animItem, {
        ...config,
        useNativeDriver: true,
      }).start(() => {
        setShowAnimation(false);
        setShowSlider(true);
      });
    }
  }, [showAnimation]);

  const renderItem = ({item}) => (
    <View style={styles.sliderContent}>
      <View style={styles.sliderItemWrapper}>
        <RibbonItem data={item}></RibbonItem>
      </View>
    </View>
  );

  const onPressClose = () => {
    setShowSlider(false);
    setModalVisible(false);
  };

  const moveLeft = () => {
    currentIndex.current =
      currentIndex.current < 1
        ? currentIndex.current
        : currentIndex.current - 1;

    slider.current.scrollToIndex({
      index: currentIndex.current,
      viewPosition: 0.5,
    });
  };

  const moveRight = () => {
    currentIndex.current =
      currentIndex.current >= data.length - 1
        ? currentIndex.current
        : currentIndex.current + 1;

    slider.current.scrollToIndex({
      index: currentIndex.current,
      viewPosition: 0.5,
    });
  };

  const isShowSlider = () => {
    //console.log('showSlider ', showSlider);
    return showSlider ? null : {opacity: 0, height: 0};
  };

  const _onViewableItemsChanged = useCallback(({viewableItems}) => {
    if (viewableItems.length === 1) {
      //console.log('index = ', viewableItems[0].index);
      currentIndex.current = viewableItems[0].index;
    }
  }, []);

  const _viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  return (
    <View>
      {modalVisible && (
        <Modal
          style={styles.modal}
          animationType="none"
          transparent={true}
          presentationStyle="overFullScreen"
          visible={true}>
          {showAnimation && animItem && (
            <Animated.View
              style={{
                transform: [
                  {
                    translateX: animItem.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        itemData.x,
                        windowWidth / 2 +
                          itemData.width / 2 -
                          sliderItemWidth / 2,
                      ],
                    }),
                  },
                  {
                    translateY: animItem.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        itemData.y,
                        windowHeight / 2 -
                          sliderItemHeight / 2 +
                          closeButtonHeight,
                      ],
                    }),
                  },
                  {
                    scaleX: animItem.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, sliderItemWidth / itemData.width],
                    }),
                  },
                  {
                    scaleY: animItem.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, sliderItemHeight / itemData.height],
                    }),
                  },
                ],
              }}>
              {clonedItem}
            </Animated.View>
          )}
          {/* {showSlider && ( */}
          <View style={[styles.modalContainer, isShowSlider()]}>
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.navButton} onPress={moveLeft}>
                <Text style={styles.textIcon}>{'<'}</Text>
              </TouchableOpacity>
              <View style={styles.sliderWrapper}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onPressClose}>
                  <Text style={styles.textIcon}>{'X'}</Text>
                </TouchableOpacity>
                <FlatList
                  ref={slider}
                  keyExtractor={item => item.id}
                  data={data}
                  renderItem={renderItem}
                  showsHorizontalScrollIndicator={false}
                  initialNumToRender={1}
                  pagingEnabled
                  horizontal
                  getItemLayout={(data, index) => ({
                    length: sliderContentWidth,
                    offset: sliderContentWidth * index,
                    index,
                  })}
                  onViewableItemsChanged={_onViewableItemsChanged}
                  viewabilityConfig={_viewabilityConfig}
                  onScrollToIndexFailed={({index}) => {
                    slider.current?.scrollToOffset({
                      offset: index * sliderContentWidth,
                      animated: false,
                    });
                  }}></FlatList>
              </View>
              <TouchableOpacity style={styles.navButton} onPress={moveRight}>
                <Text style={styles.textIcon}>{'>'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* )} */}
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth,
    height: windowHeight,
  },
  modalView: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ААА',
    backgroundColor: 'rgba(155, 155, 155, 0.66)',
  },
  navButton: {
    width: sliderButtonWidth,
    height: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    height: closeButtonHeight,
  },
  textIcon: {
    fontSize: 30,
    fontWeight: '800',
    color: '#000000',
  },
  sliderWrapper: {
    width: sliderContentWidth,
    height: sliderContentHeight,
    alignItems: 'flex-end',
    color: 'black',
  },
  sliderContent: {
    justifyContent: 'center',
    alignItems: 'center',
    width: sliderContentWidth,
  },
  sliderItemWrapper: {
    width: sliderItemWidth,
    height: sliderItemHeight,
  },
});

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  ImageSourcePropType,
  Image,
} from 'react-native';
import colors from '../../config/colors';
import images from '../../config/images';
import fonts from '../../config/fonts';
import { height } from '../../config/constants';
import { CarouselData } from '../../contants/Accomodation';

const { width } = Dimensions.get('window');

const MainCarousel = ({ data }: { data: CarouselData[] }) => {
  const flatListRef = useRef<FlatList<CarouselData> | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const _renderItem = (item: CarouselData) => {
    return (
      <ImageBackground
        source={images.hotel_details as ImageSourcePropType}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        {/* <View style={styles.cardContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Journey Starts with a Great Stay</Text>
            <Text style={styles.getExtraOffText}>
              Get Extra 25% Off On 1st Booking
            </Text>
          </View>
          <View
            style={{
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              // backgroundColor: 'green',
            }}
          >
            <Image source={images.hotel} />
          </View>
        </View> */}
        {/* Optional overlay content can go here */}
      </ImageBackground>
    );
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={({ item }) => _renderItem(item)}
        keyExtractor={item => String(item.id)}
        horizontal
        pagingEnabled
        contentContainerStyle={styles.contentContainer}
        style={{ flex: 1 }}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        snapToInterval={width}
        decelerationRate="fast"
      />

      <View style={styles.pagination}>
        {data?.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height * 0.4,
    alignItems: 'center',
    // flex: 1,
    marginVertical: 20,

    // paddingHorizontal: 20,
  },
  textContainer: {
    padding: 20,
    width: '65%',
  },
  slide: {
    width: width,
    height: height * 0.4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 90,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 100,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'red',
    width: 12,
    height: 12,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.c_505050,
  },
  inactiveDot: {
    width: 12,
    height: 12,
    backgroundColor: colors.c_505050,
  },
  imageBackground: {
    height: height * 0.4,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  contentContainer: {
    // borderRadius: 10,
    // paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    // backgroundColor: 'green',
  },
  imageStyle: {
    width: width * 1,
    height: height * 0.4,
    borderRadius: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'yellow',
    width: '90%',
  },
  title: {
    color: colors.white,
    fontSize: 20,
    fontFamily: fonts.bold,
  },
  getExtraOffText: {
    color: colors.white,
    fontSize: 10,
    fontFamily: fonts.medium,
  },
});

export default MainCarousel;

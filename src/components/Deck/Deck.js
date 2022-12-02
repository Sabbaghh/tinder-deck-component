import React, { useRef, useState } from 'react';
import {
	Dimensions,
	PanResponder,
	View,
	Animated,
	StyleSheet,
	Text,
} from 'react-native';
const { width } = Dimensions.get('window');
const CARD_THRESHOLD = width * 0.25;
const SWIPE_OUT_DURATION = 250;
const Deck = (props) => {
	const { DATA } = props;
	const [currentIndex, setCurrentIndex] = useState(0);
	const position = useRef(new Animated.ValueXY()).current;
	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (event, gesture) => {
				position.setValue({ x: gesture.dx, y: gesture.dy });
			},
			onPanResponderRelease: (event, gesture) => {
				if (gesture.dx > CARD_THRESHOLD) {
					forceSwipe('right');
					// setData((prev) => prev.slice(1));
				} else if (gesture.dx < -CARD_THRESHOLD) {
					forceSwipe('left');
				} else {
					resetPosition();
				}
			},
		}),
	).current;

	// programmatically animations
	const forceSwipe = (direction) => {
		const x = direction === 'right' ? width : -width;
		Animated.timing(position, {
			toValue: { x, y: 0 },
			useNativeDriver: false,
			duration: SWIPE_OUT_DURATION,
		}).start(() => {
			onSwipeComplete(direction);
		});
	};
	const resetPosition = () => {
		Animated.spring(position, {
			toValue: { x: 0, y: 0 },
			useNativeDriver: false,
		}).start();
	};

	// callbacks
	const onSwipeComplete = (direction) => {
		const item = DATA[currentIndex];
		const defaultSwipe = () => {
			console.log('item', item, 'is swiped', direction);
		};
		const { onSwipeRight = defaultSwipe, onSwipeLeft = defaultSwipe } = props;
		direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
		position.setValue({ x: 0, y: 0 });
		setCurrentIndex((prev) => prev + 1);
	};
	//dynamic styles
	const getCardStyle = () => {
		const rotate = useRef(
			position.x.interpolate({
				inputRange: [-width, 0, width],
				outputRange: ['45deg', '0deg', '-45deg'],
			}),
		).current;
		return {
			...position.getLayout(),
			transform: [{ rotate }],
			...styles.cardStyle,
		};
	};
	//renders
	const renderCards = () => {
		const { renderCard } = props;
		const currentCardData = DATA[currentIndex];
		const followingCardData = DATA[currentIndex + 1];
		if (!currentCardData) {
			return <Text>No more!</Text>;
		}
		return (
			<>
				<Animated.View
					key={currentCardData?.id}
					{...panResponder.panHandlers}
					style={[getCardStyle()]}
				>
					{renderCard(currentCardData)}
				</Animated.View>
				{followingCardData ? (
					<Animated.View style={styles.cardsStyle} key={followingCardData?.id}>
						{renderCard(followingCardData)}
					</Animated.View>
				) : null}
			</>
		);
	};

	return <View>{renderCards()}</View>;
};

const styles = StyleSheet.create({
	cardStyle: {
		zIndex: 1,
		position: 'absolute',
		width: '100%',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.41,
		elevation: 2,
	},
	cardsStyle: {
		position: 'absolute',
		width: '100%',
	},
});
export default Deck;

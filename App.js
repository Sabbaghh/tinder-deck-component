import { StatusBar } from 'expo-status-bar';

import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import Deck from './src/components/Deck';
import { DATA } from './dummyData';
import { Card, Button, Icon } from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
export default function App() {
	const renderCard = (item) => {
		const { text, uri } = item;
		return (
			<Card>
				<Card.Image
					resizeMode='cover'
					source={{
						uri: uri,
					}}
				/>
				<Card.Divider />
				<Card.Title>{text}</Card.Title>
				<Button
					icon={
						<Icon name='code' color='#ffffff' iconStyle={{ marginRight: 10 }} />
					}
					buttonStyle={{
						borderRadius: 0,
						marginLeft: 0,
						marginRight: 0,
						marginBottom: 0,
					}}
					title='VIEW NOW'
				/>
			</Card>
		);
	};
	return (
		<>
			<SafeAreaView />
			<SafeAreaProvider>
				<Deck DATA={DATA} renderCard={renderCard} />
				<StatusBar style='auto' />
			</SafeAreaProvider>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

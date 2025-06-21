import React, {useState, useRef} from 'react';
import {SafeAreaView, Platform, ScrollView} from 'react-native';
import {Carousel} from './Carousel';
import {AuthButtons} from './AuthButtons';
import {Background} from './Background';
import {Header} from './Header';
import {useGoogleAuth} from '../../hooks/useGoogleAuth';
import {carouselItems} from '../../utils/constants';

const WelcomeScreen = ({navigation}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const {handleGoogleSignIn} = useGoogleAuth(navigation);

  const handleScroll = event => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Background>
        <Header />
        <Carousel
          ref={scrollViewRef}
          items={carouselItems}
          activeIndex={activeIndex}
          onScroll={handleScroll}
        />
        <AuthButtons
          platform={Platform.OS}
          onGoogleSignIn={handleGoogleSignIn}
          onAppleSignIn={() => console.log('Continue with Apple')}
          onEmailSignIn={() => navigation.navigate('Login')}
        />
      </Background>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
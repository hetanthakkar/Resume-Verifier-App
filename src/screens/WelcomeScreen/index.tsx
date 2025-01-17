import React, {useState, useRef} from 'react';
import {SafeAreaView, Platform} from 'react-native';
import {styles} from './styles';
import {Carousel} from './components/Carousel';
import {AuthButtons} from './components/AuthButtons';
import {Background} from './components/Background';
import {Header} from './components/Header';
import {useGoogleAuth} from '../../hooks/useGoogleAuth';
import {carouselItems} from '../../utils/constants';

const WelcomeScreen = ({navigation}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef();
  const {handleGoogleSignIn} = useGoogleAuth(navigation);

  const handleScroll = event => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };

  return (
    <SafeAreaView style={styles.container}>
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

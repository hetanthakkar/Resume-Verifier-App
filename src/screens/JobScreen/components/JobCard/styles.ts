import {StyleSheet} from 'react-native';
import {DIMENSIONS} from '../../constants/theme';

export const styles = StyleSheet.create({
  jobCard: {
    height: DIMENSIONS.CARD_HEIGHT,
    width: DIMENSIONS.CARD_WIDTH,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  jobDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  jobInfo: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  copyButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});

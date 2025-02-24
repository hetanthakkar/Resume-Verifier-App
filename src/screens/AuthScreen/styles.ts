import {Dimensions, Platform, StatusBar, StyleSheet} from 'react-native';
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingVertical: 20,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },

  lottieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.3,
    marginVertical: 20,
  },
  lottieAnimation: {
    width: width * 0.7,
    height: width * 0.7,
  },
  form: {
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2D3748',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    padding: 16,
    color: '#2D3748',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  forgotPasswordButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  otpSection: {
    marginTop: 24,
  },
  otpHeader: {
    marginBottom: 24,
  },
  verifyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4A5568',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpInput: {
    width: width * 0.13,
    height: width * 0.13,
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  otpInputFilled: {
    backgroundColor: '#EDF2F7',
    borderColor: '#4A5568',
  },
  resendButton: {
    alignSelf: 'center',
    padding: 12,
  },
  resendText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  bottomButtonContainer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    backgroundColor: 'white',
    // borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  button: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  buttonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    marginLeft: 200,
  },

  titleContainer: {
    marginLeft: -20,
  },
  subtitleText: {
    fontSize: 16,
    // color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    marginTop: -18,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
});

export default styles;

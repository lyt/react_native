import {
  Dimensions,
  StyleSheet
} from 'react-native';

const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: '#fff', //f7f7f7
    height: 240,
    paddingTop: 10,
    paddingBottom: 5,
  },
  monthContainer: {
    width: DEVICE_WIDTH,
  },
  calendarControls: {
    flexDirection: 'row',
  },
  controlButton: {},
  controlButtonText: {
    margin: 10,
    fontSize: 15,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    margin: 10,
  },
  calendarHeading: {
    flexDirection: 'row',
    //borderTopWidth: 1,
    //borderBottomWidth: 1,
  },
  dayHeading: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 5,
  },
  weekendHeading: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 5,
    color: '#343941',
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayButton: {
    alignItems: 'center',
    padding: 2,
    width: DEVICE_WIDTH / 7,
    borderTopWidth: 0,
    borderTopColor: '#e9e9e9',
    //borderTopWidth: 1, //日历下划线
    //borderTopColor: '#e9e9e9',
  },
  dayButtonFiller: {
    padding: 3,
    width: DEVICE_WIDTH / 7,
  },
  day: {
    fontSize: 14,
    color: '#383838',
    alignSelf: 'center',
    backgroundColor: 'transparent'
  },
  eventIndicatorFiller: {
    marginTop: 3,
    borderColor: 'transparent',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  eventIndicator: {
    backgroundColor: '#cccccc',
  },
  dayCircleFiller: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  currentDayCircle: {
    backgroundColor: '#f02e4b',
  },
  currentDayText: {
    color: '#2681f8',
  },
  selectedDayCircle: {
    backgroundColor: 'red',
  },
  hasEventCircle: {},
  hasEventText: {},
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  weekendDayText: {
    // color: '#cccccc',
  },
});

export default styles;

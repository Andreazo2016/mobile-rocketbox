import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  boxTitle: {
    marginTop: 50,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    marginTop: 30,
  },
  file: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },

  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileTitle: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  fileDate: {
    fontSize: 14,
    color: '#666',
    marginLeft: 30,
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    backgroundColor: '#7159c1',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
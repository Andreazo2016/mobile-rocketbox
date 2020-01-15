import React, {Component} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import FileViwer from 'react-native-file-viewer';
import socket from 'socket.io-client';
import {formatDistanceToNow, parseISO} from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import styles from './styles';
import api from '../../services/api';

export default class Box extends Component {
  state = {
    box: {},
  };
  async componentDidMount() {
    const box = await AsyncStorage.getItem('@Rocketseat:box');
    this.subcribesToNewFiles(box);
    const response = await api.get(`/boxes/${box}`);

    this.setState({box: response.data});
  }

  subcribesToNewFiles = box => {
    /**Conecta ao websocket criado no backend */
    const io = socket('http://192.168.11.8:3333');

    /**Entra na sala 'connectRoom ' que tem o id box */
    io.emit('connectRoom', box);

    /**Recebe o arquivo criado no backend via socketio */
    io.on('file', data => {
      this.setState({
        box: {...this.state.box, files: [data, ...this.state.box.files]},
      });
    });
  };

  openFile = async file => {
    const filePath = `${RNFS.DocumentDirectoryPath}/${file.title}`;
    try {
      await RNFS.downloadFile({
        fromUrl: file.url,
        toFile: filePath,
      });

      await FileViwer.open(filePath);
    } catch (error) {
      console.log('arquivo não suportado');
    }
  };
  handleUpload = () => {
    ImagePicker.launchImageLibrary({}, async upload => {
      if (upload.error) {
        console.log('error');
      } else if (upload.didCancel) {
        console.log('canceled');
      } else {
        const data = new FormData();

        data.append('file', {
          uri: upload.uri,
          type: upload.type,
          name: upload.fileName,
        });

        api.post(`/boxes/${this.state.box._id}/files`, data);
      }
    });
  };

  renderItem = ({item}) => (
    <TouchableOpacity onPress={() => this.openFile(item)} style={styles.file}>
      <View style={styles.fileInfo}>
        <Icon name="insert-drive-file" size={24} color="#a5cfff" />
        <Text style={styles.fileTitle}>{item.title}</Text>

        <Text style={styles.fileDate}>
          há{' '}
          {`${formatDistanceToNow(parseISO(item.createdAt), {
            locale: pt,
          })}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.boxTitle}>{this.state.box.title}</Text>
        <FlatList
          data={this.state.box.files}
          keyExtractor={file => file._id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={this.renderItem}
        />

        <TouchableOpacity style={styles.fab} onPress={this.handleUpload}>
          <Icon name="cloud-upload" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }
}

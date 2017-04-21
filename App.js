import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated, Easing
} from 'react-native';
import Video from 'react-native-video'
import RNFetchBlob from 'react-native-fetch-blob'
import Icon from 'react-native-vector-icons/Ionicons';
import {Provider} from 'react-redux'
import {connect} from 'react-redux'
import store from './redux/store'
import {downloadFromServer, DOWNLOAD_VIDEO} from './actions/app'
import {playVideo, PLAY_VIDEO} from './actions/app'
import {deleteFile, DELETE_FILE} from './actions/app'
import {checkFileExist, CHECK_FILE_EXIST} from './actions/app'
import {DownloadStatus, STREAM_PATH, LOCAL_VIDEO_PATH} from './constants'

const {width} = Dimensions.get('window');

// function checkFileExist(complete) {
//   RNFetchBlob.fs.exists(LOCAL_VIDEO_PATH)
//     .then((exist) => {
//       console.log('file exist', exist)
//       complete(exist)
//     })
//     .catch(() => {
//       alert('something went wrong')
//     })
// }


class UpperHalf extends React.Component {

  constructor() {
    super()
    this.state = {
      isPlaying: false,
    }
  }

  componentDidMount() {
    this.props.checkFileExist()
    // checkFileExist(existed => {
    //   this.setState({fileExist: existed})
    // })
  }

  render() {

    // const {isPlaying, fileExist} = this.state
    const path = this.props.fileExist ? LOCAL_VIDEO_PATH : STREAM_PATH
    console.log('UpperHalf render', path)
    return <View style={styles.videoContainer}>
      <Video
        source={{uri: path}}
        ref={ref => this.player = ref}
        rate={1.0}
        volume={1.0}
        muted={false}
        paused={!this.props.isPlaying}
        onLoadStart={vid => {
          console.log('load start', vid)
        }}
        onLoad={vid => {
          console.log('on load', vid)
        }}
        resizeMode="contain"
        repeat={false}
        progressUpdateInterval={250.0}
        style={styles.video}
      />
      {!this.props.isPlaying && <View style={[styles.video, {
        backgroundColor: 'black',
        opacity: 0.6,
        justifyContent: 'center',
        alignItems: 'center'
      }]}>
        <TouchableOpacity onPress={() => {
          this.props.playVideo()
        }}>
          <Icon name="ios-play-outline" size={80} color="#4F8EF7"/>
        </TouchableOpacity>
      </View>}
    </View>
  }
}


class LowerHalf extends React.Component {

  constructor() {
    super()
    this.progressBar = new Animated.Value(0)

  
    
  }

  componentDidMount() {
    this.props.checkFileExist()
    // checkFileExist(existed => {
    //   this.props.fileExist = existed
    //   // this.setState({fileExist: existed})
    // })
  }

  render() {
     Animated.timing(this.progressBar, {
          easing: Easing.inOut(Easing.ease),
          duration: 100,
          toValue: this.props.progress
        }).start()
    console.log('lower render', this.props)
    // const {fileExist} = this.state

    return <View style={{flex: 1}}>
      <TouchableOpacity
        style={{alignItems: 'center', marginVertical: 8}}
        onPress={() => {
         
          {if (this.props.downloadStatus !== DownloadStatus.DOWNLOADING) {
            this.props.downloadStatus = DownloadStatus.DOWNLOADING
            {/*this.downloadVideo()*/}
             this.props.downloadVideo()
          }
          else
            alert('Downloading')}
        }}>
        <View style={{
          width: 100,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#46895f'
        }}>
          <Text>Download</Text>
        </View>
      </TouchableOpacity>
      <View style={{
        width: '100%',
        height: 10,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: 'gray'
      }}>
      
        <Animated.View style={{
          backgroundColor: 'blue', height: 10, width: this.progressBar.interpolate({
            inputRange: [0, 1],
            outputRange: [0, width],
            extrapolate: 'clamp'
          })
        }}/>
      </View>
      {this.props.fileExist &&
      <View style={{backgroundColor: 'white', flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{marginHorizontal: 16}}>{'720-rendering.mp4'}</Text>
        <TouchableOpacity onPress={() => {
          this.props.deleteFile()
          {/*this.deleteFile(() => {
            this.downloadStatus = DownloadStatus.NONE
            this.setState({fileExist: false})
            this.setState({reload: true})
          })*/}
        }}>
          <Icon name="md-close" size={30} color="#4F8EF7"/>
        </TouchableOpacity>
      </View>}
    </View>
  }
}

const ConnectedLowerHalf =  connect((store, props) => {
    console.log('lower goi di con')
    return {
      progress: store.appReducer.progress,
      downloadStatus: store.appReducer.downloadStatus,
      fileExist: store.appReducer.fileExist
    }
  
  },
  dispatch => {
    return {
      downloadVideo: () => dispatch(downloadFromServer()),
      deleteFile: () => dispatch(deleteFile()),
      checkFileExist: () => dispatch(checkFileExist())
    }
  }
)
(LowerHalf)

const ConnectedUpperHalf =  connect((store) => {
    console.log('upper goi di con')
    return {
      isPlaying: store.appReducer.isPlaying,
      fileExist: store.appReducer.fileExist
    }
    
  },
  dispatch => {
    return {
      playVideo: () => dispatch(playVideo()),
      checkFileExist: () => dispatch(checkFileExist())
    }
  }
)
(UpperHalf)

 class StreamVideo extends React.Component {
componentDidMount() {
  this.props.checkFileExist()
    // checkFileExist(existed => {
    //   this.setState({fileExist: existed})
    // })
  }
  render() {
    return (
      <View style={styles.container} >
    
        <ConnectedUpperHalf/>
        
        <ConnectedLowerHalf />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,

    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  videoContainer: {
    width: width,
    height: 300
  },
  video: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
});

const StreamVideoRedux = connect((store) => {
    console.log('stream goi di con')
    // return {
    //   childName: store.appReducer.message
    // }
    return {}
  },
  dispatch => {
    return {
      checkFileExist: () => dispatch(checkFileExist())
    }
  }
)
(StreamVideo)

export default function provider() {
  return <Provider store={store}>
    <StreamVideoRedux/>
  </Provider>
}
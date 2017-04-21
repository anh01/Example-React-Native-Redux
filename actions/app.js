export const DOWNLOAD_VIDEO = 'DOWNLOAD_VIDEO'
export const PLAY_VIDEO = 'PLAY_VIDEO'
export const DELETE_FILE = 'DELETE_FILE'
export const CHECK_FILE_EXIST = 'CHECK_FILE_EXIST'

import RNFetchBlob from 'react-native-fetch-blob'

import {DownloadStatus, LOCAL_VIDEO_PATH, DOWNLOAD_FILE_PATH} from '../constants'

export function checkFileExist() {
  return dispatch => {
    RNFetchBlob.fs.exists(LOCAL_VIDEO_PATH)
    .then((exist) => {
      console.log('file exist', exist)
      // complete(exist)
        dispatch({type: CHECK_FILE_EXIST, fileExist: exist})
    })
    .catch(() => {
      alert('something went wrong')
    })
  }
}

export function playVideo(){
    return {type: PLAY_VIDEO, fileExist: true}
}
export function downloadFromServer() {    
  console.log('start download file')
  return dispatch => {
    RNFetchBlob
      .config({
        // add this option that makes response data to be stored as a file,
        // this is much more performant.
        fileCache: true,
        path: LOCAL_VIDEO_PATH
      })
      .fetch('GET', DOWNLOAD_FILE_PATH)
      .progress((received, total) => {
        console.log('progress', received / total)
        dispatch({type: DOWNLOAD_VIDEO, progress: received / total, downloadStatus: DownloadStatus.DOWNLOADING})
      })
      .then((res) => {
        // the temp file path
        console.log('The file saved to ', res.path())
        dispatch({type: DOWNLOAD_VIDEO,  downloadStatus: DownloadStatus.COMPLETE, fileExist: true})
        // this.downloadStatus = DownloadStatus.COMPLETE
        // this.setState({fileExist: true})
      })
  }
}

export function deleteFile(complete) {
    return dispatch => {RNFetchBlob.fs.unlink(LOCAL_VIDEO_PATH)
      .then(() => {
        complete && complete()
        dispatch({type: DELETE_FILE, downloadStatus: DownloadStatus.NONE, fileExist: false})
      })
      .catch((err) => console.log('something went wrong', err))
    }
      
  }
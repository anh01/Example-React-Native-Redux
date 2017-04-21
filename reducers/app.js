import {DOWNLOAD_VIDEO, PLAY_VIDEO, DELETE_FILE, CHECK_FILE_EXIST} from './../actions/app'

export default function appReducer(state = {}, action) {
  switch (action.type) {
    case DOWNLOAD_VIDEO:
      return {
        ...state,
        progress: action.progress,
        downloadStatus: action.downloadStatus,
        fileExist: action.fileExist
      }
      case PLAY_VIDEO:
       return {
         ...state,
         isPlaying: true,
         fileExist: true
       }
       case DELETE_FILE:
       return {
         ...state,
         downloadStatus: action.downloadStatus,
         fileExist: action.fileExist
       }
       case CHECK_FILE_EXIST:
       return {
         ...state,
         fileExist: action.fileExist
       }
  }
  return state
}
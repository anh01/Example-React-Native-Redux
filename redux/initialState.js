/**
 * Created by Dat Tran on 12/5/16.
 */
// import {LoginStatus, BookingTabbar, RouteKey} from '../constants/index'
import {DownloadStatus} from '../constants'
export default {
    appReducer: {
        calling : false,
        receivingCall: false,
        progress: 0,
    isPlaying: false,
    fileExist: false,
    downloadStatus: DownloadStatus.NONE
    }
}
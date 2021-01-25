import { observable, action, computed, reaction, } from 'mobx';
import API_URL from '../config'

export class SystemStore{
    @observable networkError = false
    @observable networkErrorInfo:Array<Response> = []
    @observable disconnected = false
    @observable jsonValidationError = false
    @observable jsonValidationErrorInfo: Array<string> = []

    @action cancleValidationError(){
        this.jsonValidationError = false
    }
}

export default new SystemStore()
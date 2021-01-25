import axios from "axios";
import firebase from "firebase"
import * as debug from "axios-debug-log"

const instance = axios.create({
    baseURL: "http://localhost:3001/gatso-2020/eu-west1/api"
})
firebase.auth().onIdTokenChanged(res => {
    firebase.auth().currentUser.getIdToken().then(res => {
        console.log(res)
        instance.defaults.headers['authorization'] = `Bearer ${res}`
    });
})

debug.addLogger(instance)

export default instance;
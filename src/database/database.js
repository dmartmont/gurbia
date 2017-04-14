import * as firebase from 'firebase'
import RNFetchBlob from 'react-native-fetch-blob'
import {Platform} from 'react-native'

export default class Database {

  static createUser(firstname, lastname, email, password) {
    try{
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(res => {
          res.updateProfile({
            displayName: (firstname + ' ' + lastname),
            photoURL: "https://firebasestorage.googleapis.com/v0/b/gurbia-79ddc.appspot.com/o/Profile%2Fplaceholder.png?alt=media&token=87da416d-ab29-4f6b-857f-c06a3618c11f"
          });
          firebase.database().ref('users/' + res.uid).set({
            username: (firstname + ' ' + lastname),
            email,
            photoURL: "https://firebasestorage.googleapis.com/v0/b/gurbia-79ddc.appspot.com/o/Profile%2Fplaceholder.png?alt=media&token=87da416d-ab29-4f6b-857f-c06a3618c11f",
            rate: '0'
          });
        });
      console.log('Success');
    } catch(error) {
      console.error(error);
    }
  }

  static loginUser(email, password) {
    try{
      firebase.auth().signInWithEmailAndPassword(email, password);
    } catch(error) {
      console.error(error);
    }
  }

  static uploadImage(uri, mime = 'application/octet-stream'){
    const Blob = RNFetchBlob.polyfill.Blob
    const fs = RNFetchBlob.fs
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
    window.Blob = Blob
    return new Promise((resolve, reject) => {
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
        const sessionId = new Date().getTime()
        let uploadBlob = null
        const imageRef = firebase.storage().ref('Food').child(`${sessionId}`)

        fs.readFile(uploadUri, 'base64')
        .then((data) => {
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
          uploadBlob = blob
          return imageRef.put(blob, { contentType: mime })
        })
        .then(() => {
          uploadBlob.close()
          return imageRef.getDownloadURL()
        })
        .then((url) => {
          resolve(url)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  static writePost(picture, title, description, location, portions, price) {
    this.uploadImage(picture)
      .then( res => {
        var user = firebase.auth().currentUser;
        var newPostKey = firebase.database().ref().child('posts').push().key;
        var postData = {
          uid:         user.uid,
          authorName:  user.displayName,
          picture:     res,
          title:       title,
          description: description,
          location:    location,
          portions:    portions,
          price:       price
        };

        var updates = {};
        updates['posts/' + newPostKey] = postData;
        updates['user-posts/' + user.uid + '/' + newPostKey] = postData;

        firebase.database().ref().update(updates);
      })
  }

  static getPosts(){
    var posts = [];
    return new Promise((resolve, reject) => {
      firebase.database().ref('posts').limitToLast(20)
      .once('value').then( (data) => {
        resolve(data.val());
      }).catch( error => {
        reject(error);
      })
    })
  }
}

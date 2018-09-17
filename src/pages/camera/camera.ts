import { CameraListPage } from './../camera-list/camera-list';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FilePath } from "@ionic-native/file-path";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
/**
 * Generated class for the CameraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {

  myPhoto: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private actionSheet: ActionSheetController,
    private camera: Camera,
    private filePath: FilePath,
    private platform: Platform,
    private sqlite: SQLite) {
  }

  ngOnInit() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql("CREATE TABLE IF NOT EXISTS photos(url varchar(250))", [])
        .then(() => console.log('table created'))
        .catch((err) => console.log(err));
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraPage');
  }

  choosePhoto(){
    let action = this.actionSheet.create({
      title: 'Escolha uma foto',
      buttons: [
        {
          text: 'Tirar Foto',
          handler: () => {
            this.takePhoto(this.camera.PictureSourceType.CAMERA, this.camera.MediaType.PICTURE)
          }
        },
        {
          text: 'Escolher Foto',
          handler: () => {
            this.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY, this.camera.MediaType.PICTURE)
          }
        },
        {
          text: 'Cancelar',
          role: 'Cancel'
        },
      ]
    });
    action.present();
  }

  savePhoto(){
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      return db.executeSql('INSERT INTO photos(url) VALUES("' + this.myPhoto + '")', [])
    }).then(() => {
      this.navCtrl.push(CameraListPage)
    }).catch((err) => console.log(err));
  }

  private takePhoto(source: number = 1, mediaType: number = 0){
    const options: CameraOptions = {
      quality: 100,
      mediaType: mediaType,
      sourceType: source,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG
    };
    this.camera.getPicture(options).then((imageData) => {
      if ( source == this.camera.PictureSourceType.PHOTOLIBRARY && this.platform.is("android")) {
        this.filePath.resolveNativePath(imageData)
          .then((filePath) => {
            this.myPhoto = filePath;
          })
      } else {
        this.myPhoto = imageData;
      }
    }).catch((err) => {
      console.log(err);
    })
  }
}

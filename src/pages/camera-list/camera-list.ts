import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";

/**
 * Generated class for the CameraListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-camera-list',
  templateUrl: 'camera-list.html',
})
export class CameraListPage {

  photos: any[] = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private sqlite: SQLite) {
  }

  ngOnInit() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      return db.executeSql('SELECT * FROM photos', []);
    }).then((result) => {
      for (let i = 0; i < result.rows.length; i++) {
        // console.log("Foto: " + result.rows.item(i)['url']);
        this.photos.push(result.rows.item(i)['url']);
      }
    }).catch((err) => console.log("Erro ao listar photos: " + err));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraListPage');
  }

}

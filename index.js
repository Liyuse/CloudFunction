'use strict';

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.


const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.computation = functions.database.ref('/cafe_list/{pushId}/busyness/input').onUpdate((change) => {

    console.log(change.after.val()["time"]);
    var color;
    console.log(change.before.val()["percent"]);
    let pre_data = change.before.val();
    let cur_data = change.after.val();

    const c = 0.1;//constant number
    let time_db_min = pre_data["time"];
    let percent_db = pre_data["percent"];
    let time_input_min = cur_data["time"];
    let percent_input = cur_data["percent"];

    if (String(pre_data["time"]).length > 8) {
        let time_db_min = Math.round((pre_data["time"]) / 60000);
    }

    if ((time_input_min - time_db_min) < 50 ) {
    let E_t = parseFloat( Math.exp(-(time_input_min - time_db_min) * c).toFixed(2));
    let percent_current = Math.round((percent_input + percent_db * E_t) / ( 1 + E_t));
    if (percent_current === -1 ){
                color = "black";
            } else if (percent_current === 0){
                color = "gray";
             } else if (percent_current <= 60 ){
                color = "green";
            } else if (percent_current <= 85){
                color = "orange";
                
            } else{
                color = "red";
    }
            return change.after.ref.parent.child("status").set({percent:percent_current,color: color});
        }
        else
            return null;

});













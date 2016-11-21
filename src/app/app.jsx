require('./app.scss');

import React from 'react';
import {render} from 'react-dom';
import Notify from './notify';
import Rebase from 're-base';

var base = Rebase.createClass({
    apiKey: "AIzaSyDVsRnizEGeZpLfX5q5_jdH3IX2HQsH_Mk",
    authDomain: "mg-notify.firebaseapp.com",
    databaseURL: "https://mg-notify.firebaseio.com",
    storageBucket: "mg-notify.appspot.com",
    messagingSenderId: "455869530143"
}, "base");

class App extends React.Component {
    constructor(props) {
        super(props);
        this.submitNotification = this.submitNotification.bind(this);
    }

    submitNotification(e) {
        var newNotification = {
            "title": this.titleInput.value,
            "content": this.contentInput.value,
            "posted": Date.now()
        };

        base.push('test-notifications', {
            data: newNotification,
            then: () => {
                this.titleInput.value = '';
                this.contentInput.value = '';
            }
        });

        e.preventDefault();
        this.titleInput.focus();
    }

    render () {
        return (
            <div>
                <form className="tester" onSubmit={this.submitNotification}>
                    <h4>Enter a test notification here:</h4>
                    <p><input id="title" ref={(input) => {this.titleInput = input;}} type="text" placeholder="Title"/></p>
                    <p><textarea id="content" ref={(input) => {this.contentInput = input;}} placeholder="Content"/></p>
                    <input type="submit" />
                </form>

                <Notify listenTo="test-notifications"/>
            </div>
        )
    }
}

render(<App/>, document.getElementById('app'));

/*
 * mg-notify
 * A simple component to display on-screen notifications.
 *
 * Usage:
 * <Notify listenTo = "..." />
 *
 * Parameters:
 * listenTo - An identifier for the stream of notifications to display. This allows for multiple distinct streams of
 *   notifications running simultaneously.
 *
 * Notes:
 * This component depends on a Firebase connection, configured below.
 */

require('./notify.scss');

import React from 'react';
import Rebase from 're-base';

const TIMEOUT = 15000;

//TODO: Throw this into a config file
var base = Rebase.createClass({
    apiKey: "AIzaSyDVsRnizEGeZpLfX5q5_jdH3IX2HQsH_Mk",
    authDomain: "mg-notify.firebaseapp.com",
    databaseURL: "https://mg-notify.firebaseio.com",
    storageBucket: "mg-notify.appspot.com",
    messagingSenderId: "455869530143"
}, "base");

//TODO: Support for manually hiding a notification pre-timeout
//TODO: Animate hide/show of notifications
//TODO: Support for multi-line notification messages without exposing a XSS risk
class Notify extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notifications: [],
            loading: true
        }

        this.hideNotification = this.hideNotification.bind(this);
    }

    hideNotification() {
        this.state.notifications.shift();
        this.setState({notifications: this.state.notifications});
    }

    componentDidMount() {
        this.ref = base.listenTo(this.props.listenTo, {
            context: this,
            asArray: true,
            queries: {
                orderByChild: 'posted',
                limitToLast: 1
            },
            then(notificationData) {
                let notifications = this.state.notifications;

                notificationData.forEach((notification, index) => {
                    if (Date.now() - notification.posted < TIMEOUT) {
                        notification.visibility = true;
                        notifications.push(notification);
                        setTimeout(this.hideNotification, TIMEOUT);
                    }
                });

                this.setState({'notifications': notifications});
            }
        });
    }

    componentWillUnmount() {
        base.removeBinding(this.ref);
    }

    render() {
        var listItems = this.state.notifications.map((item, index) => {
           return (
               <li key={index}>
                   <h3>{item.title}</h3>
                   <p>{item.content}</p>
               </li>
           )
        });

        return (
            <div className="mg-notify">
                <ul>{listItems}</ul>
            </div>
        );
    }
}

module.exports = Notify;

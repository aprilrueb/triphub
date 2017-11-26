import React from 'react';
import {Event, AddEvent} from './index';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);
function tripDates(startDate, endDate){
  let range = moment.range(startDate, endDate);
  range = Array.from(range.by('day')).map(day => {
    return day.toDate().toDateString();
  });
  return range;
}

export default class Itinerary extends React.Component {
  constructor(props) { //props is the events we tell the bot to pin?
    super(props);
    this.state = {
      events: [],
      dates: tripDates(props.startDate, props.endDate),
      showAdd: false
    };
    this.handleAddButton = this.handleAddButton.bind(this);
  }

  componentDidMount() {
    this.props.room.orderBy('time').onSnapshot((snapshot) => {
      this.setState({events: snapshot.docs});
    });
    this.props.trip.onSnapshot(snapshot => {
      const {startDate, endDate} = snapshot.data();
      if ( startDate !== this.props.startDate || endDate !== this.props.endDate){
        this.setState({dates: tripDates(startDate, endDate)})
      }
    })
  }


  handleAddButton(){
    //evt.preventDefault();
    this.setState({showAdd: !this.state.showAdd});
  }

  render() {
    return (
      <div className="col-md-6">
        <h3>Itinerary</h3>
        <button onClick={this.handleAddButton}>+</button>
        {this.state.showAdd &&
          <AddEvent
            startDate = {this.props.startDate}
            endDate = {this.props.endDate}
            room={this.props.room}
            closeForm={this.handleAddButton} />}
        <div>{
          this.state.dates.map((date, index) => (
            <div className="date-box" key={index}>
              <p className="date-text">{date}</p>
              <div>
                {this.state.events.map((event, idx) => {
                  const { itineraryStatus, time } = event.data();
                  const eventDate = time.toDateString && time.toDateString();
                  return itineraryStatus && (eventDate === date ) && (
                      <Event key={idx} {...event.data() } />
                  );}
                )}
              </div>
            </div>
          ))
        }</div>
      </div>
    );
  }
}

import React from 'react'
import './EventList.css';
import EventItem from './EventItem/EventItem';
const EventList = props => {
    const eventList = props.events.map((event) =>
        <EventItem 
        key={event._id} 
        eventId={event._id} 
        title={event.title} 
        price={event.price} 
        userId={props.userId} 
        creatorId={event.creator._id} 
        date={event.date}
        onDetail={props.onViewDetail}
        />
    )
    return (
        <ul className="event__list">
            {eventList}
        </ul>
    )
}


export default EventList

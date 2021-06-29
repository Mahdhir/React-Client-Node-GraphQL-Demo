import React from 'react'
import './BookingControl.css';
const BookingControl = props => {
    return (
        <div className="bookings-control">
            <button className={props.activeOutputType==='list'?'active':''} onClick={() => { props.changeOutputTypeHandler('list') }}>
                List
            </button>
            <button className={props.activeOutputType==='chart'?'active':''} onClick={() => { props.changeOutputTypeHandler('chart') }}>
                Chart
            </button>
        </div>
    )
}



export default BookingControl

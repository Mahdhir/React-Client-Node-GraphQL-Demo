import React from 'react';
import { Bar as BarChart } from 'react-chartjs';
const BOOKING_BINS = {
    'Cheap': {
        min: 0,
        max: 100
    },
    'Normal': {
        min: 100,
        max: 200
    },
    'Expensive': {
        min: 200,
        max: Number.MAX_VALUE
    }
}
const BookingsChart = (props) => {
    console.log(props.bookings);
    const chartData = { labels: [], datasets: [] };
    let values = [];
    for (const bucket in BOOKING_BINS) {
        const filteredBookingsCount = props.bookings.reduce((prev, current) => {
            if (current.event.price < BOOKING_BINS[bucket].max && current.event.price > BOOKING_BINS[bucket].min) {
                return prev + 1;
            }
            return prev;
        }, 0);
        values.push(filteredBookingsCount);
        chartData.labels.push(bucket);
        chartData.datasets.push({
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: values
        })
        values = [...values];
        values[values.length - 1] = 0;
    }
    return (
        <div style={{ textAlign: 'center' }}>
            <BarChart data={chartData} />
        </div>

    )
}

export default BookingsChart

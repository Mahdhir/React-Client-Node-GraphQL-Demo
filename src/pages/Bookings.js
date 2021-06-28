/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import BookingList from '../components/Bookings/BookingList/BookingList';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';


function BookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const authContext = useContext(AuthContext);
    const isActive = useRef(true);
    useEffect(() => {
        fetchBookings();
        return () => {
            isActive.current = false;
        }
    }, [])

    const fetchBookings = async () => {
        setIsLoading(true);
        const payload = {
            query: `
                query {
                    bookings{
                        _id,
                        createdAt
                        event {
                            _id
                            title
                            date
                        }
                    }
                }
                `
        }
        try {

            const response = await axios.post("http://localhost:8000/graphql", JSON.stringify(payload), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authContext.token}`
                }
            });
            if (response.status !== 200 && response.status !== 201) {
                throw new Error("Failed");
            }
            const resData = response.data.data;
            console.log(resData);
            const resBookings = resData.bookings;
            if (!resBookings)
                throw new Error('Something went wrong');
            if (isActive.current)
                setBookings(resBookings);
        } catch (error) {
            console.log(error.response ? error.response : error);
            alert(error.response ? error.response : error);
        } finally {
            setIsLoading(false);
        }
    }

    const bookingDeleteHandler = async (bookingId) => {
        const payload = {
            query: `
            mutation {
                cancelBooking(bookingId: "${bookingId}"){
                    _id,
                    title
                }
            }
            `
        }
        try {

            const response = await axios.post("http://localhost:8000/graphql", JSON.stringify(payload), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authContext.token}`
                }
            });
            if (response.status !== 200 && response.status !== 201) {
                throw new Error("Failed");
            }
            const resData = response.data.data;
            console.log(resData);
            const resBookings = resData.bookings;
            if (!resBookings)
                throw new Error('Something went wrong');
            if (isActive.current){
                const prevBookings = [...bookings];
                const currentBookings = prevBookings.filter(booking => booking._id !== bookingId)
                setBookings(currentBookings);
            }
        } catch (error) {
            console.log(error.response ? error.response : error);
            alert(error.response ? error.response : error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {isLoading ? (
                <Spinner />
            ) : (
                <BookingList bookings={bookings} onDelete={bookingDeleteHandler} />
            )}
        </>
    )
}

export default BookingsPage;
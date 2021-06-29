import React, { useContext, useEffect, useRef, useState } from 'react';
import './Events.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import axios from 'axios';
import AuthContext from '../context/auth-context';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';
function EventsPage() {
    const [creatingEvent, setCreatingEvent] = useState(false);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const titleEl = useRef(null);
    const priceEl = useRef(null);
    const dateEl = useRef(null);
    const descriptionEl = useRef(null);
    const isActive = useRef(true);
    const authContext = useContext(AuthContext);
    useEffect(() => {
        fetchEvents();
        return () => {
            isActive.current=false;
        }
    }, [])

    const startCreateEventHandler = () => {
        setCreatingEvent(true);
    }

    const modalConfirmHandler = async () => {
        const title = titleEl.current.value;
        const price = +priceEl.current.value;
        const date = dateEl.current.value;
        const description = descriptionEl.current.value;
        if (title.trim().length === 0 || price === "" || price <= 0 || date.trim().length === 0 || description.trim().length === 0) {
            return;
        }
        const event = { title, price, date, description };
        console.log(event);

        const payload = {
            query: `
            mutation CreateEvent($title:String!,$price:Float!,$date:String!,$desc:String!){
                createEvent(eventInput:{title:$title,price:$price,date:$date,description:$desc}){
                    _id,
                    title
                    price
                    description
                    date
                    creator{
                        _id
                        email
                    }
                }
            }
            `,
            variables:{
                title:event.title,
                price:event.price,
                date:event.date,
                desc:event.description
            }
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
            // fetchEvents();
            const updatedEvents = [...events];
            updatedEvents.push(resData.createEvent);
            setEvents(updatedEvents);
        } catch (error) {
            console.log(error.response ? error.response : error);
            alert(error.response ? error.response : error);
        }
        setCreatingEvent(false)

    }
    const modalCancelHandler = () => {
        setCreatingEvent(false);
        setSelectedEvent(null);
    }

    const fetchEvents = async () => {
        setIsLoading(true);
        const payload = {
            query: `
            query {
                events{
                    _id,
                    title
                    price
                    description
                    date
                    creator{
                        _id
                        email
                    }
                }
            }
            `
        }
        try {

            const response = await axios.post("http://localhost:8000/graphql", JSON.stringify(payload), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status !== 200 && response.status !== 201) {
                throw new Error("Failed");
            }
            const resData = response.data.data;
            console.log(resData);
            const resEvents = resData.events;
            if (!resEvents)
                throw new Error('Something went wrong');
            if(isActive.current)
            setEvents(resEvents);
        } catch (error) {
            console.log(error.response ? error.response : error);
            alert(error.response ? error.response : error);
        } finally {
            setIsLoading(false);
        }
    }

    const showDetailHandler = eventId => {
        const event = events.find(event => event._id === eventId);
        setSelectedEvent(event);
    }

    const bookEventHandler = async() => {
        if(!authContext.token){
            setSelectedEvent(null);
            return;
        }
        // setIsLoading(true);
        const payload = {
            query: `
            mutation BookEvent($id:ID!){
                bookEvent(eventId: $id){
                    _id,
                    createdAt,
                    updatedAt
                }
            }
            `,
            variables:{
                id:selectedEvent._id
            }
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
        } catch (error) {
            console.log(error.response ? error.response : error);
            alert(error.response ? error.response : error);
        } finally {
            setSelectedEvent(null);
        }
    }

    return (
        <>
            {creatingEvent && <><Backdrop />
                <Modal 
                    title="Add Event" 
                    canCancel 
                    canConfirm 
                    onCancel={modalCancelHandler} 
                    onConfirm={modalConfirmHandler}
                    confirmText="Confirm"
                    >
                    <form>
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={titleEl}></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="price">Price</label>
                            <input type="number" id="price" ref={priceEl}></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input type="datetime-local" id="date" ref={dateEl}></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <textarea id="description" rows="4" ref={descriptionEl}></textarea>
                        </div>
                    </form>
                </Modal>
            </>
            }
            {selectedEvent && <><Backdrop />
                <Modal
                    title={selectedEvent.title}
                    canCancel
                    canConfirm
                    onCancel={modalCancelHandler}
                    onConfirm={bookEventHandler}
                    confirmText={authContext.token ? 'Book':'OK'}
                >
                    <h1>{selectedEvent.title}</h1>
                    <h2>
                        ${Number.parseFloat(selectedEvent.price).toFixed(2) + " - " + new Date(selectedEvent.date).toLocaleString()}
                    </h2>
                    <p>{selectedEvent.description}</p>
                </Modal>
            </>
            }
            {authContext.token && <div className="events-control">
                <p>Share your own events</p>
                <button className="btn" onClick={startCreateEventHandler}>
                    Create Event
                </button>
            </div>}
            {isLoading ? (
                <Spinner />
            ) : (
                <EventList
                    events={events}
                    userId={authContext.userId}
                    onViewDetail={showDetailHandler}
                />
            )}

        </>
    )
}

export default EventsPage;
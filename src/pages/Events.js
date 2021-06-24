import React, { useContext, useEffect, useRef, useState } from 'react';
import './Events.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import axios from 'axios';
import AuthContext from '../context/auth-context';

function EventsPage() {
    const [creatingEvent, setCreatingEvent] = useState(false);
    const [events, setEvents] = useState([]);
    const titleEl = useRef(null);
    const priceEl = useRef(null);
    const dateEl = useRef(null);
    const descriptionEl = useRef(null);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        fetchEvents();
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
            mutation {
                createEvent(eventInput:{title:"${event.title}",price:${event.price},date:"${event.date}",description:"${event.description}"}){
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
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authContext.token}`
                }
            });
            if (response.status !== 200 && response.status !== 201) {
                throw new Error("Failed");
            }
            const resData = response.data.data;
            console.log(resData);
            fetchEvents();
        } catch (error) {
            console.log(error.response ? error.response : error);
            alert(error.response ? error.response : error);
        }
        setCreatingEvent(false)

    }
    const modalCancelHandler = () => {
        setCreatingEvent(false)
    }

    const fetchEvents = async () => {
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
            if(!resEvents)
            throw new Error('Something went wrong');
            setEvents(resEvents);
        } catch (error) {
            console.log(error.response ? error.response : error);
            alert(error.response ? error.response : error);
        }
    }

    return (
        <>
            {creatingEvent && <><Backdrop />
                <Modal title="Add Event" canCancel canConfirm onCancel={modalCancelHandler} onConfirm={modalConfirmHandler}>
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
            {authContext.token && <div className="events-control">
                <p>Share your own events</p>
                <button className="btn" onClick={startCreateEventHandler}>
                    Create Event
                </button>
            </div>}
            <ul className="events__list">
                {events.map((event,index) => 
                    <li key={index} className="events__list-item">{event.title}</li>
                )}
            </ul>
        </>
    )
}

export default EventsPage;
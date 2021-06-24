import React, { useState } from 'react';
import './Events.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
function EventsPage() {
    const [creatingEvent, setCreatingEvent] = useState(false);

    const startCreateEventHandler = () => {
        setCreatingEvent(true);
    }

    const modalConfirmHandler = () => {
        setCreatingEvent(false)
    }
    const modalCancelHandler = () => {
        setCreatingEvent(false)
    }

    return (
        <>
            {creatingEvent && <><Backdrop />
                <Modal title="Add Event" canCancel canConfirm onCancel={modalCancelHandler} onConfirm={modalConfirmHandler}>
                    <p>Modal Content</p>
                </Modal>
            </>
            }
            <div className="events-control">
                <p>Share your own events</p>
                <button className="btn" onClick={startCreateEventHandler}>
                    Create Event
                </button>
            </div>
        </>
    )
}

export default EventsPage;
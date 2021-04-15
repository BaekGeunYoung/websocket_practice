import React, {useEffect, useState} from 'react';
import queryString from 'query-string';

const ChatPage = ({history, location, match}) => {
    const params = queryString.parse(location.search)
    const displayName = params.display_name
    const roomName = params.room_name

    const ws = new WebSocket("ws://localhost:8080/ws");
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState(null);
    const [currMsg, setCurrMsg] = useState("");

    useEffect(() => {
        const data = {
            meta: "join",
            roomName: roomName,
            displayName: displayName
        }

        // ws = new WebSocket("ws://localhost:8080/ws");

        ws.onopen = () => {
            console.log("connected!!");
            ws.send(JSON.stringify(data))
        };

        ws.onmessage = (evt) => {
            console.log("message received.")
            console.log(JSON.parse(evt.data));

            setNewMsg(JSON.parse(evt.data))
        };

    }, [])

    useEffect(() => {
        if (newMsg) {
            setMessages(
                messages.concat(newMsg)
            )
        }
    }, [newMsg])

    const handleChangeCurrMsg = (msg: string) => {
        setCurrMsg(msg)
    }

    const handleClickSendMsg = () => {
        const data = {
            roomName: roomName,
            displayName: displayName,
            message: currMsg
        }

        ws.send(JSON.stringify(data))

        setCurrMsg("")
    }

    return (
        <div>
            <div>
                {
                    messages.map(message =>
                        <div>
                            <div>{message.displayName}</div>
                            <div>{message.message}</div>
                            <hr />
                        </div>
                    )
                }
            </div>
            <div>
                <input value={currMsg} onChange={(e) => handleChangeCurrMsg(e.target.value)}/>
                <button onClick={handleClickSendMsg}>send</button>
            </div>
        </div>
    )
}

export default ChatPage;
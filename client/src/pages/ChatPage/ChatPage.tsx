import React, {useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';
import queryString from 'query-string';
import "./index.scss";

type Message = {
    displayName: string,
    message: string
}

const ChatPage = ({ history, location, match }: RouteComponentProps) => {
    const params = queryString.parse(location.search)
    const displayName = params.display_name
    const roomName = params.room_name

    const ws = new WebSocket("ws://localhost:8080/ws");
    const [messages, setMessages] = useState<Array<Message>>([]);
    const [newMsg, setNewMsg] = useState<Message | undefined>(undefined);
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
        if (currMsg === "") {
            alert("메세지를 입력하세요")
            return
        }

        const data = {
            roomName: roomName,
            displayName: displayName,
            message: currMsg
        }

        ws.send(JSON.stringify(data))

        setCurrMsg("")
    }

    const handleKeyPress = (key: string) => {
        if (key === "Enter") handleClickSendMsg()
    }

    return (
        <div className={"chat-page-container"}>
            <div className={"room-name-container"}>
                {roomName}
            </div>
            <div className={"chat-message-list-container"}>
                <div className={"chat-message-list-inner-container"}>
                    {
                        messages.map(message =>
                            <div className={`chat-message-form ${message.displayName === displayName ? "me" : "other"}`}>
                                <div className={"chat-message-inner-form"}>
                                    <div className={`chat-display-name`}>
                                        {message.displayName}
                                    </div>
                                    <div className={"chat-message"}>{message.message}</div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <div className={"chat-input-container"}>
                <input
                    className={"chat-input"}
                    value={currMsg}
                    onChange={(e) => handleChangeCurrMsg(e.target.value)}
                    onKeyPress={e => handleKeyPress(e.key)}
                />
                <button className={"chat-send-button"} onClick={handleClickSendMsg}>send</button>
            </div>
        </div>
    )
}

export default ChatPage;
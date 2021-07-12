import React, {useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';
import queryString from 'query-string';
import "./index.scss";

type Message = {
    author: string,
    message: string
}

type PathVariables = {
    id: number
}

const ChatPage = ({ history, location, match }: RouteComponentProps) => {
    const params = queryString.parse(location.search)
    const displayName = params.display_name

    const {id} = match.params as PathVariables

    const [ws, setWs] = useState<WebSocket>();
    const [messages, setMessages] = useState<Array<Message>>([]);
    const [newMsg, setNewMsg] = useState<Message | undefined>(undefined);
    const [currMsg, setCurrMsg] = useState("");

    useEffect(() => {
        setWs(new WebSocket(`ws://localhost:8080/chat?id=${id}&name=${displayName}`))
    }, [])

    useEffect(() => {
        if (ws) {
            ws.onmessage = (evt) => {
                setNewMsg(JSON.parse(evt.data))
            };
        }
    }, [ws])

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

        ws!!.send(currMsg)

        setCurrMsg("")
    }

    const handleKeyPress = (key: string) => {
        if (key === "Enter") handleClickSendMsg()
    }

    return (
        <div className={"chat-page-container"}>
            <div className={"room-name-container"}>
                {id}
            </div>
            <div className={"chat-message-list-container"}>
                <div className={"chat-message-list-inner-container"}>
                    {
                        messages.map(message =>
                            <div className={`chat-message-form ${message.author === displayName ? "me" : "other"}`}>
                                <div className={"chat-message-inner-form"}>
                                    <div className={`chat-display-name`}>
                                        {message.author}
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
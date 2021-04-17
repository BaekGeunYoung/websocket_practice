import React, {useState} from 'react';
import {RouteComponentProps} from 'react-router';
import "./index.scss";

const IntroPage = ({history}: RouteComponentProps) => {
    const [displayName, setDisplayName] = useState("")
    const [roomName, setRoomName] = useState("")

    const handleChangeDpName = (dpName: string) => setDisplayName(dpName)

    const handleChangeRoomName = (roomName: string) => setRoomName(roomName)

    const handleClickJoinButton = () => {
        history.push(`/chat?display_name=${displayName}&room_name=${roomName}`)
    }

    return (
        <div className="intro-page-container">
            <div className={"input-container"}>
                <span className={"title"}>
                    근영이의 카톡방
                </span>
                <div className={"input-inner-container"}>
                    <input className={"display-name-input"} placeholder={"display name"} onChange={(e) => handleChangeDpName(e.target.value)}/>
                    <input className={"room-number-input"} placeholder={"room number"} onChange={(e) => handleChangeRoomName(e.target.value)}/>
                    <button className={"join-button"} onClick={handleClickJoinButton}>입장</button>
                </div>
            </div>
        </div>
    )
}

export default IntroPage;
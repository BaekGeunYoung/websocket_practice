import React, {useState} from 'react';

const IntroPage = ({history}) => {
    const [displayName, setDisplayName] = useState("")
    const [roomName, setRoomName] = useState(0)

    const handleChangeDpName = (dpName) => setDisplayName(dpName)

    const handleChangeRoomName = (roomName) => setRoomName(roomName)

    const handleClickJoinButton = () => {
        history.push(`/chat?display_name=${displayName}&room_name=${roomName}`)
    }

    return (
        <div className="intro-page-container">
            <div className={"input-container"}>
                <input className={"display-name-input"} placeholder={"display name"} onChange={(e) => handleChangeDpName(e.target.value)}/>
                <input className={"room-number-input"} placeholder={"room number"} onChange={(e) => handleChangeRoomName(e.target.value)}/>
                <button className={"join-button"} onClick={handleClickJoinButton}>입장</button>
            </div>
        </div>
    )
}

export default IntroPage;
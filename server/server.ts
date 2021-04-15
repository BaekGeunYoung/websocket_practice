const WebSocketS = require("ws").Server;

export class Server {
    public clients: any = [];
    public wss: any = null;
    public server: any = null;

    public start(port: number) {
        this.wss = new WebSocketS({ port: port });  // 내가 설정한 port로 websocket 서버를 연다
        console.log("WebSocket Initialized", port);

        this.wss.on("close", function (error: any) {
            console.log("websever close", error);
        });
        this.wss.on("error", function (error: any) {
            console.log(error);
        });

        const rooms = {};

        this.wss.on("connection", (ws: any) => {
            const leave = (roomName, displayName) => {
                // not present: do nothing
                if(! rooms[roomName][displayName]) return;

                // if the one exiting is the last one, destroy the room
                if(Object.keys(rooms[roomName]).length === 1) delete rooms[roomName];
                // otherwise simply leave the room
                else delete rooms[roomName][displayName];
            };

            ws.on("message", data => {
                const { message, meta, roomName, displayName } = JSON.parse(data);

                if(meta === "join") {
                    if(! rooms[roomName]) rooms[roomName] = {}; // create the room
                    if(! rooms[roomName][displayName]) {
                        rooms[roomName][displayName] = ws;

                        console.log(`${displayName} joined in ${roomName}`)
                        console.log(`now there are ${Object.keys(rooms[roomName]).length} people in ${roomName}`)
                    } // join the room

                }
                else if(meta === "leave") {
                    leave(roomName, displayName);
                }
                else if(! meta) {
                    console.log("received message")
                    console.log(message)
                    // send the message to all in the room
                    // @ts-ignore
                    Object.entries(rooms[roomName]).forEach(([, socket]) => socket.send(JSON.stringify({message, displayName})));
                }
            });

            ws.on("close", () => {
                // for each room, remove the closed socket
                Object.keys(rooms).forEach(room => {
                    Object.entries(room).forEach(([displayName, _]) => leave(room, displayName))
                });
            });
        });
    }
}

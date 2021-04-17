const WebSocketS = require("ws").Server;

function noop() {}

function heartbeat() {
    this.isAlive = true;
}

export class Server {
    public rooms = {};
    public wss: any = null;

    public start(port: number) {
        this.wss = new WebSocketS({ port: port });  // 내가 설정한 port로 websocket 서버를 연다
        console.log("WebSocket Initialized", port);

        this.wss.on("close", function (error: any) {
            console.log("websever close", error);
        });
        this.wss.on("error", function (error: any) {
            console.log(error);
        });

        const self = this;

        const interval = setInterval(() => {
            // ex) room == { user1 : ws1, user2 : ws2, user3 : ws3 }
            Object.entries(self.rooms).forEach(([roomName, room]) => {
                Object.entries(room).forEach(([displayName, ws]) => {
                    if (ws.isAlive === false) {
                        console.log(`pong did not arrive from ${displayName} in ${roomName}`)
                        ws.terminate();
                        delete this.rooms[roomName][displayName];
                        return;
                    }

                    ws.isAlive = false;
                    ws.ping(noop);
                })
            })
        }, 3000);

        // const rooms = {};

        this.wss.on("connection", (ws: any) => {
            const leave = (roomName, displayName) => {
                // not present: do nothing
                if(! this.rooms[roomName][displayName]) return;

                // if the one exiting is the last one, destroy the room
                if(Object.keys(this.rooms[roomName]).length === 1) delete this.rooms[roomName];
                // otherwise simply leave the room
                else delete this.rooms[roomName][displayName];
            };

            ws.on('pong', heartbeat);

            ws.on("message", data => {
                const { message, meta, roomName, displayName } = JSON.parse(data);

                if(meta === "join") {
                    if(! this.rooms[roomName]) this.rooms[roomName] = {}; // create the room
                    if(! this.rooms[roomName][displayName]) {
                        this.rooms[roomName][displayName] = ws;

                        console.log(`${displayName} joined in ${roomName}`)
                        console.log(`now there are ${Object.keys(this.rooms[roomName]).length} people in ${roomName}`)
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
                    Object.entries(this.rooms[roomName]).forEach(([, socket]) => socket.send(JSON.stringify({message, displayName})));
                }
            });

            ws.on("close", () => {
                // for each room, remove the closed socket
                Object.keys(this.rooms).forEach(room => {
                    Object.entries(room).forEach(([displayName, _]) => leave(room, displayName))
                });
            });
        });


        this.wss.on('close', function close() {
            clearInterval(interval);
        });

    }
}

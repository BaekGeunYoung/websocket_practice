package com.example.chat_server_kt.model

import com.example.chat_server_kt.actor.RoomActorMsg
import com.example.chat_server_kt.actor.roomActor
import kotlinx.coroutines.channels.SendChannel
import kotlinx.coroutines.coroutineScope
import java.lang.Exception
import java.util.concurrent.ConcurrentHashMap

object Rooms {
    private val rooms: ConcurrentHashMap<Int, SendChannel<RoomActorMsg>> = ConcurrentHashMap()

    fun findOrCreate(roomId: Int): SendChannel<RoomActorMsg> =
        rooms[roomId] ?: createNewRoom(roomId)

    private fun createNewRoom(roomId: Int) = roomActor(roomId)
            .also { actor -> rooms[roomId] = actor }
}

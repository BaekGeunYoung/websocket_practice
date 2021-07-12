package com.example.chat_server_kt.actor

import com.example.chat_server_kt.presentation.jsonMapper
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.channels.actor
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.web.reactive.socket.WebSocketSession
import reactor.kotlin.core.publisher.toMono

fun routeActor(session: WebSocketSession) = GlobalScope.actor<UserOutgoingMessage> {
    val jsonMapper = jsonMapper()

    for (msg in channel) {
        session.send(
            session.textMessage(jsonMapper.writeValueAsString(msg)).toMono()
        ).awaitSingleOrNull()
    }
}

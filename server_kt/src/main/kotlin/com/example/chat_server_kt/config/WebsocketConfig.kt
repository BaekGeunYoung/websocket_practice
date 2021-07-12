package com.example.chat_server_kt.config

import com.example.chat_server_kt.presentation.WSHandler
import com.fasterxml.jackson.databind.PropertyNamingStrategy
import kotlinx.coroutines.InternalCoroutinesApi
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder
import org.springframework.web.reactive.HandlerMapping
import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping
import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter


@Configuration
class WebsocketConfig {
    @Bean
    @InternalCoroutinesApi
    fun handlerMapping(): HandlerMapping {
        val map = mapOf("/chat" to WSHandler())
        val order = -1 // before annotated controllers

        return SimpleUrlHandlerMapping(map, order)
    }

    @Bean
    fun handlerAdapter() =  WebSocketHandlerAdapter()
}

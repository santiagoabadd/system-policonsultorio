package com.santidev.user_service.controllers;

import com.santidev.user_service.model.dtos.AuthRequest;
import com.santidev.user_service.model.dtos.ClientRequest;
import com.santidev.user_service.model.dtos.ClientResponse;
import com.santidev.user_service.model.entities.Client;
import com.santidev.user_service.services.ClientService;
import com.santidev.user_service.services.JWTService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    private final AuthenticationManager authenticationManager;

    private final JWTService jwtService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void addClient(@RequestBody ClientRequest clientRequest) {
        this.clientService.addClient(clientRequest);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ClientResponse> getAllClients(){
        return this.clientService.getAllClients();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ClientResponse getClienteById(@PathVariable("id") Long id){
        return this.clientService.getById(id);
    }

    @GetMapping("/user")
    public ClientResponse getUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");

        String username = jwtService.extractUsername(token);

        return clientService.findByUserName(username);
    }

    @PostMapping("/register")
    public void addNewUser(@RequestBody ClientRequest user) {
        this.clientService.addClient(user);
    }

    @PostMapping("/token")
    public String getToken(@RequestBody AuthRequest authRequest) {

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getUserName(),authRequest.getPassword()));

        if(authentication.isAuthenticated()){
            return this.clientService.generateToken(authRequest.getUserName());
        }else{
            throw new RuntimeException("invalid access");
        }


    }

    @GetMapping("/validate")
    public String validateToken(@RequestParam("token") String token) {
        this.clientService.validateToken(token);
        return "Token is valid";
    }


}

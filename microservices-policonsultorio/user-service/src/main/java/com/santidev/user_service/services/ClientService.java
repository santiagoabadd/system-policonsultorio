package com.santidev.user_service.services;



import com.santidev.user_service.model.dtos.ClientRequest;
import com.santidev.user_service.model.dtos.ClientResponse;
import com.santidev.user_service.model.entities.Client;
import com.santidev.user_service.model.entities.Role;
import com.santidev.user_service.repositories.ClientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j

public class ClientService {

    private final ClientRepository clientRepository;

    private final PasswordEncoder passwordEncoder;

    private final JWTService jwtService;


    public ClientResponse addClient(ClientRequest clientRequest) {
        var client = Client.builder()
                .userName((clientRequest.getUserName()))
                .password(passwordEncoder.encode(clientRequest.getPassword()))
                .firstName(clientRequest.getFirstName())
                .lastName(clientRequest.getLastName())
                .email(clientRequest.getEmail())
                .role(Role.valueOf(clientRequest.getRole().toUpperCase()))
                .build();

        Client clientResponse=clientRepository.save(client);

        return mapToClientResponse(clientResponse);
    }

    public String generateToken(Client client) {
        return jwtService.generateToken(client);
    }

    public void validateToken(String token) {
        jwtService.validateToken(token);
    }

    public List<ClientResponse> getAllClients() {
        var clients = clientRepository.findAll();
        return clients.stream().map(this::mapToClientResponse).toList();
    }

    public ClientResponse getById(Long id) {
        Optional<Client> client = clientRepository.findById(id);
        return mapToClientResponse(client.get());
    }


    public ClientResponse findByUserName(String userName) {
        return mapToClientResponse(clientRepository.findByUserName(userName).get());
    }

    public Client findByUserNameClient(String userName) {
        return clientRepository.findByUserName(userName).orElseThrow(()-> new RuntimeException("No se econtro un cliente con esa id"));
    }



    private ClientResponse mapToClientResponse(Client client) {
        return ClientResponse.builder()
                .id(client.getId())
                .userName((client.getUserName()))
                .firstName(client.getFirstName())
                .lastName(client.getLastName())
                .email(client.getEmail())
                .role(client.getRole().toString())
                .build();
    }
}
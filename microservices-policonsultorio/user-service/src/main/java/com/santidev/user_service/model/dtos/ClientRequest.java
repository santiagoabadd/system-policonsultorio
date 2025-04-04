package com.santidev.user_service.model.dtos;

import com.santidev.user_service.model.entities.Address;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder

public class ClientRequest {
    private String userName;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private Address address;
}

package com.santidev.user_service.model.dtos;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class ClientResponse {
    private Long id;
    private String userName;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
}

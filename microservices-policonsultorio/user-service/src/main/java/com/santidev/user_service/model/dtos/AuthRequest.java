package com.santidev.user_service.model.dtos;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class AuthRequest {

    private String userName;
    private String password;
}

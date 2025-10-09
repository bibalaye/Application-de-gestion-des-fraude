package com.example.alertservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserKPIs {
    private long totalUsers;
    private long activeUsers;
    private long inactiveUsers;
    private long newUsersToday;
    private long adminUsers;
    private long regularUsers;
}

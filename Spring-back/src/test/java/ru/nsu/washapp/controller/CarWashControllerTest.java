package ru.nsu.washapp.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import ru.nsu.washapp.dto.CarWashResponse;
import ru.nsu.washapp.dto.PageResponse;
import ru.nsu.washapp.exception.ApiException;
import ru.nsu.washapp.exception.GlobalExceptionHandler;
import ru.nsu.washapp.service.CarWashService;
import ru.nsu.washapp.service.JwtService;
import ru.nsu.washapp.service.UserService;

import java.time.OffsetDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.nullable;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.http.HttpStatus;

@WebMvcTest(CarWashController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class CarWashControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CarWashService carWashService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private UserService userService;

    @Test
    void list_returns200AndBody() throws Exception {
        CarWashResponse item = new CarWashResponse(
                10L,
                "Мойка №1",
                "г. Новосибирск, ул. Пушкина, д. 10",
                55.012345,
                82.987654,
                OffsetDateTime.parse("2025-11-20T14:21:16Z")
        );
        PageResponse<CarWashResponse> response = new PageResponse<>(
                List.of(item),
                0,
                20,
                1,
                1
        );
        when(carWashService.list(anyInt(), anyInt(), nullable(String.class))).thenReturn(response);

        mockMvc.perform(get("/api/v1/car-washes")
                        .param("page", "0")
                        .param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(10))
                .andExpect(jsonPath("$.content[0].name").value("Мойка №1"))
                .andExpect(jsonPath("$.content[0].address").exists())
                .andExpect(jsonPath("$.content[0].created_at").exists())
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(20))
                .andExpect(jsonPath("$.total_elements").value(1))
                .andExpect(jsonPath("$.total_pages").value(1));
    }

    @Test
    void getById_returns200AndBody() throws Exception {
        CarWashResponse response = new CarWashResponse(
                10L,
                "Мойка №1",
                "г. Новосибирск, ул. Пушкина, д. 10",
                55.012345,
                82.987654,
                OffsetDateTime.parse("2025-11-20T14:21:16Z")
        );
        when(carWashService.getById(10L)).thenReturn(response);

        mockMvc.perform(get("/api/v1/car-washes/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.name").value("Мойка №1"))
                .andExpect(jsonPath("$.created_at").exists());
    }

    @Test
    void getById_notFound_returnsStructuredError() throws Exception {
        when(carWashService.getById(999L)).thenThrow(new ApiException(
                HttpStatus.NOT_FOUND,
                "RESOURCE_NOT_FOUND",
                "Car wash not found",
                null
        ));

        mockMvc.perform(get("/api/v1/car-washes/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error.code").value("RESOURCE_NOT_FOUND"));
    }

    @Test
    void create_returns201AndBody() throws Exception {
        CarWashResponse response = new CarWashResponse(
                11L,
                "Мойка №2",
                "г. Новосибирск, ул. Ленина, д. 5",
                55.012345,
                82.987654,
                OffsetDateTime.parse("2025-11-21T10:00:00Z")
        );
        when(carWashService.create(any())).thenReturn(response);

        String body = """
                {
                  "name": "Мойка №2",
                  "address": "г. Новосибирск, ул. Ленина, д. 5",
                  "latitude": 55.012345,
                  "longitude": 82.987654
                }
                """;

        mockMvc.perform(post("/api/v1/car-washes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(11))
                .andExpect(jsonPath("$.name").value("Мойка №2"))
                .andExpect(jsonPath("$.created_at").exists());
    }

    @Test
    void create_validationError_returnsStructuredError() throws Exception {
        String body = """
                {
                  "name": "",
                  "address": "",
                  "latitude": 120,
                  "longitude": 200
                }
                """;

        mockMvc.perform(post("/api/v1/car-washes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.error.details.name").exists());
    }

    @Test
    void update_returns200AndBody() throws Exception {
        CarWashResponse response = new CarWashResponse(
                10L,
                "Новое имя",
                "Новый адрес",
                55.012345,
                82.987654,
                OffsetDateTime.parse("2025-11-20T14:21:16Z")
        );
        when(carWashService.update(anyLong(), any())).thenReturn(response);

        String body = """
                {
                  "name": "Новое имя",
                  "address": "Новый адрес"
                }
                """;

        mockMvc.perform(patch("/api/v1/car-washes/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.name").value("Новое имя"));
    }

    @Test
    void update_noFields_returnsStructuredError() throws Exception {
        when(carWashService.update(anyLong(), any())).thenThrow(new ApiException(
                HttpStatus.BAD_REQUEST,
                "VALIDATION_ERROR",
                "No fields provided for update",
                null
        ));

        mockMvc.perform(patch("/api/v1/car-washes/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error.code").value("VALIDATION_ERROR"));
    }
}

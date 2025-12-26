package ru.nsu.washapp.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import ru.nsu.washapp.dto.ApiError;
import ru.nsu.washapp.dto.ApiErrorResponse;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(err ->
                errors.put(toSnakeCase(err.getField()), err.getDefaultMessage())
        );

        ApiError error = new ApiError(
                "VALIDATION_ERROR",
                "Некорректные данные запроса",
                errors
        );
        return ResponseEntity.badRequest().body(new ApiErrorResponse(error));
    }

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiErrorResponse> handleApiException(ApiException ex) {
        ApiError error = new ApiError(
                ex.getCode(),
                ex.getMessage(),
                ex.getDetails()
        );
        return ResponseEntity.status(ex.getStatus()).body(new ApiErrorResponse(error));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnhandled(Exception ex) {
        ApiError error = new ApiError(
                "INTERNAL_ERROR",
                "Внутренняя ошибка сервера",
                null
        );
        return ResponseEntity.internalServerError().body(new ApiErrorResponse(error));
    }

    private static String toSnakeCase(String value) {
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < value.length(); i++) {
            char ch = value.charAt(i);
            if (Character.isUpperCase(ch)) {
                if (i > 0) {
                    result.append('_');
                }
                result.append(Character.toLowerCase(ch));
            } else {
                result.append(ch);
            }
        }
        return result.toString();
    }
}

package com.deskover.util;

import java.util.ArrayList;
import java.util.List;

import org.springframework.validation.BindingResult;

import com.deskover.configuration.security.payload.response.MessageResponse;



public class ValidationUtil {

    /**
     * Convert BindingResult to List<ValidationError>
     * @param bindingResult BindingResult to convert
     * @return List<ValidationError>
     */
	
    public static MessageResponse ConvertValidationErrors(BindingResult bindingResult) {
        List<MessageResponse> errors = new ArrayList<>();
        String result = "";
        Integer i=0;
        if (bindingResult != null) {
            bindingResult.getFieldErrors().forEach(results -> {
                String message = results.getDefaultMessage();
      
                MessageResponse error = new MessageResponse();
                error.setMessage(message);
                errors.add(error);
            });
        }
        for (MessageResponse validationError : errors) {
        	i+=1;
        	result+=" "+i+"."+validationError.getMessage();
		}
        MessageResponse error = new MessageResponse();
        error.setMessage(result);
        return error;
    }
}

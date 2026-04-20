package com.portfolio.commerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import jakarta.annotation.PostConstruct;
import java.util.TimeZone;

@SpringBootApplication
@org.springframework.scheduling.annotation.EnableAsync
public class CommerceApplication {

	public static void main(String[] args) {
		SpringApplication.run(CommerceApplication.class, args);
	}

	@PostConstruct
	public void init() {
		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
	}
}

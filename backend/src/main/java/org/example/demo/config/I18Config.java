package org.example.demo.config;


import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

import java.util.Locale;

/**
 * The type Staff response dto.
 *
 * @author PHAH04
 * Vui lòng không chỉnh sửa, có sửa hãy copy =))
 */
@Configuration
public class I18Config {

    @Bean
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasename("classpath:i18n/messages");
        messageSource.setDefaultEncoding("UTF-8");
        return messageSource;
    }

//    @Bean
//    public LocaleResolver localeResolver() {
//        AcceptHeaderLocaleResolver localeResolver = new AcceptHeaderLocaleResolver();
//        localeResolver.setDefaultLocale(Locale.US);
//        return localeResolver;
//    }
}
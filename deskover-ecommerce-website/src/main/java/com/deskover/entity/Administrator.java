package com.deskover.entity;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.LinkedHashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "administrator")
public class Administrator implements Serializable {
    private static final long serialVersionUID = -9036502519709796374L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotBlank(message = "Không được bỏ trống username")
    @Column(name = "username", nullable = false, length = 50)
    private String username;
    
    @Column(name = "password", nullable = false)
    private String password;

    @NotBlank(message = "Không được bỏ trống fullname")
    @Column(name = "fullname", nullable = false, length = 128)
    private String fullname;
    
    @Column(name = "avatar", length = 128)
    private String avatar;

    @Column(name = "last_login")
    private Timestamp lastLogin;

    @Column(name = "modified_at", nullable = false)
    @CreationTimestamp
    private Timestamp modifiedAt;

    @Column(name = "actived", nullable = false)
    private Boolean actived = false;

    @JsonIgnore
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "admin")
    private Set<AdminAuthority> authorities = new LinkedHashSet<>();

    @Column(name = "modified_by", length = 50)
    private String modifiedBy;

    

}
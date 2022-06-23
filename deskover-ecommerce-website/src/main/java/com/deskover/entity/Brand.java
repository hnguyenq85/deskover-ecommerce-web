package com.deskover.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.LinkedHashSet;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "brand")
public class Brand implements Serializable {
    private static final long serialVersionUID = -257951775645271577L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotBlank(message = "Không bỏ trống tên")
    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "description", length = 150)
    private String description;

    @NotBlank(message = "Không bỏ trống slug")
    @Column(name = "slug", nullable = false, length = 50)
    private String slug;

    @Column(name = "actived", nullable = false)
    private Boolean actived = false;

    @Column(name = "created_at", nullable = false)
    @CreationTimestamp
    private Timestamp createdAt;

    @Column(name = "modified_at")
    private Timestamp modifiedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;

    @JsonIgnore
    @OneToMany(mappedBy = "brand")
    private Set<Product> products = new LinkedHashSet<>();

}
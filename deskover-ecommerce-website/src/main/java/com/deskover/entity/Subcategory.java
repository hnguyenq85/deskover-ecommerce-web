package com.deskover.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.LinkedHashSet;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "subcategory")
public class Subcategory implements Serializable {
    private static final long serialVersionUID = -6798249517976702456L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

	@ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "name")
    private String name;

    @Column(name = "description", length = 150)
    private String description;

    @Column(name = "slug", nullable = false, length = 50)
    private String slug;

    @Column(name = "created_at", nullable = false)
    @CreationTimestamp
    private Timestamp createdAt;

    @Column(name = "modified_at", nullable = false)
    @CreationTimestamp
    private Timestamp modifiedAt;

    @Column(name = "deleted_at")
    @CreationTimestamp
    private Timestamp deletedAt;

    @Column(name = "actived")
    private Boolean actived;

    @JsonIgnore
    @OneToMany(mappedBy = "subCategory")
    private Set<Product> products = new LinkedHashSet<>();

}
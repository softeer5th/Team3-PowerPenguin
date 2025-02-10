package com.softeer.reacton.domain.request;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findAllByIdOrderByCountDesc(Long id);
}

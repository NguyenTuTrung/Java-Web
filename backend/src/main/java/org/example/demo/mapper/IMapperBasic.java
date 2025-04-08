package org.example.demo.mapper;


import java.util.List;

/**
 * @author PHAH04
 * Vui lòng không chỉnh sửa, có sửa hãy copy =))
 */
public interface IMapperBasic<E, D> {
    E toEntity(D d);

    List<E> toListEntity(List<D> d);


    D toDTO(E e);

    List<D> toListDTO(List<E> e);
}

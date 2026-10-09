package org.example.model;

import java.math.BigDecimal;

public class Item {
    private final String id;
    private final BigDecimal price;
    private final String name;

    public Item(String id, BigDecimal price, String name) {
        this.id = id;
        this.price = price;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getName() {
        return name;
    }
}

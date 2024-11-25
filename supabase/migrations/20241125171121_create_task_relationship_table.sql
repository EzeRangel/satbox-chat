-- Crear la tabla de relaciones entre tareas
CREATE TABLE task_relations (
    id SERIAL PRIMARY KEY,
    task_id INT NOT NULL REFERENCES tasks(id),
    related_task_id INT NOT NULL REFERENCES tasks(id),
    relation_type TEXT DEFAULT NULL, -- Opcional: Tipo de relación
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

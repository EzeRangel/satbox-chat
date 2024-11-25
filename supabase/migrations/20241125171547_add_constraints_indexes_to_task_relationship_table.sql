CREATE INDEX idx_task_relations_task_id ON task_relations(task_id);

CREATE INDEX idx_task_relations_related_task_id ON task_relations(related_task_id);

ALTER TABLE task_relations ADD CONSTRAINT unique_task_relation UNIQUE (task_id, related_task_id);
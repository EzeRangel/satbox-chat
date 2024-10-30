CREATE
OR REPLACE FUNCTION public.get_chained_tasks_by_name (search_term TEXT) RETURNS SETOF public.tasks AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE ChainedTasks AS (
        SELECT 
            t1.*  -- Select all fields from the tasks table
        FROM 
            public.tasks t1 
        WHERE 
            t1.next_task_id IS NOT NULL 
            AND to_tsvector(t1.name) @@ to_tsquery(search_term || ':*')  -- Full-text search

        UNION ALL

        SELECT 
            t2.*  -- Select all fields from the tasks table
        FROM 
            public.tasks t2 
        INNER JOIN 
            ChainedTasks ct ON ct.next_task_id = t2.id
    )
    SELECT 
        * 
    FROM 
        ChainedTasks;
END;
$$ LANGUAGE plpgsql;
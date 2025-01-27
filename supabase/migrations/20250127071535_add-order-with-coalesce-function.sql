CREATE OR REPLACE FUNCTION coalesce_updated_at_or_created_at_sort(
    target_table text,
    selected_columns text DEFAULT '*',
    sort_direction text DEFAULT 'DESC',
    nulls_position text DEFAULT 'FIRST'
) RETURNS SETOF json AS $$
BEGIN
    IF sort_direction NOT IN ('ASC', 'DESC') THEN
        RAISE EXCEPTION 'sort_direction must be either ASC or DESC';
    END IF;
    IF nulls_position NOT IN ('FIRST', 'LAST') THEN
        RAISE EXCEPTION 'nulls_position must be either FIRST or LAST';
    END IF;

    RETURN QUERY EXECUTE format(
        'SELECT row_to_json(t) FROM (SELECT %s FROM %I ORDER BY COALESCE(updated_at, created_at) %s NULLS %s) t',
        selected_columns,
        target_table,
        sort_direction,
        nulls_position
    );
END;
$$
 LANGUAGE plpgsql SECURITY DEFINER;
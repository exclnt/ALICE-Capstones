```mermaid
erDiagram

    SESSIONS {
        text token
    }

    PGMIGRATIONS {
        integer id
        character varying name
        timestamp without time zone run_on
    }

    USERS {
        text id
        text username
        text avatar
        text email
        text password
        text role
        double precision impulsive_ratio
        timestamp without time zone created_at
        timestamp without time zone updated_at
    }

    SETTINGS {
        text id
        text user_id
        numeric monthly_income
        numeric weekly_budget
        double precision segment
        text segment_label
        timestamp without time zone created_at
        timestamp without time zone updated_at
    }

    TRANSACTIONS {
        text id
        text user_id
        text category_id
        character varying title
        character varying type
        numeric amount
        boolean is_impulsive
        timestamp without time zone transaction_date
        timestamp without time zone created_at
        timestamp without time zone updated_at
    }

    CATEGORIES {
        text id
        character varying name
        character varying type
    }

    USERS ||--o{ SETTINGS : has
  
    USERS ||--o{ TRANSACTIONS : has
  
    CATEGORIES ||--o{ TRANSACTIONS : has
  
```
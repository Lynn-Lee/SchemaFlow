import type { LanguageMetadata, LanguageTranslation } from '../types';

export const uk: LanguageTranslation = {
    translation: {
        editor_sidebar: {
            new_diagram: 'Нова',
            browse: 'Відкрити',
            tables: 'Таблиці',
            refs: 'Зв’язки',
            dependencies: 'Залежності',
            custom_types: 'Користувацькі типи',
            visuals: 'Візуальні елементи',
            docs: 'Docs',
            settings: 'Settings',
        },
        menu: {
            actions: {
                actions: 'Дії',
                new: 'Нова...',
                browse: 'Усі бази даних...',
                save: 'Зберегти',
                import: 'Імпорт бази даних',
                export_sql: 'Експорт SQL',
                export_as: 'Експортувати як',
                delete_diagram: 'Видалити',
            },
            edit: {
                edit: 'Редагувати',
                undo: 'Скасувати',
                redo: 'Повторити',
                clear: 'Очистити',
            },
            view: {
                view: 'Перегляд',
                show_sidebar: 'Показати бічну панель',
                hide_sidebar: 'Приховати бічну панель',
                hide_cardinality: 'Приховати потужність',
                show_cardinality: 'Показати кардинальність',
                show_field_attributes: 'Показати атрибути полів',
                hide_field_attributes: 'Приховати атрибути полів',
                zoom_on_scroll: 'Масштабувати прокручуванням',
                show_views: 'Представлення бази даних',
                theme: 'Тема',
                show_dependencies: 'Показати залежності',
                hide_dependencies: 'Приховати залежності',
                show_minimap: 'Показати мінімапу',
                hide_minimap: 'Приховати мінімапу',
            },
            backup: {
                backup: 'Резервне копіювання',
                export_diagram: 'Експорт діаграми',
                restore_diagram: 'Відновити діаграму',
            },
            help: {
                help: 'Довідка',
                docs_website: 'Документація',
            },
        },

        delete_diagram_alert: {
            title: 'Видалити діаграму',
            description:
                'Цю дію не можна скасувати. Це призведе до остаточного видалення діаграми.',
            cancel: 'Скасувати',
            delete: 'Видалити',
        },

        clear_diagram_alert: {
            title: 'Очистити діаграму',
            description:
                'Цю дію не можна скасувати. Це назавжди видалить усі дані на діаграмі.',
            cancel: 'Скасувати',
            clear: 'Очистити',
        },

        reorder_diagram_alert: {
            title: 'Автоматичне розміщення діаграми',
            description:
                'Ця дія перевпорядкує всі таблиці на діаграмі. Хочете продовжити?',
            reorder: 'Автоматичне розміщення',
            cancel: 'Скасувати',
        },

        copy_to_clipboard_toast: {
            unsupported: {
                title: 'Помилка копіювання',
                description: 'Буфер обміну не підтримується',
            },
            failed: {
                title: 'Помилка копіювання',
                description: 'Щось пішло не так. Будь ласка, спробуйте ще раз.',
            },
        },

        theme: {
            system: 'Системна',
            light: 'Світла',
            dark: 'Темна',
        },

        zoom: {
            on: 'Увімкнути',
            off: 'Вимкнути',
        },

        last_saved: 'Востаннє збережено',
        saved: 'Збережено',
        loading_diagram: 'Завантаження діаграми…',
        deselect_all: 'Зняти виділення з усіх',
        select_all: 'Вибрати усі',
        clear: 'Очистити',
        show_more: 'Показати більше',
        show_less: 'Показати менше',
        copy_to_clipboard: 'Копіювати в буфер обміну',
        copied: 'Скопійовано!',

        side_panel: {
            view_all_options: 'Переглянути всі параметри…',
            tables_section: {
                tables: 'Таблиці',
                add_table: 'Додати таблицю',
                add_view: 'Додати представлення',
                filter: 'Фільтр',
                collapse: 'Згорнути все',
                clear: 'Clear Filter',
                no_results: 'No tables found matching your filter.',
                show_list: 'Show Table List',
                show_dbml: 'Show DBML Editor',
                all_hidden: 'Всі таблиці приховані',
                show_all: 'Показати все',

                table: {
                    fields: 'Поля',
                    nullable: 'Може бути Null?',
                    primary_key: 'Первинний ключ',
                    indexes: 'Індекси',
                    check_constraints: 'Перевірочні обмеження',
                    comments: 'Коментарі',
                    no_comments: 'Немає коментарів',
                    add_field: 'Додати поле',
                    add_index: 'Додати індекс',
                    add_check: 'Додати перевірку',
                    index_select_fields: 'Виберіть поля',
                    no_types_found: 'Типи не знайдено',
                    field_name: 'Назва поля',
                    field_type: 'Тип',
                    field_actions: {
                        title: 'Атрибути полів',
                        unique: 'Унікальне',
                        auto_increment: 'Автоінкремент',
                        comments: 'Коментарі',
                        no_comments: 'Немає коментарів',
                        delete_field: 'Видалити поле',
                        default_value: 'Default Value',
                        no_default: 'No default',
                        character_length: 'Max Length',
                        precision: 'Точність',
                        scale: 'Масштаб',
                    },
                    index_actions: {
                        title: 'Атрибути індексу',
                        name: 'Назва індекса',
                        unique: 'Унікальний',
                        index_type: 'Тип індексу',
                        delete_index: 'Видалити індекс',
                    },
                    check_constraint_actions: {
                        title: 'Перевірочне обмеження',
                        expression: 'Вираз',
                        delete: 'Видалити обмеження',
                    },
                    table_actions: {
                        title: 'Дії з таблицею',
                        change_schema: 'Змінити схему',
                        add_field: 'Додати поле',
                        add_index: 'Додати індекс',
                        duplicate_table: 'Дублювати таблицю',
                        delete_table: 'Видалити таблицю',
                    },
                },
                empty_state: {
                    title: 'Без таблиць',
                    description: 'Щоб почати, створіть таблицю',
                },
            },
            refs_section: {
                refs: 'Refs',
                filter: 'Фільтр',
                collapse: 'Згорнути все',
                add_relationship: 'Додати звʼязок',
                relationships: 'Звʼязки',
                dependencies: 'Залежності',
                relationship: {
                    relationship: 'Звʼязок',
                    primary: 'Первинна таблиця',
                    foreign: 'Повʼязана таблиця',
                    cardinality: 'Звʼязок',
                    delete_relationship: 'Видалити',
                    switch_tables: 'Поміняти таблиці',
                    relationship_actions: {
                        title: 'Дії',
                        delete_relationship: 'Видалити',
                    },
                },
                dependency: {
                    dependency: 'Залежність',
                    table: 'Таблиця',
                    dependent_table: 'Залежне подання',
                    delete_dependency: 'Видалити',
                    dependency_actions: {
                        title: 'Дії',
                        delete_dependency: 'Видалити',
                    },
                },
                empty_state: {
                    title: 'Жодних зв’язків',
                    description: 'Створіть зв’язок, щоб почати',
                },
            },

            areas_section: {
                areas: 'Області',
                add_area: 'Додати область',
                filter: 'Фільтр',
                clear: 'Очистити фільтр',
                no_results:
                    'Області не знайдені, які відповідають вашому фільтру.',

                area: {
                    area_actions: {
                        title: 'Дії з областю',
                        edit_name: 'Редагувати назву',
                        delete_area: 'Видалити область',
                    },
                },
                empty_state: {
                    title: 'Немає областей',
                    description: 'Створіть область, щоб почати',
                },
            },

            visuals_section: {
                visuals: 'Візуальні елементи',
                tabs: {
                    areas: 'Області',
                    notes: 'Нотатки',
                },
            },

            notes_section: {
                filter: 'Фільтр',
                add_note: 'Додати Нотатку',
                no_results: 'Нотатки не знайдено',
                clear: 'Очистити Фільтр',
                empty_state: {
                    title: 'Немає Нотаток',
                    description:
                        'Створіть нотатку, щоб додати текстові анотації на полотні',
                },
                note: {
                    empty_note: 'Порожня нотатка',
                    note_actions: {
                        title: 'Дії з Нотаткою',
                        edit_content: 'Редагувати Вміст',
                        delete_note: 'Видалити Нотатку',
                    },
                },
            },

            custom_types_section: {
                custom_types: 'Користувацькі типи',
                filter: 'Фільтр',
                clear: 'Очистити фільтр',
                no_results:
                    'Не знайдено користувацьких типів, що відповідають фільтру.',
                new_type: 'Новий тип',
                empty_state: {
                    title: 'Немає користувацьких типів',
                    description:
                        "Користувацькі типи з'являться тут, коли вони будуть доступні у вашій базі даних",
                },
                custom_type: {
                    kind: 'Вид',
                    enum_values: 'Значення переліку',
                    composite_fields: 'Поля',
                    no_fields: 'Поля не визначені',
                    no_values: 'Значення переліку не визначені',
                    field_name_placeholder: 'Назва поля',
                    field_type_placeholder: 'Виберіть тип',
                    add_field: 'Додати поле',
                    no_fields_tooltip:
                        'Для цього користувацького типу поля не визначені',
                    custom_type_actions: {
                        title: 'Дії',
                        highlight_fields: 'Виділити поля',
                        delete_custom_type: 'Видалити',
                        clear_field_highlight: 'Зняти виділення',
                    },
                    delete_custom_type: 'Видалити тип',
                },
            },
        },

        toolbar: {
            zoom_in: 'Збільшити',
            zoom_out: 'Зменшити',
            save: 'Зберегти',
            show_all: 'Показати все',
            undo: 'Скасувати',
            redo: 'Повторити',
            reorder_diagram: 'Автоматичне розміщення діаграми',
            clear_custom_type_highlight: 'Clear highlight for "{{typeName}}"',
            custom_type_highlight_tooltip:
                'Highlighting "{{typeName}}" - Click to clear',
            highlight_overlapping_tables: 'Показати таблиці, що перекриваються',
            filter: 'Фільтрувати таблиці',
        },

        new_diagram_dialog: {
            database_selection: {
                title: 'Яка у вас база даних?',
                description:
                    'Кожна база даних має свої унікальні особливості та можливості.',
                transactional: 'Transactional',
                analytical: 'Analytical',
                more_databases: 'More Databases',
                primary_databases: 'Primary Databases',
                check_examples_long: 'Подивіться приклади',
                check_examples_short: 'Приклади',
            },

            import_database: {
                title: 'Імпортуйте вашу базу даних',
                database_edition: 'Варіант бази даних:',
                step_1: 'Запустіть цей сценарій у своїй базі даних:',
                step_2: 'Вставте сюди результат сценарію →',
                script_results_placeholder: 'Результати сценарію має бути тут…',
                ssms_instructions: {
                    button_text: 'SSMS Інструкції',
                    title: 'Інструкції',
                    step_1: 'Перейдіть до Інструменти > Опції > Результати запиту > SQL Сервер.',
                    step_2: 'Якщо ви використовуєте «Results to Grid», змініть максимальну кількість символів, отриманих для даних, що не є XML (встановіть на 9999999).',
                },
                instructions_link: 'Потрібна допомога? Подивіться як',
                check_script_result: 'Перевірте результат сценарію',
            },

            cancel: 'Скасувати',
            back: 'Назад',
            import_from_file: 'Імпортувати з файлу',
            empty_diagram: 'Порожня база даних',
            continue: 'Продовжити',
            import: 'Імпорт',
        },

        open_diagram_dialog: {
            title: 'Відкрити базу даних',
            description:
                'Виберіть діаграму, яку потрібно відкрити, зі списку нижче.',
            table_columns: {
                name: 'Назва',
                created_at: 'Створено0',
                last_modified: 'Востаннє змінено',
                tables_count: 'Таблиці',
            },
            cancel: 'Скасувати',
            open: 'Відкрити',
            new_database: 'Нова база даних',
            load_error: {
                title: 'Could not load local diagrams',
                description:
                    'Local diagrams could not be read. Check browser storage permissions or create a new database.',
                retry: 'Retry loading diagrams',
            },

            diagram_actions: {
                open: 'Відкрити',
                duplicate: 'Дублювати',
                delete: 'Видалити',
            },
        },

        export_sql_dialog: {
            title: 'Експорт SQL',
            description:
                'Експортуйте свою схему діаграми в {{databaseType}} сценарій',
            close: 'Закрити',
            mode: {
                deterministic: 'Deterministic',
                ai: 'AI',
            },
            loading: {
                text: 'ШІ створює SQL для {{databaseType}}…',
                description: 'Це має зайняти до 30 секунд.',
            },
            error: {
                message:
                    'Помилка створення сценарію SQL. Спробуйте пізніше або <0>звʼяжіться з нами</0>.',
                description:
                    'Не соромтеся використовувати свій OPENAI_TOKEN, дивіться посібник <0>тут</0>.',
            },
        },

        create_relationship_dialog: {
            title: 'Створити звʼязок',
            primary_table: 'Первинна таблиця',
            primary_field: 'Первинне поле',
            referenced_table: 'Звʼязана таблиця',
            referenced_field: 'Повʼязане поле',
            primary_table_placeholder: 'Виберіть таблицю',
            primary_field_placeholder: 'Виберіть поле',
            referenced_table_placeholder: 'Виберіть таблицю',
            referenced_field_placeholder: 'Виберіть поле',
            no_tables_found: 'Таблиці не знайдено',
            no_fields_found: 'Поля не знайдено',
            create: 'Створити',
            cancel: 'Скасувати',
        },

        import_database_dialog: {
            title: 'Імпорт до поточної діаграми',
            override_alert: {
                title: 'Імпорт бази даних',
                content: {
                    alert: 'Імпортування цієї діаграми вплине на наявні таблиці та зв’язки.',
                    new_tables:
                        '<bold>{{newTablesNumber}}</bold> будуть додані нові таблиці.',
                    new_relationships:
                        '<bold>{{newRelationshipsNumber}}</bold> будуть створені нові звʼязки.',
                    tables_override:
                        '<bold>{{tablesOverrideNumber}}</bold> таблиці будуть перезаписані.',
                    proceed: 'Ви хочете продовжити?',
                },
                import: 'Імпортувати',
                cancel: 'Скасувати',
            },
        },

        smart_query_wizard: {
            title: 'Smart Query Wizard',
            description:
                'SchemaFlow never asks for your database password. You copy a read-only metadata query, run it locally, then paste the JSON output here.',
            steps: {
                choose_database: {
                    title: 'Choose this database type',
                    description:
                        'The query is generated for the selected database and client.',
                },
                copy_query: {
                    title: 'Copy the Smart Query',
                    description:
                        'Run it in your own database client. No database password is required in SchemaFlow.',
                },
                paste_json: {
                    title: 'Paste the JSON result',
                    description:
                        'Only paste the metadata JSON returned by the query, not a connection string or secret.',
                },
                preview: {
                    title: 'Preview tables, relationships, and warnings',
                    description:
                        'SchemaFlow summarizes objects and dialect limitations before writing to the diagram.',
                },
                confirm: {
                    title: 'Confirm import',
                    description:
                        'Nothing is added to IndexedDB until you confirm the preview.',
                },
            },
        },

        export_image_dialog: {
            title: 'Експорт зображення',
            description: 'Виберіть коефіцієнт масштабування для експорту:',
            scale_1x: '1x (Низька якість)',
            scale_2x: '2x (Звичайна якість)',
            scale_4x: '4x (Найкраща якість)',
            cancel: 'Скасувати',
            export: 'Експортувати',
            advanced_options: 'Advanced Options',
            pattern: 'Include background pattern',
            pattern_description: 'Add subtle grid pattern to background.',
            transparent: 'Transparent background',
            transparent_description: 'Remove background color from image.',
        },

        new_table_schema_dialog: {
            title: 'Виберіть Схему',
            description:
                'Наразі показується кілька схем. Виберіть одну для нової таблиці.',
            cancel: 'Скасувати',
            confirm: 'Підтвердити',
        },

        update_table_schema_dialog: {
            title: 'Змінити схему',
            description: 'Оновити схему таблиці "{{tableName}}"',
            cancel: 'Скасувати',
            confirm: 'Змінити',
        },

        create_table_schema_dialog: {
            title: 'Створити нову схему',
            description:
                'Поки що не існує жодної схеми. Створіть свою першу схему, щоб організувати ваші таблиці.',
            create: 'Створити',
            cancel: 'Скасувати',
        },

        star_us_dialog: {
            title: 'Допоможіть нам покращитися!',
            description: 'Поставне на зірку на GitHub? Це лише один клік!',
            close: 'Не зараз',
            confirm: 'Звісно!',
        },
        export_diagram_dialog: {
            title: 'Експорт Діаграми',
            description: 'Оберіть формат експорту:',
            format_json: 'JSON',
            cancel: 'Скасувати',
            export: 'Експортувати',
            error: {
                title: 'Помилка експорут діаграми',
                description:
                    'Щось пішло не так. Потрібна допомога? https://github.com/Lynn-Lee/SchemaFlow/issues',
            },
        },
        import_diagram_dialog: {
            title: 'Імпорт Діаграми',
            description: 'Вставте JSON діаграми нижче:',
            cancel: 'Скасувати',
            import: 'Імпортувати',
            error: {
                title: 'Помилка імпорту діаграми',
                description:
                    'JSON діаграми є неправильним. Будь ласка, перевірте JSON і спробуйте ще раз. Потрібна допомога? https://github.com/Lynn-Lee/SchemaFlow/issues',
            },
        },
        import_dbml_dialog: {
            example_title: 'Import Example DBML',
            title: 'Import DBML',
            description: 'Import a database schema from DBML format.',
            import: 'Import',
            cancel: 'Cancel',
            skip_and_empty: 'Skip & Empty',
            show_example: 'Show Example',
            error: {
                title: 'Error',
                description: 'Failed to parse DBML. Please check the syntax.',
            },
        },
        relationship_type: {
            one_to_one: 'Один до Одного',
            one_to_many: 'Один до Багатьох',
            many_to_one: 'Багато до Одного',
            many_to_many: 'Багато до Багатьох',
        },

        canvas_context_menu: {
            new_table: 'Нова таблиця',
            new_view: 'Нове представлення',
            new_relationship: 'Новий звʼязок',
            new_area: 'Нова область',
            new_note: 'Нова Нотатка',
        },

        table_node_context_menu: {
            edit_table: 'Редагувати таблицю',
            duplicate_table: 'Дублювати таблицю',
            delete_table: 'Видалити таблицю',
            add_relationship: 'Add Relationship',
            move_to_area: 'Перемістити в область',
            no_area: 'Без області',
        },

        templates_page: {
            heading_featured: 'Featured database schema templates',
            heading_tagged: 'Database schema templates for {{tag}}',
            heading_all: 'Database schema templates',
            breadcrumb: 'Templates',
            detail_subtitle: 'Database schema diagram',
            detail_meta_title:
                'Database schema diagram for {{name}} | SchemaFlow',
            description:
                'Discover a collection of real-world database schema diagrams, featuring example applications and popular open-source projects.',
            description_tagged:
                'Discover a collection of real-world database schema diagrams for {{tag}}, featuring example applications and popular open-source projects.',
            navigation: {
                featured: 'Featured',
                all_templates: 'All Templates',
                tags: 'Tags',
            },
        },

        examples_page: {
            meta_title: 'SchemaFlow - Example Database Diagrams & Schemas',
            heading: 'Examples',
            description:
                'A collection of examples to help you get started with SchemaFlow.',
            prompt: 'Click on one',
            items: {
                '1': {
                    name: 'Employees schema',
                    description:
                        'A schema for database of employees, departments, and salaries.',
                },
                '2': {
                    name: 'Bike stores schema',
                    description:
                        'A schema for database of bike stores, brands, categories, and customers.',
                },
                '3': {
                    name: 'DVD Rental schema',
                    description:
                        'A schema for database of a DVD rental store, including customers, films, actors, staff, and stores.',
                },
            },
        },

        canvas: {
            all_tables_hidden: 'Всі таблиці приховані',
            show_all_tables: 'Показати все',
            mobile_notice: {
                title: 'Mobile editing is limited',
                description:
                    'For reliable canvas editing, use a desktop browser. You can continue on this device.',
                dismiss: 'Dismiss mobile canvas notice',
            },
        },

        canvas_filter: {
            title: 'Фільтрувати таблиці',
            search_placeholder: 'Пошук таблиць...',
            group_by_schema: 'Групувати за схемою',
            group_by_area: 'Групувати за областю',
            no_tables_found: 'Таблиці не знайдено',
            empty_diagram_description: 'Створіть таблицю, щоб почати',
            no_tables_description: 'Спробуйте налаштувати пошук або фільтр',
            clear_filter: 'Очистити фільтр',
        },

        snap_to_grid_tooltip: 'Вирівнювати за сіткою (Отримуйте {{key}})',

        tool_tips: {
            double_click_to_edit: 'Подвійне клацання для редагування',
        },

        language_select: {
            change_language: 'Мова',
            screen_reader_change_language: 'Change language',
            experimental: 'experimental',
        },

        import_preview: {
            ready: 'Import preview ready',
            confidence: 'Confidence: {{confidence}}',
            tables: '{{count}} tables',
            relationships: '{{count}} relationships',
            custom_types: '{{count}} custom types',
            warnings: '{{count}} warnings',
            skipped: '{{objectType}}{{name}} was skipped: {{reason}}',
            errors: {
                no_importable_objects:
                    'Preview found no importable tables, relationships, or custom types. Check the pasted Smart Query JSON or the selected database dialect.',
                cancelled: 'Import preview cancelled.',
                parse_default: 'Unable to parse the import input.',
                parse_failed:
                    'Preview failed: {{message}}. Check the Smart Query JSON, SQL syntax, or dialect limitations before trying again.',
                message: '{{message}}',
            },
        },

        on: 'Увімк',
        off: 'Вимк',

        settings: {
            dialog: {
                title: 'Settings',
                description:
                    'Manage local editor preferences, AI export mode, and browser-stored diagram data.',
            },
            display: {
                heading: 'Display',
                description: 'Keep editor preferences in this browser.',
                theme: 'Theme',
                theme_system: 'System',
                theme_light: 'Light',
                theme_dark: 'Dark',
                language: 'Language',
                show_minimap: 'Show mini map',
                show_field_attributes: 'Show field attributes',
                scroll_action: 'Canvas scroll action',
                scroll_action_pan: 'Pan canvas',
                scroll_action_zoom: 'Zoom canvas',
            },
            privacy: {
                session_only_title: 'Session-only settings',
                session_only_description:
                    'Browser settings are unavailable. Changes work for this session only.',
                ai_mode_heading: 'AI mode',
                ai_mode_description:
                    'Control whether SQL export can use AI assistance.',
                ai_export_mode_label: 'AI-assisted export mode',
                ai_export_mode_disabled: 'Disabled',
                ai_export_mode_byok: 'BYOK session',
                ai_export_mode_gateway: 'Self-hosted gateway',
                byok_alert_title: 'Session-only BYOK',
                byok_alert_line_1: 'Paste the API key only when exporting SQL.',
                byok_alert_line_2:
                    'BYOK keys are session-only and are never saved.',
                byok_never_saved:
                    'BYOK keys are session-only and are never saved.',
                byok_session_key_label: 'Session API key',
                byok_session_key_hint:
                    'Stored in memory only. Refreshing the page clears this key.',
                gateway_endpoint_label: 'Gateway endpoint',
                gateway_model_label: 'Model name',
                gateway_model_placeholder: 'Optional',
                data_management_heading: 'Data management',
                data_management_description:
                    'SchemaFlow stores diagrams in this browser with IndexedDB and localStorage. No account or cloud workspace is required.',
                export_backup_button: 'Export diagram backup',
                restore_backup_button: 'Restore from backup',
                backup_file_label: 'Backup file',
                clear_local_diagrams_button: 'Clear local diagrams',
                reading_backup_title: 'Reading backup',
                reading_backup_description:
                    'SchemaFlow is building a restore preview.',
                backup_restored_title: 'Backup restored',
                backup_restored_description:
                    'The selected backup has been restored as local diagram data.',
                restore_failed_title: 'Could not restore backup',
                restore_failed_default: 'Backup file could not be restored.',
                preview_failed_default: 'Backup file could not be previewed.',
                read_failed_default: 'Backup file could not be read.',
                cleared_title: 'Local diagrams cleared',
                cleared_description: 'All local diagrams have been deleted.',
                clear_failed_title: 'Could not clear local diagrams',
                clear_failed_default: 'Local diagrams could not be deleted.',
                clear_dialog_title: 'Delete all local diagrams?',
                clear_dialog_description:
                    'This deletes every diagram stored in this browser, including tables, relationships, notes, areas, custom types, and filters. Export a backup first if you need to keep a copy.',
                cancel: 'Cancel',
                deleting: 'Deleting...',
                delete_local_diagrams: 'Delete local diagrams',
                restore_dialog_title: 'Restore backup preview?',
                restore_dialog_description:
                    'Review the diagrams in this backup before restoring them into local browser storage.',
                diagram_singular: '{{count}} diagram in this backup.',
                diagram_plural: '{{count}} diagrams in this backup.',
                table_singular: '{{count}} table',
                table_plural: '{{count}} tables',
                relationship_singular: '{{count}} relationship',
                relationship_plural: '{{count}} relationships',
                restoring: 'Restoring...',
                restore_backup_action: 'Restore backup',
            },
            keyboard: {
                heading: 'Keyboard shortcuts',
                description:
                    'Core editor paths remain available without pointer-only controls.',
                undo: 'Undo diagram change',
                redo: 'Redo diagram change',
                command_actions: 'Open command actions',
                zoom_canvas: 'Zoom canvas',
                zoom_canvas_keys: 'Mouse wheel or toolbar controls',
            },
        },

        onboarding: {
            title: 'Start a SchemaFlow diagram',
            description:
                'Pick the database first, then choose whether to import, start blank, or explore templates.',
            database_heading: 'Database',
            start_option_heading: 'Start option',
            start_options: {
                import: {
                    title: 'Import existing database',
                    description:
                        'Start from SQL, DBML, or metadata and review it before saving.',
                },
                blank: {
                    title: 'New blank diagram',
                    description:
                        'Create an empty local diagram for manual modeling.',
                },
                template: {
                    title: 'Browse templates',
                    description:
                        'Open a realistic example and clone it into your workspace.',
                },
            },
            no_database_selected: 'No database selected',
            selected_label: 'Selected: {{label}}',
            choose_database_error:
                'Choose a database before creating or importing a diagram.',
            choose_start_option_error: 'Choose how you want to start.',
            create_failed_error:
                'SchemaFlow could not create the diagram. Nothing was saved; try again.',
            import_json_backup: 'Import JSON backup',
            continue: 'Continue',
            creating: 'Creating...',
        },
    },
};

export const ukMetadata: LanguageMetadata = {
    name: 'Ukrainian',
    nativeName: 'Українська',
    code: 'uk',
};

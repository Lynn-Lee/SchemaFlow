import type { LanguageMetadata, LanguageTranslation } from '../types';

export const ru: LanguageTranslation = {
    translation: {
        editor_sidebar: {
            new_diagram: 'Новая',
            browse: 'Открыть',
            tables: 'Таблицы',
            refs: 'Ссылки',
            dependencies: 'Зависимости',
            custom_types: 'Пользовательские типы',
            visuals: 'Визуальные элементы',
            docs: 'Docs',
            settings: 'Settings',
        },
        menu: {
            actions: {
                actions: 'Действия',
                new: 'Новая...',
                browse: 'Все базы данных...',
                save: 'Сохранить',
                import: 'Импортировать базу данных',
                export_sql: 'Экспорт SQL',
                export_as: 'Экспортировать как',
                delete_diagram: 'Удалить',
            },
            edit: {
                edit: 'Изменение',
                undo: 'Отменить',
                redo: 'Вернуть',
                clear: 'Очистить',
            },
            view: {
                view: 'Вид',
                show_sidebar: 'Показать боковую панель',
                hide_sidebar: 'Скрыть боковую панель',
                hide_cardinality: 'Скрыть виды связи',
                show_cardinality: 'Показать виды связи',
                show_field_attributes: 'Показать атрибуты поля',
                hide_field_attributes: 'Скрыть атрибуты поля',
                zoom_on_scroll: 'Увеличение при прокрутке',
                show_views: 'Представления базы данных',
                theme: 'Тема',
                show_dependencies: 'Показать зависимости',
                hide_dependencies: 'Скрыть зависимости',
                show_minimap: 'Показать мини-карту',
                hide_minimap: 'Скрыть мини-карту',
            },
            backup: {
                backup: 'Бэкап',
                export_diagram: 'Экспорт диаграммы',
                restore_diagram: 'Восстановить диаграмму',
            },
            help: {
                help: 'Помощь',
                docs_website: 'Документация',
            },
        },

        delete_diagram_alert: {
            title: 'Удалить диаграмму',
            description:
                'Это действие нельзя отменить. Это навсегда удалит диаграмму.',
            cancel: 'Отменить',
            delete: 'Удалить',
        },

        clear_diagram_alert: {
            title: 'Очистить диаграмму',
            description:
                'Это действие нельзя отменить. Это навсегда удалит все данные в диаграмме.',
            cancel: 'Отменить',
            clear: 'Очистить',
        },

        reorder_diagram_alert: {
            title: 'Автоматическая расстановка диаграммы',
            description:
                'Это действие переставит все таблицы на диаграмме. Хотите продолжить?',
            reorder: 'Автоматическая расстановка',
            cancel: 'Отменить',
        },

        copy_to_clipboard_toast: {
            unsupported: {
                title: 'Ошибка копирования',
                description: 'Буфер обмена не поддерживается',
            },
            failed: {
                title: 'Ошибка копирования',
                description:
                    'Что-то пошло не так. Пожалуйста, попробуйте еще раз.',
            },
        },

        theme: {
            system: 'Системная',
            light: 'Светлая',
            dark: 'Темная',
        },

        zoom: {
            on: 'Включено',
            off: 'Выключено',
        },

        last_saved: 'Последнее сохранение',
        saved: 'Сохранено',
        loading_diagram: 'Загрузка диаграммы...',
        deselect_all: 'Отменить выбор всех',
        select_all: 'Выбрать все',
        clear: 'Очистить',
        show_more: 'Показать больше',
        show_less: 'Показать меньше',

        side_panel: {
            view_all_options: 'Просмотреть все варианты...',
            tables_section: {
                tables: 'Таблицы',
                add_table: 'Добавить таблицу',
                add_view: 'Добавить представление',
                filter: 'Фильтр',
                collapse: 'Свернуть все',
                clear: 'Очистить фильтр',

                no_results:
                    'Таблицы не найдены, соответствующие вашему фильтру.',
                show_list: 'Переключиться на список таблиц',
                show_dbml: 'Переключиться на редактор DBML',
                all_hidden: 'Все таблицы скрыты',
                show_all: 'Показать все',

                table: {
                    fields: 'Поля',
                    nullable: 'Может быть NULL?',
                    primary_key: 'Первичный ключ',
                    indexes: 'Индексы',
                    check_constraints: 'Проверочные ограничения',
                    comments: 'Комментарии',
                    no_comments: 'Нет комментария',
                    add_field: 'Добавить поле',
                    add_index: 'Добавить индекс',
                    add_check: 'Добавить проверку',
                    index_select_fields: 'Выберите поля',
                    no_types_found: 'Типы не найдены',
                    field_name: 'Имя',
                    field_type: 'Тип',
                    field_actions: {
                        title: 'Атрибуты поля',
                        unique: 'Уникальный',
                        auto_increment: 'Автоинкремент',
                        comments: 'Комментарии',
                        no_comments: 'Нет комментария',
                        delete_field: 'Удалить поле',
                        default_value: 'Default Value',
                        no_default: 'No default',
                        character_length: 'Макс. длина',
                        precision: 'Точность',
                        scale: 'Масштаб',
                    },
                    index_actions: {
                        title: 'Атрибуты индекса',
                        name: 'Имя',
                        unique: 'Уникальный',
                        index_type: 'Тип индекса',
                        delete_index: 'Удалить индекс',
                    },
                    check_constraint_actions: {
                        title: 'Проверочное ограничение',
                        expression: 'Выражение',
                        delete: 'Удалить ограничение',
                    },
                    table_actions: {
                        title: 'Действия',
                        change_schema: 'Изменить схему',
                        add_field: 'Добавить поле',
                        add_index: 'Добавить индекс',
                        duplicate_table: 'Создать копию',
                        delete_table: 'Удалить таблицу',
                    },
                },
                empty_state: {
                    title: 'Нет таблиц',
                    description: 'Создайте таблицу, чтобы начать',
                },
            },
            refs_section: {
                refs: 'Ссылки',
                filter: 'Фильтр',
                collapse: 'Свернуть все',
                add_relationship: 'Добавить отношение',
                relationships: 'Отношения',
                dependencies: 'Зависимости',
                relationship: {
                    relationship: 'Отношение',
                    primary: 'Основная таблица',
                    foreign: 'Связанная таблица',
                    cardinality: 'Тип множественной связи',
                    delete_relationship: 'Удалить',
                    switch_tables: 'Поменять таблицы',
                    relationship_actions: {
                        title: 'Действия',
                        delete_relationship: 'Удалить',
                    },
                },
                dependency: {
                    dependency: 'Зависимость',
                    table: 'Таблица',
                    dependent_table: 'Зависимое представление',
                    delete_dependency: 'Удалить',
                    dependency_actions: {
                        title: 'Действия',
                        delete_dependency: 'Удалить',
                    },
                },
                empty_state: {
                    title: 'Нет отношений',
                    description: 'Создайте отношение, чтобы начать',
                },
            },

            areas_section: {
                areas: 'Области',
                add_area: 'Добавить область',
                filter: 'Фильтр',
                clear: 'Очистить фильтр',

                no_results:
                    'Области не найдены, соответствующие вашему фильтру.',

                area: {
                    area_actions: {
                        title: 'Действия',
                        edit_name: 'Изменить название',
                        delete_area: 'Удалить область',
                    },
                },
                empty_state: {
                    title: 'Нет областей',
                    description: 'Создайте область, чтобы начать',
                },
            },

            visuals_section: {
                visuals: 'Визуальные элементы',
                tabs: {
                    areas: 'Области',
                    notes: 'Заметки',
                },
            },

            notes_section: {
                filter: 'Фильтр',
                add_note: 'Добавить Заметку',
                no_results: 'Заметки не найдены',
                clear: 'Очистить Фильтр',
                empty_state: {
                    title: 'Нет Заметок',
                    description:
                        'Создайте заметку, чтобы добавить текстовые аннотации на холсте',
                },
                note: {
                    empty_note: 'Пустая заметка',
                    note_actions: {
                        title: 'Действия с Заметкой',
                        edit_content: 'Редактировать Содержимое',
                        delete_note: 'Удалить Заметку',
                    },
                },
            },

            custom_types_section: {
                custom_types: 'Пользовательские типы',
                filter: 'Фильтр',
                clear: 'Очистить фильтр',
                no_results:
                    'Не найдено пользовательских типов, соответствующих фильтру.',
                new_type: 'Новый тип',
                empty_state: {
                    title: 'Нет пользовательских типов',
                    description:
                        'Пользовательские типы появятся здесь, когда будут доступны в вашей базе данных',
                },
                custom_type: {
                    kind: 'Вид',
                    enum_values: 'Значения перечисления',
                    composite_fields: 'Поля',
                    no_fields: 'Поля не определены',
                    no_values: 'Значения перечисления не определены',
                    field_name_placeholder: 'Имя поля',
                    field_type_placeholder: 'Выберите тип',
                    add_field: 'Добавить поле',
                    no_fields_tooltip:
                        'Для этого пользовательского типа поля не определены',
                    custom_type_actions: {
                        title: 'Действия',
                        highlight_fields: 'Выделить поля',
                        delete_custom_type: 'Удалить',
                        clear_field_highlight: 'Снять выделение',
                    },
                    delete_custom_type: 'Удалить тип',
                },
            },
        },

        toolbar: {
            zoom_in: 'Увеличить масштаб',
            zoom_out: 'Уменьшить масштаб',
            save: 'Сохранить',
            show_all: 'Показать все',
            undo: 'Отменить',
            redo: 'Вернуть',
            reorder_diagram: 'Автоматическая расстановка диаграммы',
            clear_custom_type_highlight: 'Clear highlight for "{{typeName}}"',
            custom_type_highlight_tooltip:
                'Highlighting "{{typeName}}" - Click to clear',
            highlight_overlapping_tables: 'Выделение перекрывающихся таблиц',
            filter: 'Фильтровать таблицы',
        },

        new_diagram_dialog: {
            database_selection: {
                title: 'Какова ваша база данных?',
                description:
                    'Каждая база данных имеет свои уникальные функции и возможности.',
                transactional: 'Transactional',
                analytical: 'Analytical',
                more_databases: 'More Databases',
                primary_databases: 'Primary Databases',
                check_examples_long: 'Открыть примеры',
                check_examples_short: 'Примеры',
            },

            import_database: {
                title: 'Импортируйте свою базу данных',
                database_edition: 'Версия базы данных:',
                step_1: 'Запустите этот скрипт в своей базе данных:',
                step_2: 'Вставьте вывод скрипта сюда →',
                script_results_placeholder: 'Вывод скрипта здесь...',
                ssms_instructions: {
                    button_text: 'SSMS Инструкции',
                    title: 'Инструкции',
                    step_1: 'Откройте в меню пункты Инструменты > Параметры > Результаты запроса > SQL Сервер.',
                    step_2: 'Если вы используете "Результат в сетке," измените Максимальное количество извлекаемых символов для данных, отличных от XML (установите на 9999999).',
                },
                instructions_link: 'Нужна помощь? Посмотрите, как',
                check_script_result: 'Проверить результат выполнения скрипта',
            },

            cancel: 'Отменить',
            back: 'Назад',
            import_from_file: 'Импортировать из файла',
            empty_diagram: 'Пустая база данных',
            continue: 'Продолжить',
            import: 'Импорт',
        },

        open_diagram_dialog: {
            title: 'Открыть базу данных',
            description:
                'Выберите диаграмму, которую нужно открыть, из списка ниже.',
            table_columns: {
                name: 'Имя',
                created_at: 'Создано в',
                last_modified: 'Последнее изменение',
                tables_count: 'Таблицы',
            },
            cancel: 'Отмена',
            open: 'Открыть',
            new_database: 'Новая база данных',
            load_error: {
                title: 'Could not load local diagrams',
                description:
                    'Local diagrams could not be read. Check browser storage permissions or create a new database.',
                retry: 'Retry loading diagrams',
            },

            diagram_actions: {
                open: 'Открыть',
                duplicate: 'Дублировать',
                delete: 'Удалить',
            },
        },

        export_sql_dialog: {
            title: 'Экспорт SQL',
            description:
                'Экспортируйте схему диаграммы в {{databaseType}} скрипт',
            close: 'Закрыть',
            mode: {
                deterministic: 'Deterministic',
                ai: 'AI',
            },
            loading: {
                text: 'ИИ генерирует SQL для {{databaseType}}...',
                description: 'Это должно занять до 30 секунд.',
            },
            error: {
                message:
                    'Ошибка создания скрипта SQL. Попробуйте еще раз позже или <0>свяжитесь с нами</0>.',
                description:
                    'Не стесняйтесь использовать ваш OPENAI_TOKEN, см. руководство <0>здесь</0>.',
            },
        },

        create_relationship_dialog: {
            title: 'Создать отношениe',
            primary_table: 'Основная таблица',
            primary_field: 'Основное поле',
            referenced_table: 'Ссылается на таблицу',
            referenced_field: 'Ссылается на поле',
            primary_table_placeholder: 'Выберите таблицу',
            primary_field_placeholder: 'Выберите поле',
            referenced_table_placeholder: 'Выберите таблицу',
            referenced_field_placeholder: 'Выберите поле',
            no_tables_found: 'Таблицы не найдены',
            no_fields_found: 'Поля не найдены',
            create: 'Создать',
            cancel: 'Отменить',
        },

        import_database_dialog: {
            title: 'Импорт в текущую диаграмму',
            override_alert: {
                title: 'Импортировать базу данных',
                content: {
                    alert: 'Импорт этой диаграммы повлияет на существующие таблицы и связи.',
                    new_tables:
                        '<bold>{{newTablesNumber}}</bold> будут добавлены новые таблицы.',
                    new_relationships:
                        '<bold>{{newRelationshipsNumber}}</bold> будут созданы новые отношения.',
                    tables_override:
                        '<bold>{{tablesOverrideNumber}}</bold> таблицы будут перезаписаны.',
                    proceed: 'Хотите продолжить?',
                },
                import: 'Импорт',
                cancel: 'Отмена',
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
            title: 'Экспортировать изображение',
            description: 'Выберите детализацию изображения при экспорте:',
            scale_1x: '1x (Низкое качество)',
            scale_2x: '2x (Обычное качество)',
            scale_4x: '4x (Лучшее качество)',
            cancel: 'Отменить',
            export: 'Экспортировать',
            advanced_options: 'Advanced Options',
            pattern: 'Include background pattern',
            pattern_description: 'Add subtle grid pattern to background.',
            transparent: 'Transparent background',
            transparent_description: 'Remove background color from image.',
        },

        new_table_schema_dialog: {
            title: 'Выбрать схему',
            description:
                'В настоящее время отображается несколько схем. Выберите одну для новой таблицы.',
            cancel: 'Отменить',
            confirm: 'Подтвердить',
        },

        update_table_schema_dialog: {
            title: 'Изменить схему',
            description: 'Обновить таблицу "{{tableName}}" схема',
            cancel: 'Отменить',
            confirm: 'Изменить',
        },

        create_table_schema_dialog: {
            title: 'Создать новую схему',
            description:
                'Схемы еще не существуют. Создайте вашу первую схему, чтобы организовать таблицы.',
            create: 'Создать',
            cancel: 'Отменить',
        },

        star_us_dialog: {
            title: 'Помогите нам стать лучше!',
            description:
                'Хотите отметить нас на GitHub? Это всего лишь один клик!',
            close: 'Не сейчас',
            confirm: 'Конечно!',
        },
        export_diagram_dialog: {
            title: 'Экспорт кода диаграммы',
            description: 'Выберите формат экспорта:',
            format_json: 'JSON',
            cancel: 'Отменить',
            export: 'Экспортировать',
            error: {
                title: 'Ошибка экспортирования диаграммы',
                description:
                    'Что-то пошло не так. Если вам нужна помощь, напишите нам: https://github.com/Lynn-Lee/SchemaFlow/issues',
            },
        },
        import_diagram_dialog: {
            title: 'Импорт кода диаграммы',
            description: 'Вставьте JSON код диаграммы ниже:',
            cancel: 'Отменить',
            import: 'Импортировать',
            error: {
                title: 'Ошибка при импорте диаграммы',
                description:
                    'Код JSON диаграммы некорректен. Проверьте, пожалуйста, код и попробуйте снова. Проблема не решается? Напишите нам: https://github.com/Lynn-Lee/SchemaFlow/issues',
            },
        },
        import_dbml_dialog: {
            example_title: 'Импорт DBML',
            title: 'Импортировать DBML',
            description: 'Импортировать схему базы данных из DBML формата.',
            import: 'Импортировать',
            cancel: 'Отмена',
            skip_and_empty: 'Продолжить с пустой диаграммой',
            show_example: 'Использовать эту схему',

            error: {
                title: 'Ошибка',
                description:
                    'Ошибка парсинга DBML. Пожалуйста проверьте синтаксис.',
            },
        },
        relationship_type: {
            one_to_one: 'Один к одному',
            one_to_many: 'Один ко многим',
            many_to_one: 'Многие к одному',
            many_to_many: 'Многие ко многим',
        },

        canvas_context_menu: {
            new_table: 'Создать таблицу',
            new_view: 'Новое представление',
            new_relationship: 'Создать отношение',
            new_area: 'Новая область',
            new_note: 'Новая Заметка',
        },

        table_node_context_menu: {
            edit_table: 'Изменить таблицу',
            duplicate_table: 'Создать копию',
            delete_table: 'Удалить таблицу',
            add_relationship: 'Добавить связь',
            move_to_area: 'Переместить в область',
            no_area: 'Без области',
        },

        templates_page: {
            heading_featured: 'Featured database schema templates',
            heading_tagged: 'Database schema templates for {{tag}}',
            heading_all: 'Database schema templates',
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
            all_tables_hidden: 'Все таблицы скрыты',
            show_all_tables: 'Показать все',
            mobile_notice: {
                title: 'Mobile editing is limited',
                description:
                    'For reliable canvas editing, use a desktop browser. You can continue on this device.',
                dismiss: 'Dismiss mobile canvas notice',
            },
        },

        canvas_filter: {
            title: 'Фильтр таблиц',
            search_placeholder: 'Поиск таблиц...',
            group_by_schema: 'Группировать по схеме',
            group_by_area: 'Группировать по области',
            no_tables_found: 'Таблицы не найдены',
            empty_diagram_description: 'Создайте таблицу, чтобы начать',
            no_tables_description: 'Попробуйте изменить поиск или фильтр',
            clear_filter: 'Очистить фильтр',
        },

        copy_to_clipboard: 'Скопировать в буфер обмена',
        copied: 'Скопировано!',
        snap_to_grid_tooltip: 'Выравнивание по сетке (Удерживайте {{key}})',
        tool_tips: {
            double_click_to_edit: 'Кликните дважды, чтобы изменить',
        },

        language_select: {
            change_language: 'Сменить язык',
        },

        on: 'Вкл',
        off: 'Выкл',

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

export const ruMetadata: LanguageMetadata = {
    name: 'Russian',
    nativeName: 'Русский',
    code: 'ru',
};

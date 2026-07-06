import type { LanguageMetadata, LanguageTranslation } from '../types';

export const es: LanguageTranslation = {
    translation: {
        editor_sidebar: {
            new_diagram: 'Nuevo',
            browse: 'Abrir',
            tables: 'Tablas',
            refs: 'Refs',
            dependencies: 'Dependencias',
            custom_types: 'Tipos Personalizados',
            visuals: 'Visuales',
            docs: 'Docs',
            settings: 'Settings',
        },
        menu: {
            actions: {
                actions: 'Acciones',
                new: 'Nuevo...',
                browse: 'Todas las bases de datos...',
                save: 'Guardar',
                import: 'Importar Base de Datos',
                export_sql: 'Exportar SQL',
                export_as: 'Exportar como',
                delete_diagram: 'Eliminar',
            },
            edit: {
                edit: 'Editar',
                undo: 'Deshacer',
                redo: 'Rehacer',
                clear: 'Limpiar',
            },
            view: {
                view: 'Ver',
                hide_cardinality: 'Ocultar Cardinalidad',
                show_cardinality: 'Mostrar Cardinalidad',
                show_field_attributes: 'Mostrar Atributos de Campo',
                hide_field_attributes: 'Ocultar Atributos de Campo',
                show_sidebar: 'Mostrar Barra Lateral',
                hide_sidebar: 'Ocultar Barra Lateral',
                zoom_on_scroll: 'Zoom al Desplazarse',
                show_views: 'Vistas de Base de Datos',
                theme: 'Tema',
                show_dependencies: 'Mostrar dependencias',
                hide_dependencies: 'Ocultar dependencias',
                show_minimap: 'Show Mini Map',
                hide_minimap: 'Hide Mini Map',
            },
            backup: {
                backup: 'Respaldo',
                export_diagram: 'Exportar Diagrama',
                restore_diagram: 'Restaurar Diagrama',
            },
            help: {
                help: 'Ayuda',
                docs_website: 'Documentación',
            },
        },

        delete_diagram_alert: {
            title: 'Eliminar Diagrama',
            description:
                'Esta acción no se puede deshacer. Esto eliminará permanentemente el diagrama.',
            cancel: 'Cancelar',
            delete: 'Eliminar',
        },

        clear_diagram_alert: {
            title: 'Limpiar Diagrama',
            description:
                'Esta acción no se puede deshacer. Esto eliminará permanentemente todos los datos en el diagrama.',
            cancel: 'Cancelar',
            clear: 'Limpiar',
        },

        reorder_diagram_alert: {
            title: 'Organizar Diagrama Automáticamente',
            description:
                'Esta acción reorganizará todas las tablas en el diagrama. ¿Deseas continuar?',
            reorder: 'Organizar Automáticamente',
            cancel: 'Cancelar',
        },

        copy_to_clipboard_toast: {
            unsupported: {
                title: 'Copia fallida',
                description: 'Portapapeles no soportado',
            },
            failed: {
                title: 'Copia fallida',
                description: 'Algo salió mal. Por favor, inténtelo de nuevo.',
            },
        },

        theme: {
            system: 'Sistema',
            light: 'Claro',
            dark: 'Oscuro',
        },

        zoom: {
            on: 'Encendido',
            off: 'Apagado',
        },

        last_saved: 'Último guardado',
        saved: 'Guardado',
        loading_diagram: 'Cargando diagrama...',
        deselect_all: 'Deseleccionar todo',
        select_all: 'Seleccionar todo',
        clear: 'Limpiar',
        show_more: 'Mostrar más',
        show_less: 'Mostrar menos',
        copy_to_clipboard: 'Copy to Clipboard',
        copied: 'Copied!',

        side_panel: {
            view_all_options: 'Ver todas las opciones...',
            tables_section: {
                tables: 'Tablas',
                add_table: 'Agregar Tabla',
                add_view: 'Agregar Vista',
                filter: 'Filtrar',
                collapse: 'Colapsar Todo',
                clear: 'Clear Filter',
                no_results: 'No tables found matching your filter.',
                show_list: 'Show Table List',
                show_dbml: 'Show DBML Editor',
                all_hidden: 'Todas las tablas están ocultas',
                show_all: 'Mostrar todo',

                table: {
                    fields: 'Campos',
                    nullable: '¿Opcional?',
                    primary_key: 'Clave Primaria',
                    indexes: 'Índices',
                    check_constraints: 'Restricciones de verificación',
                    comments: 'Comentarios',
                    no_comments: 'Sin comentarios',
                    add_field: 'Agregar Campo',
                    add_index: 'Agregar Índice',
                    add_check: 'Agregar verificación',
                    index_select_fields: 'Seleccionar campos',
                    field_name: 'Nombre',
                    field_type: 'Tipo',
                    no_types_found: 'No se encontraron tipos',
                    field_actions: {
                        title: 'Atributos del Campo',
                        unique: 'Único',
                        auto_increment: 'Autoincremento',
                        comments: 'Comentarios',
                        no_comments: 'Sin comentarios',
                        delete_field: 'Eliminar Campo',
                        default_value: 'Default Value',
                        no_default: 'No default',
                        character_length: 'Max Length',
                        precision: 'Precisión',
                        scale: 'Escala',
                    },
                    index_actions: {
                        title: 'Atributos del Índice',
                        name: 'Nombre',
                        unique: 'Único',
                        index_type: 'Tipo de Índice',
                        delete_index: 'Eliminar Índice',
                    },
                    check_constraint_actions: {
                        title: 'Restricción de verificación',
                        expression: 'Expresión',
                        delete: 'Eliminar restricción',
                    },
                    table_actions: {
                        title: 'Acciones de la Tabla',
                        change_schema: 'Cambiar Esquema',
                        add_field: 'Agregar Campo',
                        add_index: 'Agregar Índice',
                        duplicate_table: 'Duplicate Table',
                        delete_table: 'Eliminar Tabla',
                    },
                },
                empty_state: {
                    title: 'No hay tablas',
                    description: 'Crea una tabla para comenzar',
                },
            },
            refs_section: {
                refs: 'Refs',
                filter: 'Filtrar',
                collapse: 'Colapsar Todo',
                add_relationship: 'Agregar Relación',
                relationships: 'Relaciones',
                dependencies: 'Dependencias',
                relationship: {
                    relationship: 'Relación',
                    primary: 'Tabla Primaria',
                    foreign: 'Tabla Relacionada',
                    cardinality: 'Cardinalidad',
                    delete_relationship: 'Eliminar',
                    switch_tables: 'Intercambiar tablas',
                    relationship_actions: {
                        title: 'Acciones',
                        delete_relationship: 'Eliminar',
                    },
                },
                dependency: {
                    dependency: 'Dependencia',
                    table: 'Tabla',
                    dependent_table: 'Vista Dependiente',
                    delete_dependency: 'Eliminar',
                    dependency_actions: {
                        title: 'Acciones',
                        delete_dependency: 'Eliminar',
                    },
                },
                empty_state: {
                    title: 'Sin relaciones',
                    description: 'Crea una relación para comenzar',
                },
            },

            areas_section: {
                areas: 'Áreas',
                add_area: 'Agregar Área',
                filter: 'Filtrar',
                clear: 'Limpiar Filtro',
                no_results:
                    'No se encontraron áreas que coincidan con tu filtro.',

                area: {
                    area_actions: {
                        title: 'Acciones del Área',
                        edit_name: 'Editar Nombre',
                        delete_area: 'Eliminar Área',
                    },
                },
                empty_state: {
                    title: 'Sin áreas',
                    description: 'Crea un área para comenzar',
                },
            },

            visuals_section: {
                visuals: 'Visuales',
                tabs: {
                    areas: 'Áreas',
                    notes: 'Notas',
                },
            },

            notes_section: {
                filter: 'Filtrar',
                add_note: 'Agregar Nota',
                no_results: 'No se encontraron notas',
                clear: 'Limpiar Filtro',
                empty_state: {
                    title: 'Sin Notas',
                    description:
                        'Crea una nota para agregar anotaciones de texto en el lienzo',
                },
                note: {
                    empty_note: 'Nota vacía',
                    note_actions: {
                        title: 'Acciones de Nota',
                        edit_content: 'Editar Contenido',
                        delete_note: 'Eliminar Nota',
                    },
                },
            },

            custom_types_section: {
                custom_types: 'Tipos Personalizados',
                filter: 'Filtrar',
                clear: 'Limpiar Filtro',
                no_results:
                    'No se encontraron tipos personalizados que coincidan con tu filtro.',
                new_type: 'Nuevo Tipo',
                empty_state: {
                    title: 'Sin tipos personalizados',
                    description:
                        'Los tipos personalizados aparecerán aquí cuando estén disponibles en tu base de datos',
                },
                custom_type: {
                    kind: 'Tipo',
                    enum_values: 'Valores Enum',
                    composite_fields: 'Campos',
                    no_fields: 'Sin campos definidos',
                    no_values: 'No hay valores de enum definidos',
                    field_name_placeholder: 'Nombre del campo',
                    field_type_placeholder: 'Seleccionar tipo',
                    add_field: 'Agregar Campo',
                    no_fields_tooltip:
                        'Sin campos definidos para este tipo personalizado',
                    custom_type_actions: {
                        title: 'Acciones',
                        highlight_fields: 'Resaltar Campos',
                        delete_custom_type: 'Eliminar',
                        clear_field_highlight: 'Quitar Resaltado',
                    },
                    delete_custom_type: 'Eliminar Tipo',
                },
            },
        },

        toolbar: {
            zoom_in: 'Acercar',
            zoom_out: 'Alejar',
            save: 'Guardar',
            show_all: 'Mostrar Todo',
            undo: 'Deshacer',
            redo: 'Rehacer',
            reorder_diagram: 'Organizar Diagrama Automáticamente',
            clear_custom_type_highlight: 'Clear highlight for "{{typeName}}"',
            custom_type_highlight_tooltip:
                'Highlighting "{{typeName}}" - Click to clear',
            highlight_overlapping_tables: 'Resaltar tablas superpuestas',
            filter: 'Filtrar Tablas',
        },

        new_diagram_dialog: {
            database_selection: {
                title: '¿Cuál es tu Base de Datos?',
                description:
                    'Cada base de datos tiene sus propias características y capacidades únicas.',
                transactional: 'Transactional',
                analytical: 'Analytical',
                more_databases: 'More Databases',
                primary_databases: 'Primary Databases',
                check_examples_long: 'Ver Ejemplos',
                check_examples_short: 'Ejemplos',
            },

            import_database: {
                title: 'Importa tu Base de Datos',
                database_edition: 'Edición de Base de Datos:',
                step_1: 'Ejecuta este script en tu base de datos:',
                step_2: 'Pega el resultado del script aquí →',
                script_results_placeholder: 'Resultados del script aquí...',
                ssms_instructions: {
                    button_text: 'Instrucciones SSMS',
                    title: 'Instrucciones',
                    step_1: 'Ve a Herramientas > Opciones > Resultados de Consulta > SQL Server.',
                    step_2: 'Si estás usando "Resultados en Cuadrícula", cambia el Máximo de Caracteres Recuperados para Datos No XML (configúralo en 9999999).',
                },
                instructions_link: '¿Necesitas ayuda? mira cómo',
                check_script_result: 'Revisa el resultado del script',
            },

            cancel: 'Cancelar',
            back: 'Atrás',
            import_from_file: 'Import from File',
            empty_diagram: 'Base de datos vacía',
            continue: 'Continuar',
            import: 'Importar',
        },

        open_diagram_dialog: {
            title: 'Abrir Base de Datos',
            description:
                'Selecciona un diagrama para abrir de la lista a continuación.',
            table_columns: {
                name: 'Nombre',
                created_at: 'Creado en',
                last_modified: 'Última modificación',
                tables_count: 'Tablas',
            },
            cancel: 'Cancelar',
            open: 'Abrir',
            new_database: 'Nueva Base de Datos',
            load_error: {
                title: 'Could not load local diagrams',
                description:
                    'Local diagrams could not be read. Check browser storage permissions or create a new database.',
                retry: 'Retry loading diagrams',
            },

            diagram_actions: {
                open: 'Abrir',
                duplicate: 'Duplicar',
                delete: 'Eliminar',
            },
        },

        export_sql_dialog: {
            title: 'Exportar SQL',
            description:
                'Exporta el esquema de tu diagrama a un script {{databaseType}}',
            close: 'Cerrar',
            mode: {
                deterministic: 'Deterministic',
                ai: 'AI',
            },
            loading: {
                text: 'La IA está generando SQL para {{databaseType}}...',
                description: 'Esto debería tomar hasta 30 segundos.',
            },
            error: {
                message:
                    'Error al generar el script SQL. Por favor, intenta nuevamente más tarde o <0>contáctanos</0>.',
                description:
                    'Siéntete libre de usar tu OPENAI_TOKEN, consulta el manual <0>aquí</0>.',
            },
        },

        create_relationship_dialog: {
            cancel: 'Cancelar',
            create: 'Crear',
            no_fields_found: 'No se encontraron campos',
            no_tables_found: 'No se encontraron tablas',
            primary_field: 'Campo Primario',
            primary_table: 'Tabla Primaria',
            primary_table_placeholder: 'Seleccionar tabla',
            primary_field_placeholder: 'Seleccionar campo',
            referenced_field: 'Campo Referenciado',
            referenced_field_placeholder: 'Seleccionar campo',
            referenced_table: 'Tabla Referenciada',
            referenced_table_placeholder: 'Seleccionar tabla',
            title: 'Crear Relación',
        },

        import_database_dialog: {
            title: 'Importar a Diagrama Actual',
            override_alert: {
                title: 'Importar Base de Datos',
                content: {
                    alert: 'Importar este diagrama afectará las tablas y relaciones existentes.',
                    new_tables:
                        '<bold>{{newTablesNumber}}</bold> nuevas tablas se agregarán.',
                    new_relationships:
                        '<bold>{{newRelationshipsNumber}}</bold> nuevas relaciones se crearán.',
                    tables_override:
                        '<bold>{{tablesOverrideNumber}}</bold> tablas se sobrescribirán.',
                    proceed: '¿Deseas continuar?',
                },
                import: 'Importar',
                cancel: 'Cancelar',
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
            title: 'Exportar imagen',
            description: 'Escoge el factor de escalamiento para exportar:',
            scale_1x: '1x (Baja calidad)',
            scale_2x: '2x (Calidad normal)',
            scale_4x: '4x (Mejor calidad)',
            cancel: 'Cancelar',
            export: 'Exportar',
            advanced_options: 'Advanced Options',
            pattern: 'Include background pattern',
            pattern_description: 'Add subtle grid pattern to background.',
            transparent: 'Transparent background',
            transparent_description: 'Remove background color from image.',
        },

        new_table_schema_dialog: {
            title: 'Seleccionar Esquema',
            description:
                'Actualmente se muestran múltiples esquemas. Selecciona uno para la nueva tabla.',
            cancel: 'Cancelar',
            confirm: 'Confirmar',
        },

        update_table_schema_dialog: {
            title: 'Cambiar Esquema',
            description: 'Actualizar esquema de la tabla "{{tableName}}"',
            cancel: 'Cancelar',
            confirm: 'Cambiar',
        },
        create_table_schema_dialog: {
            title: 'Crear Nuevo Esquema',
            description:
                'Aún no existen esquemas. Crea tu primer esquema para organizar tus tablas.',
            create: 'Crear',
            cancel: 'Cancelar',
        },

        star_us_dialog: {
            title: '¡Ayúdanos a mejorar!',
            description:
                '¿Te gusta SchemaFlow? Por favor, danos una estrella en GitHub.',
            close: 'Ahora no',
            confirm: '¡Claro!',
        },

        export_diagram_dialog: {
            title: 'Export Diagram',
            description: 'Choose the format for export:',
            format_json: 'JSON',
            cancel: 'Cancel',
            export: 'Export',
            error: {
                title: 'Error exporting diagram',
                description:
                    'Something went wrong. Need help? https://github.com/Lynn-Lee/SchemaFlow/issues',
            },
        },
        import_diagram_dialog: {
            title: 'Import Diagram',
            description: 'Paste the diagram JSON below:',
            cancel: 'Cancel',
            import: 'Import',
            error: {
                title: 'Error importing diagram',
                description:
                    'The diagram JSON is invalid. Please check the JSON and try again. Need help? https://github.com/Lynn-Lee/SchemaFlow/issues',
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
            one_to_one: 'Uno a Uno',
            one_to_many: 'Uno a Muchos',
            many_to_one: 'Muchos a Uno',
            many_to_many: 'Muchos a Muchos',
        },

        canvas_context_menu: {
            new_table: 'Nueva Tabla',
            new_view: 'Nueva Vista',
            new_relationship: 'Nueva Relación',
            new_area: 'Nueva Área',
            new_note: 'Nueva Nota',
        },

        table_node_context_menu: {
            edit_table: 'Editar Tabla',
            duplicate_table: 'Duplicate Table',
            delete_table: 'Eliminar Tabla',
            add_relationship: 'Add Relationship',
            move_to_area: 'Mover a Área',
            no_area: 'Sin Área',
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
            all_tables_hidden: 'Todas las tablas están ocultas',
            show_all_tables: 'Mostrar todo',
            mobile_notice: {
                title: 'Mobile editing is limited',
                description:
                    'For reliable canvas editing, use a desktop browser. You can continue on this device.',
                dismiss: 'Dismiss mobile canvas notice',
            },
        },

        canvas_filter: {
            title: 'Filtrar Tablas',
            search_placeholder: 'Buscar tablas...',
            group_by_schema: 'Agrupar por Esquema',
            group_by_area: 'Agrupar por Área',
            no_tables_found: 'No se encontraron tablas',
            empty_diagram_description: 'Crea una tabla para comenzar',
            no_tables_description: 'Intenta ajustar tu búsqueda o filtro',
            clear_filter: 'Limpiar filtro',
        },

        snap_to_grid_tooltip: 'Snap to Grid (Hold {{key}})',

        tool_tips: {
            double_click_to_edit: 'Doble clic para editar',
        },

        language_select: {
            change_language: 'Idioma',
        },

        on: 'Encendido',
        off: 'Apagado',

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

export const esMetadata: LanguageMetadata = {
    name: 'Spanish',
    nativeName: 'Español',
    code: 'es',
};

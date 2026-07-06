import type { LanguageMetadata } from '../types';

export const en = {
    translation: {
        editor_sidebar: {
            new_diagram: 'New',
            browse: 'Open',
            tables: 'Tables',
            refs: 'Refs',
            dependencies: 'Dependencies',
            custom_types: 'Custom Types',
            visuals: 'Visuals',
            docs: 'Docs',
            settings: 'Settings',
        },
        menu: {
            actions: {
                actions: 'Actions',
                new: 'New...',
                browse: 'All Databases...',
                save: 'Save',
                import: 'Import',
                export_sql: 'Export SQL',
                export_as: 'Export as',
                delete_diagram: 'Delete',
            },
            edit: {
                edit: 'Edit',
                undo: 'Undo',
                redo: 'Redo',
                clear: 'Clear',
            },
            view: {
                view: 'View',
                show_sidebar: 'Show Sidebar',
                hide_sidebar: 'Hide Sidebar',
                hide_cardinality: 'Hide Cardinality',
                show_cardinality: 'Show Cardinality',
                hide_field_attributes: 'Hide Field Attributes',
                show_field_attributes: 'Show Field Attributes',
                zoom_on_scroll: 'Zoom on Scroll',
                show_views: 'Database Views',
                theme: 'Theme',
                show_dependencies: 'Show Dependencies',
                hide_dependencies: 'Hide Dependencies',
                show_minimap: 'Show Mini Map',
                hide_minimap: 'Hide Mini Map',
            },
            backup: {
                backup: 'Backup',
                export_diagram: 'Export Diagram',
                restore_diagram: 'Restore Diagram',
            },
            help: {
                help: 'Help',
                docs_website: 'Docs',
            },
        },

        delete_diagram_alert: {
            title: 'Delete Diagram',
            description:
                'This action cannot be undone. This will permanently delete the diagram.',
            cancel: 'Cancel',
            delete: 'Delete',
        },

        clear_diagram_alert: {
            title: 'Clear Diagram',
            description:
                'This action cannot be undone. This will permanently delete all the data in the diagram.',
            cancel: 'Cancel',
            clear: 'Clear',
        },

        reorder_diagram_alert: {
            title: 'Auto Arrange Diagram',
            description:
                'This action will rearrange all tables in the diagram. Do you want to continue?',
            reorder: 'Auto Arrange',
            cancel: 'Cancel',
        },

        copy_to_clipboard_toast: {
            unsupported: {
                title: 'Copy failed',
                description: 'Clipboard not supported.',
            },
            failed: {
                title: 'Copy failed',
                description: 'Something went wrong. Please try again.',
            },
        },

        theme: {
            system: 'System',
            light: 'Light',
            dark: 'Dark',
        },

        zoom: {
            on: 'On',
            off: 'Off',
        },

        last_saved: 'Last saved',
        saved: 'Saved',
        loading_diagram: 'Loading diagram...',
        deselect_all: 'Deselect All',
        select_all: 'Select All',
        clear: 'Clear',
        show_more: 'Show More',
        show_less: 'Show Less',
        copy_to_clipboard: 'Copy to Clipboard',
        copied: 'Copied!',

        side_panel: {
            view_all_options: 'View all Options...',
            tables_section: {
                tables: 'Tables',
                add_table: 'Add Table',
                add_view: 'Add View',
                filter: 'Filter',
                collapse: 'Collapse All',
                clear: 'Clear Filter',
                no_results: 'No tables found matching your filter.',
                show_list: 'Show Table List',
                show_dbml: 'Show DBML Editor',
                all_hidden: 'All tables are hidden',
                show_all: 'Show all',

                table: {
                    fields: 'Fields',
                    nullable: 'Nullable?',
                    primary_key: 'Primary Key',
                    indexes: 'Indexes',
                    check_constraints: 'Check Constraints',
                    comments: 'Comments',
                    no_comments: 'No comments',
                    add_field: 'Add Field',
                    add_index: 'Add Index',
                    add_check: 'Add Check',
                    index_select_fields: 'Select fields',
                    no_types_found: 'No types found',
                    field_name: 'Name',
                    field_type: 'Type',
                    field_actions: {
                        title: 'Field Attributes',
                        unique: 'Unique',
                        auto_increment: 'Auto Increment',
                        character_length: 'Max Length',
                        precision: 'Precision',
                        scale: 'Scale',
                        comments: 'Comments',
                        no_comments: 'No comments',
                        default_value: 'Default Value',
                        no_default: 'No default',
                        delete_field: 'Delete Field',
                    },
                    index_actions: {
                        title: 'Index Attributes',
                        name: 'Name',
                        unique: 'Unique',
                        index_type: 'Index Type',
                        delete_index: 'Delete Index',
                    },
                    check_constraint_actions: {
                        title: 'Check Constraint',
                        expression: 'Expression',
                        delete: 'Delete Check Constraint',
                    },
                    table_actions: {
                        title: 'Table Actions',
                        change_schema: 'Change Schema',
                        add_field: 'Add Field',
                        add_index: 'Add Index',
                        duplicate_table: 'Duplicate Table',
                        delete_table: 'Delete Table',
                    },
                },
                empty_state: {
                    title: 'No tables',
                    description: 'Create a table to get started',
                },
            },
            refs_section: {
                refs: 'Refs',
                filter: 'Filter',
                collapse: 'Collapse All',
                add_relationship: 'Add Relationship',
                relationships: 'Relationships',
                dependencies: 'Dependencies',
                relationship: {
                    relationship: 'Relationship',
                    primary: 'Primary Table',
                    foreign: 'Related Table',
                    cardinality: 'Cardinality',
                    delete_relationship: 'Delete',
                    switch_tables: 'Switch Tables',
                    relationship_actions: {
                        title: 'Actions',
                        delete_relationship: 'Delete',
                    },
                },
                dependency: {
                    dependency: 'Dependency',
                    table: 'Table',
                    dependent_table: 'Dependent View',
                    delete_dependency: 'Delete',
                    dependency_actions: {
                        title: 'Actions',
                        delete_dependency: 'Delete',
                    },
                },
                empty_state: {
                    title: 'No relationships',
                    description: 'Create a relationship to get started',
                },
            },

            areas_section: {
                areas: 'Areas',
                add_area: 'Add Area',
                filter: 'Filter',
                clear: 'Clear Filter',
                no_results: 'No areas found matching your filter.',

                area: {
                    area_actions: {
                        title: 'Area Actions',
                        edit_name: 'Edit Name',
                        delete_area: 'Delete Area',
                    },
                },
                empty_state: {
                    title: 'No areas',
                    description: 'Create an area to get started',
                },
            },

            visuals_section: {
                visuals: 'Visuals',
                tabs: {
                    areas: 'Areas',
                    notes: 'Notes',
                },
            },

            notes_section: {
                filter: 'Filter',
                add_note: 'Add Note',
                no_results: 'No notes found',
                clear: 'Clear Filter',
                empty_state: {
                    title: 'No Notes',
                    description:
                        'Create a note to add text annotations on the canvas',
                },
                note: {
                    empty_note: 'Empty note',
                    note_actions: {
                        title: 'Note Actions',
                        edit_content: 'Edit Content',
                        delete_note: 'Delete Note',
                    },
                },
            },

            custom_types_section: {
                custom_types: 'Custom Types',
                filter: 'Filter',
                clear: 'Clear Filter',
                no_results: 'No custom types found matching your filter.',
                new_type: 'New Type',
                empty_state: {
                    title: 'No custom types',
                    description:
                        'Custom types will appear here when they are available in your database',
                },
                custom_type: {
                    kind: 'Kind',
                    enum_values: 'Enum Values',
                    composite_fields: 'Fields',
                    no_fields: 'No fields defined',
                    no_values: 'No enum values defined',
                    field_name_placeholder: 'Field name',
                    field_type_placeholder: 'Select type',
                    add_field: 'Add Field',
                    no_fields_tooltip: 'No fields defined for this custom type',
                    custom_type_actions: {
                        title: 'Actions',
                        highlight_fields: 'Highlight Fields',
                        clear_field_highlight: 'Clear Highlight',
                        delete_custom_type: 'Delete',
                    },
                    delete_custom_type: 'Delete Type',
                },
            },
        },

        toolbar: {
            zoom_in: 'Zoom In',
            zoom_out: 'Zoom Out',
            save: 'Save',
            show_all: 'Show All',
            undo: 'Undo',
            redo: 'Redo',
            reorder_diagram: 'Auto Arrange Diagram',
            highlight_overlapping_tables: 'Highlight Overlapping Tables',
            clear_custom_type_highlight: 'Clear highlight for "{{typeName}}"',
            custom_type_highlight_tooltip:
                'Highlighting "{{typeName}}" - Click to clear',
            filter: 'Filter Tables',
        },

        new_diagram_dialog: {
            database_selection: {
                title: 'What is your Database?',
                description:
                    'Each database has its own unique features and capabilities.',
                transactional: 'Transactional',
                analytical: 'Analytical',
                more_databases: 'More Databases',
                primary_databases: 'Primary Databases',
                check_examples_long: 'Check Examples',
                check_examples_short: 'Examples',
            },

            import_database: {
                title: 'Import your Database',
                database_edition: 'Database Edition:',
                step_1: 'Run this script in your database:',
                step_2: 'Paste the script result into this modal →',
                script_results_placeholder: 'Script results here...',
                ssms_instructions: {
                    button_text: 'SSMS Instructions',
                    title: 'Instructions',
                    step_1: 'Go to Tools > Options > Query Results > SQL Server.',
                    step_2: 'If you\'re using "Results to Grid," change the Maximum Characters Retrieved for Non-XML data (set to 9999999).',
                },
                instructions_link: 'Need help? Watch how',
                check_script_result: 'Check Script Result',
            },

            cancel: 'Cancel',
            import_from_file: 'Import from File',
            back: 'Back',
            empty_diagram: 'Empty database',
            continue: 'Continue',
            import: 'Import',
        },

        open_diagram_dialog: {
            title: 'Open Database',
            description: 'Select a diagram to open from the list below.',
            table_columns: {
                name: 'Name',
                created_at: 'Created at',
                last_modified: 'Last modified',
                tables_count: 'Tables',
            },
            cancel: 'Cancel',
            open: 'Open',
            new_database: 'New Database',
            load_error: {
                title: 'Could not load local diagrams',
                description:
                    'Local diagrams could not be read. Check browser storage permissions or create a new database.',
                retry: 'Retry loading diagrams',
            },

            diagram_actions: {
                open: 'Open',
                duplicate: 'Duplicate',
                delete: 'Delete',
            },
        },

        export_sql_dialog: {
            title: 'Export SQL',
            description:
                'Export your diagram schema to {{databaseType}} script',
            close: 'Close',
            mode: {
                deterministic: 'Deterministic',
                ai: 'AI',
            },
            loading: {
                text: 'AI is generating SQL for {{databaseType}}...',
                description: 'This should take up to 30 seconds.',
            },
            error: {
                message:
                    'Error generating SQL script. Please try again later or <0>contact us</0>.',
                description:
                    'Feel free to use your OPENAI_TOKEN, see the manual <0>here</0>.',
            },
        },

        create_relationship_dialog: {
            title: 'Create Relationship',
            primary_table: 'Primary Table',
            primary_field: 'Primary Field',
            referenced_table: 'Referenced Table',
            referenced_field: 'Referenced Field',
            primary_table_placeholder: 'Select table',
            primary_field_placeholder: 'Select field',
            referenced_table_placeholder: 'Select table',
            referenced_field_placeholder: 'Select field',
            no_tables_found: 'No tables found',
            no_fields_found: 'No fields found',
            create: 'Create',
            cancel: 'Cancel',
        },

        import_database_dialog: {
            title: 'Import to Current Diagram',
            override_alert: {
                title: 'Import Database',
                content: {
                    alert: 'Importing this diagram will affect existing tables and relationships.',
                    new_tables:
                        '<bold>{{newTablesNumber}}</bold> new tables will be added.',
                    new_relationships:
                        '<bold>{{newRelationshipsNumber}}</bold> new relationships will be created.',
                    tables_override:
                        '<bold>{{tablesOverrideNumber}}</bold> tables will be overwritten.',
                    proceed: 'Do you want to proceed?',
                },
                import: 'Import',
                cancel: 'Cancel',
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
            title: 'Export Image',
            description: 'Choose the scale factor for export:',
            scale_1x: '1x (Low Quality)',
            scale_2x: '2x (Normal Quality)',
            scale_4x: '4x (Best Quality)',
            cancel: 'Cancel',
            export: 'Export',
            advanced_options: 'Advanced Options',
            pattern: 'Include background pattern',
            pattern_description: 'Add subtle grid pattern to background.',
            transparent: 'Transparent background',
            transparent_description: 'Remove background color from image.',
        },

        new_table_schema_dialog: {
            title: 'Select Schema',
            description:
                'Multiple schemas are currently displayed. Select one for the new table.',
            cancel: 'Cancel',
            confirm: 'Confirm',
        },

        update_table_schema_dialog: {
            title: 'Change Schema',
            description: 'Update table "{{tableName}}" schema',
            cancel: 'Cancel',
            confirm: 'Change',
        },

        create_table_schema_dialog: {
            title: 'Create New Schema',
            description:
                'No schemas exist yet. Create your first schema to organize your tables.',
            create: 'Create',
            cancel: 'Cancel',
        },

        star_us_dialog: {
            title: 'Help us improve!',
            description:
                "Would you like to star us on GitHub? It's just a click away!",
            close: 'Not now',
            confirm: 'Of course!',
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
            description: 'Import a diagram from a JSON file.',
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
                title: 'Error importing DBML',
                description: 'Failed to parse DBML. Please check the syntax.',
            },
        },
        relationship_type: {
            one_to_one: 'One to One',
            one_to_many: 'One to Many',
            many_to_one: 'Many to One',
            many_to_many: 'Many to Many',
        },

        canvas_context_menu: {
            new_table: 'New Table',
            new_view: 'New View',
            new_relationship: 'New Relationship',
            new_area: 'New Area',
            new_note: 'New Note',
        },

        table_node_context_menu: {
            edit_table: 'Edit Table',
            duplicate_table: 'Duplicate Table',
            delete_table: 'Delete Table',
            add_relationship: 'Add Relationship',
            move_to_area: 'Move to Area',
            no_area: 'No Area',
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
            all_tables_hidden: 'All tables are hidden',
            show_all_tables: 'Show all',
            mobile_notice: {
                title: 'Mobile editing is limited',
                description:
                    'For reliable canvas editing, use a desktop browser. You can continue on this device.',
                dismiss: 'Dismiss mobile canvas notice',
            },
        },

        canvas_filter: {
            title: 'Filter Tables',
            search_placeholder: 'Search tables...',
            group_by_schema: 'Group by Schema',
            group_by_area: 'Group by Area',
            no_tables_found: 'No tables found',
            empty_diagram_description: 'Create a table to get started',
            no_tables_description: 'Try adjusting your search or filter',
            clear_filter: 'Clear filter',
        },

        snap_to_grid_tooltip: 'Snap to Grid (Hold {{key}})',

        tool_tips: {
            double_click_to_edit: 'Double-click to edit',
        },

        language_select: {
            change_language: 'Language',
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

        on: 'On',
        off: 'Off',

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

export const enMetadata: LanguageMetadata = {
    name: 'English',
    nativeName: 'English',
    code: 'en',
};

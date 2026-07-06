import type { LanguageMetadata, LanguageTranslation } from '../types';

export const de: LanguageTranslation = {
    translation: {
        editor_sidebar: {
            new_diagram: 'Neu',
            browse: 'Öffnen',
            tables: 'Tabellen',
            refs: 'Refs',
            dependencies: 'Abhängigkeiten',
            custom_types: 'Benutzerdefinierte Typen',
            visuals: 'Darstellungen',
        },
        menu: {
            actions: {
                actions: 'Aktionen',
                new: 'Neu...',
                browse: 'Alle Datenbanken...',
                save: 'Speichern',
                import: 'Datenbank importieren',
                export_sql: 'SQL exportieren',
                export_as: 'Exportieren als',
                delete_diagram: 'Löschen',
            },
            edit: {
                edit: 'Bearbeiten',
                undo: 'Rückgängig',
                redo: 'Wiederholen',
                clear: 'Leeren',
            },
            view: {
                view: 'Ansicht',
                show_sidebar: 'Seitenleiste anzeigen',
                hide_sidebar: 'Seitenleiste ausblenden',
                hide_cardinality: 'Kardinalität ausblenden',
                show_cardinality: 'Kardinalität anzeigen',
                hide_field_attributes: 'Feldattribute ausblenden',
                show_field_attributes: 'Feldattribute anzeigen',
                zoom_on_scroll: 'Zoom beim Scrollen',
                show_views: 'Datenbankansichten',
                theme: 'Stil',
                show_dependencies: 'Abhängigkeiten anzeigen',
                hide_dependencies: 'Abhängigkeiten ausblenden',
                show_minimap: 'Show Mini Map',
                hide_minimap: 'Hide Mini Map',
            },
            backup: {
                backup: 'Sicherung',
                export_diagram: 'Diagramm exportieren',
                restore_diagram: 'Diagramm wiederherstellen',
            },
            help: {
                help: 'Hilfe',
                docs_website: 'Dokumentation',
                join_discord: 'Auf Discord beitreten',
            },
        },

        delete_diagram_alert: {
            title: 'Diagramm löschen',
            description:
                'Diese Aktion kann nicht rückgängig gemacht werden. Das Diagramm wird dauerhaft gelöscht.',
            cancel: 'Abbrechen',
            delete: 'Löschen',
        },

        clear_diagram_alert: {
            title: 'Diagramm leeren',
            description:
                'Diese Aktion kann nicht rückgängig gemacht werden. Alle Daten im Diagramm werden dauerhaft gelöscht.',
            cancel: 'Abbrechen',
            clear: 'Leeren',
        },

        reorder_diagram_alert: {
            title: 'Diagramm automatisch anordnen',
            description:
                'Diese Aktion wird alle Tabellen im Diagramm neu anordnen. Möchten Sie fortfahren?',
            reorder: 'Automatisch anordnen',
            cancel: 'Abbrechen',
        },

        copy_to_clipboard_toast: {
            unsupported: {
                title: 'Kopieren fehlgeschlagen',
                description: 'Zwischenablage nicht unterstützt',
            },
            failed: {
                title: 'Kopieren fehlgeschlagen',
                description:
                    'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
            },
        },

        theme: {
            system: 'System',
            light: 'Hell',
            dark: 'Dunkel',
        },

        zoom: {
            on: 'Ein',
            off: 'Aus',
        },

        last_saved: 'Zuletzt gespeichert',
        saved: 'Gespeichert',
        loading_diagram: 'Diagramm wird geladen...',
        deselect_all: 'Alles abwählen',
        select_all: 'Alles auswählen',
        clear: 'Leeren',
        show_more: 'Mehr anzeigen',
        show_less: 'Weniger anzeigen',
        copy_to_clipboard: 'In die Zwischenablage kopieren',
        copied: 'Kopiert!',

        side_panel: {
            view_all_options: 'Alle Optionen anzeigen...',
            tables_section: {
                tables: 'Tabellen',
                add_table: 'Tabelle hinzufügen',
                add_view: 'Ansicht hinzufügen',
                filter: 'Filter',
                collapse: 'Alle einklappen',
                clear: 'Clear Filter',
                no_results: 'No tables found matching your filter.',
                show_list: 'Show Table List',
                show_dbml: 'Show DBML Editor',
                all_hidden: 'Alle Tabellen sind ausgeblendet',
                show_all: 'Alle anzeigen',

                table: {
                    fields: 'Felder',
                    nullable: 'Nullable?',
                    primary_key: 'Primärschlüssel',
                    indexes: 'Indizes',
                    check_constraints: 'Prüfbedingungen',
                    comments: 'Kommentare',
                    no_comments: 'Keine Kommentare',
                    add_field: 'Feld hinzufügen',
                    add_index: 'Index hinzufügen',
                    add_check: 'Prüfung hinzufügen',
                    index_select_fields: 'Felder auswählen',
                    no_types_found: 'Keine Datentypen gefunden',
                    field_name: 'Name',
                    field_type: 'Datentyp',
                    field_actions: {
                        title: 'Feldattribute',
                        unique: 'Eindeutig',
                        auto_increment: 'Automatisch hochzählen',
                        comments: 'Kommentare',
                        no_comments: 'Keine Kommentare',
                        delete_field: 'Feld löschen',
                        default_value: 'Default Value',
                        no_default: 'No default',
                        character_length: 'Max Length',
                        precision: 'Präzision',
                        scale: 'Skalierung',
                    },
                    index_actions: {
                        title: 'Indexattribute',
                        name: 'Name',
                        unique: 'Eindeutig',
                        index_type: 'Indextyp',
                        delete_index: 'Index löschen',
                    },
                    check_constraint_actions: {
                        title: 'Prüfbedingung',
                        expression: 'Ausdruck',
                        delete: 'Prüfbedingung löschen',
                    },
                    table_actions: {
                        title: 'Tabellenaktionen',
                        change_schema: 'Schema ändern',
                        add_field: 'Feld hinzufügen',
                        add_index: 'Index hinzufügen',
                        duplicate_table: 'Duplicate Table',
                        delete_table: 'Tabelle löschen',
                    },
                },
                empty_state: {
                    title: 'Keine Tabellen',
                    description: 'Erstellen Sie eine Tabelle, um zu beginnen',
                },
            },
            refs_section: {
                refs: 'Refs',
                filter: 'Filter',
                collapse: 'Alle einklappen',
                add_relationship: 'Beziehung hinzufügen',
                relationships: 'Beziehungen',
                dependencies: 'Abhängigkeiten',
                relationship: {
                    relationship: 'Beziehung',
                    primary: 'Primäre Tabelle',
                    foreign: 'Verknüpfte Tabelle',
                    cardinality: 'Kardinalität',
                    delete_relationship: 'Löschen',
                    switch_tables: 'Tabellen tauschen',
                    relationship_actions: {
                        title: 'Aktionen',
                        delete_relationship: 'Löschen',
                    },
                },
                dependency: {
                    dependency: 'Abhängigkeit',
                    table: 'Tabelle',
                    dependent_table: 'Abhängige Ansicht',
                    delete_dependency: 'Löschen',
                    dependency_actions: {
                        title: 'Aktionen',
                        delete_dependency: 'Löschen',
                    },
                },
                empty_state: {
                    title: 'Keine Beziehungen',
                    description: 'Erstellen Sie eine Beziehung, um zu beginnen',
                },
            },

            areas_section: {
                areas: 'Bereiche',
                add_area: 'Bereich hinzufügen',
                filter: 'Filter',
                clear: 'Filter löschen',
                no_results:
                    'Keine Bereiche gefunden, die Ihrem Filter entsprechen.',

                area: {
                    area_actions: {
                        title: 'Bereich-Aktionen',
                        edit_name: 'Name bearbeiten',
                        delete_area: 'Bereich löschen',
                    },
                },
                empty_state: {
                    title: 'Keine Bereiche',
                    description: 'Erstellen Sie einen Bereich, um zu beginnen',
                },
            },

            visuals_section: {
                visuals: 'Darstellungen',
                tabs: {
                    areas: 'Bereiche',
                    notes: 'Notizen',
                },
            },

            notes_section: {
                filter: 'Filter',
                add_note: 'Notiz hinzufügen',
                no_results: 'Keine Notizen gefunden',
                clear: 'Filter löschen',
                empty_state: {
                    title: 'Keine Notizen',
                    description:
                        'Erstellen Sie eine Notiz, um Textanmerkungen auf der Leinwand hinzuzufügen',
                },
                note: {
                    empty_note: 'Leere Notiz',
                    note_actions: {
                        title: 'Notiz-Aktionen',
                        edit_content: 'Inhalt bearbeiten',
                        delete_note: 'Notiz löschen',
                    },
                },
            },

            custom_types_section: {
                custom_types: 'Benutzerdefinierte Typen',
                filter: 'Filter',
                clear: 'Filter löschen',
                no_results:
                    'Keine benutzerdefinierten Typen gefunden, die Ihrem Filter entsprechen.',
                new_type: 'Neuer Typ',
                empty_state: {
                    title: 'Keine benutzerdefinierten Typen',
                    description:
                        'Benutzerdefinierte Typen werden hier angezeigt, wenn sie in Ihrer Datenbank verfügbar sind',
                },
                custom_type: {
                    kind: 'Art',
                    enum_values: 'Enum-Werte',
                    composite_fields: 'Felder',
                    no_fields: 'Keine Felder definiert',
                    no_values: 'Keine Enum-Werte definiert',
                    field_name_placeholder: 'Feldname',
                    field_type_placeholder: 'Typ auswählen',
                    add_field: 'Feld hinzufügen',
                    no_fields_tooltip:
                        'Keine Felder für diesen benutzerdefinierten Typ definiert',
                    custom_type_actions: {
                        title: 'Aktionen',
                        highlight_fields: 'Felder hervorheben',
                        delete_custom_type: 'Löschen',
                        clear_field_highlight: 'Hervorhebung entfernen',
                    },
                    delete_custom_type: 'Typ löschen',
                },
            },
        },

        toolbar: {
            zoom_in: 'Vergrößern',
            zoom_out: 'Verkleinern',
            save: 'Speichern',
            show_all: 'Alle anzeigen',
            undo: 'Rückgängig',
            redo: 'Wiederholen',
            reorder_diagram: 'Diagramm automatisch anordnen',

            clear_custom_type_highlight: 'Clear highlight for "{{typeName}}"',
            custom_type_highlight_tooltip:
                'Highlighting "{{typeName}}" - Click to clear',
            highlight_overlapping_tables: 'Überlappende Tabellen hervorheben',
            filter: 'Tabellen filtern',
        },

        new_diagram_dialog: {
            database_selection: {
                title: 'Welche Datenbank verwenden Sie?',
                description:
                    'Jede Datenbank hat ihre eigenen Funktionen und Möglichkeiten.',
                check_examples_long: 'Beispiele ansehen',
                check_examples_short: 'Beispiele',
            },

            import_database: {
                title: 'Datenbank importieren',
                database_edition: 'Datenbank Edition:',
                step_1: 'Führen Sie dieses Skript in Ihrer Datenbank aus:',
                step_2: 'Fügen Sie das Skriptergebnis hier ein →',
                script_results_placeholder: 'Skriptergebnisse hier...',
                ssms_instructions: {
                    button_text: 'SSMS Anweisungen',
                    title: 'Anweisungen',
                    step_1: 'Gehen Sie zu Tools > Optionen > Abfrageergebnisse > SQL Server.',
                    step_2: 'Wenn Sie "Ergebnisse in Raster" verwenden, ändern Sie die maximale Zeichenanzahl für Nicht-XML-Daten (auf 9999999 setzen).',
                },
                instructions_link: 'Brauchen Sie Hilfe? So geht’s',
                check_script_result: 'Skriptergebnis überprüfen',
            },

            cancel: 'Abbrechen',
            back: 'Zurück',
            import_from_file: 'Import from File',
            empty_diagram: 'Leere Datenbank',
            continue: 'Weiter',
            import: 'Importieren',
        },

        open_diagram_dialog: {
            title: 'Datenbank öffnen',
            description: 'Wählen Sie ein Diagramm aus der Liste unten aus.',
            table_columns: {
                name: 'Name',
                created_at: 'Erstellt am',
                last_modified: 'Zuletzt geändert',
                tables_count: 'Tabellen',
            },
            cancel: 'Abbrechen',
            open: 'Öffnen',
            new_database: 'Neue Datenbank',

            diagram_actions: {
                open: 'Öffnen',
                duplicate: 'Duplizieren',
                delete: 'Löschen',
            },
        },

        export_sql_dialog: {
            title: 'SQL exportieren',
            description:
                'Exportieren Sie das Schema Ihres Diagramms in ein {{databaseType}} Skript',
            close: 'Schließen',
            mode: {
                deterministic: 'Deterministic',
                ai: 'AI',
            },
            loading: {
                text: 'Die KI generiert SQL für {{databaseType}}...',
                description: 'Dies sollte bis zu 30 Sekunden dauern.',
            },
            error: {
                message:
                    'Fehler beim Generieren des SQL-Skripts. Bitte versuchen Sie es später erneut oder <0>kontaktieren Sie uns</0>.',
                description:
                    'Verwenden Sie Ihren OPENAI_TOKEN, siehe Anleitung <0>hier</0>.',
            },
        },

        create_relationship_dialog: {
            title: 'Beziehung erstellen',
            primary_table: 'Primäre Tabelle',
            primary_field: 'Primäres Feld',
            referenced_table: 'Referenzierte Tabelle',
            referenced_field: 'Referenziertes Feld',
            primary_table_placeholder: 'Tabelle auswählen',
            primary_field_placeholder: 'Feld auswählen',
            referenced_table_placeholder: 'Tabelle auswählen',
            referenced_field_placeholder: 'Feld auswählen',
            no_tables_found: 'Keine Tabellen gefunden',
            no_fields_found: 'Keine Felder gefunden',
            create: 'Erstellen',
            cancel: 'Abbrechen',
        },

        import_database_dialog: {
            title: 'In aktuelles Diagramm importieren',
            override_alert: {
                title: 'Datenbank importieren',
                content: {
                    alert: 'Das Importieren dieses Diagramms wird vorhandene Tabellen und Beziehungen beeinflussen.',
                    new_tables:
                        '<bold>{{newTablesNumber}}</bold> neue Tabellen werden hinzugefügt.',
                    new_relationships:
                        '<bold>{{newRelationshipsNumber}}</bold> neue Beziehungen werden erstellt.',
                    tables_override:
                        '<bold>{{tablesOverrideNumber}}</bold> Tabellen werden überschrieben.',
                    proceed: 'Möchten Sie fortfahren?',
                },
                import: 'Importieren',
                cancel: 'Abbrechen',
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
            title: 'Bild exportieren',
            description: 'Wählen Sie den Skalierungsfaktor für den Export:',
            scale_1x: '1x (Niedrige Qualität)',
            scale_2x: '2x (Normale Qualität)',
            scale_4x: '4x (Beste Qualität)',
            cancel: 'Abbrechen',
            export: 'Exportieren',
            advanced_options: 'Advanced Options',
            pattern: 'Include background pattern',
            pattern_description: 'Add subtle grid pattern to background.',
            transparent: 'Transparent background',
            transparent_description: 'Remove background color from image.',
        },

        new_table_schema_dialog: {
            title: 'Schema auswählen',
            description:
                'Mehrere Schemas sind derzeit angezeigt. Wählen Sie eines für die neue Tabelle aus.',
            cancel: 'Abbrechen',
            confirm: 'Bestätigen',
        },

        update_table_schema_dialog: {
            title: 'Schema ändern',
            description: 'Schema der Tabelle "{{tableName}}" ändern',
            cancel: 'Abbrechen',
            confirm: 'Ändern',
        },
        create_table_schema_dialog: {
            title: 'Neues Schema erstellen',
            description:
                'Es existieren noch keine Schemas. Erstellen Sie Ihr erstes Schema, um Ihre Tabellen zu organisieren.',
            create: 'Erstellen',
            cancel: 'Abbrechen',
        },

        star_us_dialog: {
            title: 'Hilf uns, uns zu verbessern!',
            description:
                'Gefällt Ihnen SchemaFlow? Lassen Sie es uns wissen und helfen Sie uns, SchemaFlow zu verbessern!',
            close: 'Nicht jetzt',
            confirm: 'Natürlich!',
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
            one_to_one: 'Ein zu Eins (1:1)',
            one_to_many: 'Ein zu Viele (1:n)',
            many_to_one: 'Viele zu Eins (n:1)',
            many_to_many: 'Viele zu Viele (n:m)',
        },

        canvas_context_menu: {
            new_table: 'Neue Tabelle',
            new_view: 'Neue Ansicht',
            new_relationship: 'Neue Beziehung',
            new_area: 'Neuer Bereich',
            new_note: 'Neue Notiz',
        },

        table_node_context_menu: {
            edit_table: 'Tabelle bearbeiten',
            duplicate_table: 'Duplicate Table',
            delete_table: 'Tabelle löschen',
            add_relationship: 'Add Relationship',
            move_to_area: 'In Bereich verschieben',
            no_area: 'Kein Bereich',
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

        canvas: {
            all_tables_hidden: 'Alle Tabellen sind ausgeblendet',
            show_all_tables: 'Alle anzeigen',
            mobile_notice: {
                title: 'Mobile editing is limited',
                description:
                    'For reliable canvas editing, use a desktop browser. You can continue on this device.',
                dismiss: 'Dismiss mobile canvas notice',
            },
        },

        canvas_filter: {
            title: 'Tabellen filtern',
            search_placeholder: 'Tabellen suchen...',
            group_by_schema: 'Nach Schema gruppieren',
            group_by_area: 'Nach Bereich gruppieren',
            no_tables_found: 'Keine Tabellen gefunden',
            empty_diagram_description:
                'Erstellen Sie eine Tabelle, um zu beginnen',
            no_tables_description:
                'Versuchen Sie, Ihre Suche oder Filter anzupassen',
            clear_filter: 'Filter löschen',
        },

        snap_to_grid_tooltip: 'Snap to Grid (Hold {{key}})',

        tool_tips: {
            double_click_to_edit: 'Doppelklicken zum Bearbeiten',
        },

        language_select: {
            change_language: 'Sprache',
        },

        on: 'Ein',
        off: 'Aus',

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
    },
};

export const deMetadata: LanguageMetadata = {
    name: 'German',
    nativeName: 'Deutsch',
    code: 'de',
};
